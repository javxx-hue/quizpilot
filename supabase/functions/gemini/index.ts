// Gemini proxy: keeps the API key on the server and enforces a daily
// per-user limit. Called by the app via supabase.functions.invoke('gemini').
// Secrets: GEMINI_API_KEY (required), GEMINI_MODEL, AI_DAILY_LIMIT, ALLOWED_ORIGINS
import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders, json } from '../_shared/cors.ts';

const MODEL = Deno.env.get('GEMINI_MODEL') ?? 'gemini-3.8-flash';
const DAILY_LIMIT = Number(Deno.env.get('AI_DAILY_LIMIT') ?? '100');
const MAX_BODY_BYTES = 8 * 1024 * 1024; // photos are sent inline as base64

type Part =
  | { text: string }
  | { inline_data: { mime_type: string; data: string } }
  | { file_data: { file_uri: string } };

function validParts(parts: unknown): parts is Part[] {
  if (!Array.isArray(parts) || parts.length === 0 || parts.length > 10) return false;
  return parts.every((p) => {
    if (typeof p?.text === 'string') return true;
    if (typeof p?.inline_data?.data === 'string') return /^image\//.test(p.inline_data.mime_type ?? '');
    // Only YouTube links: Gemini would otherwise fetch arbitrary URLs for us
    if (typeof p?.file_data?.file_uri === 'string') return /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/.test(p.file_data.file_uri);
    return false;
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(req) });
  if (req.method !== 'POST') return json(req, { error: 'Method not allowed' }, 405);

  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) return json(req, { error: 'Server is missing GEMINI_API_KEY' }, 500);

  if (Number(req.headers.get('content-length') ?? '0') > MAX_BODY_BYTES) {
    return json(req, { error: 'Request too large' }, 413);
  }

  // Acts as the calling user so RLS and auth.uid() apply
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
  });
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return json(req, { error: 'Not signed in' }, 401);

  let body: { parts?: unknown; json?: boolean; temperature?: number };
  try {
    body = await req.json();
  } catch {
    return json(req, { error: 'Invalid JSON' }, 400);
  }
  if (!validParts(body.parts)) return json(req, { error: 'Invalid parts' }, 400);

  const { data: allowed, error: quotaError } = await supabase.rpc('consume_ai_quota', { daily_limit: DAILY_LIMIT });
  if (quotaError) return json(req, { error: 'Quota check failed' }, 500);
  if (!allowed) return json(req, { error: 'Daily AI limit reached' }, 429);

  const temperature = typeof body.temperature === 'number' ? Math.min(Math.max(body.temperature, 0), 1) : 0.4;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
    body: JSON.stringify({
      contents: [{ parts: body.parts }],
      generationConfig: { temperature, ...(body.json ? { responseMimeType: 'application/json' } : {}) },
    }),
  });

  if (!response.ok) {
    console.error('Gemini error', response.status, (await response.text()).slice(0, 500));
    return json(req, { error: `Gemini ${response.status}` }, 502);
  }
  const data = await response.json();
  const text = (data?.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('');
  return json(req, { text });
});
