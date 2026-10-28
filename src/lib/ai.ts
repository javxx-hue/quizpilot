import { StudySet, StudySetType, Difficulty, Language, QuizQuestion, Flashcard } from '../types';
import { getApiKey } from './storage';

export interface GenerationParams {
  rawContent: string;
  sourceType: 'text' | 'pdf' | 'youtube' | 'prompt' | 'topic';
  targetType: StudySetType;
  title?: string;
  count?: number;
  difficulty?: Difficulty;
  language?: Language;
}

// Model can be overridden with VITE_GEMINI_MODEL when Google retires the default.
const GEMINI_MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-3.8-flash';

export type GenerationErrorCode = 'NO_API_KEY' | 'API_ERROR' | 'BAD_RESPONSE' | 'EMPTY_SOURCE';

export class GenerationError extends Error {
  constructor(public code: GenerationErrorCode, message: string) {
    super(message);
    this.name = 'GenerationError';
  }
}

// -------------------------------------------------------------
// Google Gemini API call (REST, key sent in header, not in the URL)
// -------------------------------------------------------------
async function callGeminiApi(prompt: string, apiKey: string): Promise<string> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new GenerationError('API_ERROR', `Gemini API ${response.status}: ${errorText.slice(0, 300)}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new GenerationError('BAD_RESPONSE', 'Gemini returned an empty response.');
  }
  return textOutput;
}

function buildPrompt(params: GenerationParams): string {
  const { rawContent, sourceType, targetType, title, count = 5, difficulty = 'medium', language = 'uz' } = params;
  const grounding =
    sourceType === 'topic'
      ? 'The source below is only a topic name. Use well-established textbook knowledge and avoid uncertain claims.'
      : 'Use ONLY the source material below. Do not invent facts that are not supported by it. When the source has [Sahifa N] markers, mention the page in explanations.';
  return `
You are an educational assistant helping university students prepare for exams.
${grounding}

Language: ${language === 'uz' ? "Uzbek (O'zbek tili, lotin yozuvi)" : 'English'}
Target Type: ${targetType}
Difficulty: ${difficulty}
Count: ${count}
Title: ${title || 'Infer an appropriate concise title'}

Source Material:
"""
${rawContent.slice(0, 20000)}
"""

Output MUST be strict valid JSON matching one of these formats:

If targetType is "quiz" or "exam":
{
  "title": "Set title",
  "description": "Short description of the quiz",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0,
      "hint": "Helpful hint without revealing the answer",
      "explanation": "Why this answer is correct, citing the source"
    }
  ]
}
"correctAnswer" is the 0-based index of the correct option. Vary its position across questions.

If targetType is "flashcards":
{
  "title": "Deck title",
  "description": "Short description",
  "flashcards": [
    { "front": "Term / Question", "back": "Clear definition / Answer", "example": "Example from the source" }
  ]
}

If targetType is "notes":
{
  "title": "Document title",
  "summary": "Executive summary paragraph",
  "keyPoints": ["Bullet point 1", "Bullet point 2", "Bullet point 3"],
  "glossary": [{ "term": "Key term", "definition": "Clear concise definition" }]
}
`;
}

const isNonEmptyString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

function parseQuestions(raw: unknown, now: number): QuizQuestion[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (q: any) =>
        isNonEmptyString(q?.question) &&
        Array.isArray(q?.options) &&
        q.options.length >= 2 &&
        q.options.every(isNonEmptyString) &&
        Number.isInteger(q?.correctAnswer) &&
        q.correctAnswer >= 0 &&
        q.correctAnswer < q.options.length
    )
    .map((q: any, i: number) => ({
      id: `q-${now}-${i}`,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      hint: isNonEmptyString(q.hint) ? q.hint : '',
      explanation: isNonEmptyString(q.explanation) ? q.explanation : '',
    }));
}

function parseFlashcards(raw: unknown, now: number): Flashcard[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((fc: any) => isNonEmptyString(fc?.front) && isNonEmptyString(fc?.back))
    .map((fc: any, i: number) => ({
      id: `fc-${now}-${i}`,
      front: fc.front,
      back: fc.back,
      example: isNonEmptyString(fc.example) ? fc.example : undefined,
    }));
}

// -------------------------------------------------------------
// Main entry point. Throws GenerationError instead of faking results.
// -------------------------------------------------------------
export async function generateStudySet(params: GenerationParams): Promise<StudySet> {
  const { rawContent, targetType, title, difficulty = 'medium', sourceType } = params;

  if (!rawContent.trim()) {
    throw new GenerationError('EMPTY_SOURCE', 'Source material is empty.');
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new GenerationError('NO_API_KEY', 'Gemini API key is not set.');
  }

  const rawJson = await callGeminiApi(buildPrompt(params), apiKey);

  let parsed: any;
  try {
    parsed = JSON.parse(rawJson);
  } catch {
    throw new GenerationError('BAD_RESPONSE', 'Gemini response is not valid JSON.');
  }

  const now = Date.now();
  const base = {
    id: `set-${now}`,
    title: isNonEmptyString(parsed.title) ? parsed.title : title || 'AI Generated Set',
    type: targetType,
    description: isNonEmptyString(parsed.description) ? parsed.description : '',
    createdAt: now,
    difficulty,
    sourceType,
    sourceSnippet: rawContent.slice(0, 200),
  };

  if (targetType === 'quiz' || targetType === 'exam') {
    const questions = parseQuestions(parsed.questions, now);
    if (questions.length === 0) throw new GenerationError('BAD_RESPONSE', 'No valid questions in response.');
    return { ...base, itemCount: questions.length, questions };
  }

  if (targetType === 'flashcards') {
    const flashcards = parseFlashcards(parsed.flashcards, now);
    if (flashcards.length === 0) throw new GenerationError('BAD_RESPONSE', 'No valid flashcards in response.');
    return { ...base, itemCount: flashcards.length, flashcards };
  }

  if (!isNonEmptyString(parsed.summary)) {
    throw new GenerationError('BAD_RESPONSE', 'Notes summary missing in response.');
  }
  return {
    ...base,
    itemCount: 1,
    notes: {
      id: `note-${now}`,
      title: base.title,
      summary: parsed.summary,
      keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.filter(isNonEmptyString) : [],
      glossary: Array.isArray(parsed.glossary)
        ? parsed.glossary.filter((g: any) => isNonEmptyString(g?.term) && isNonEmptyString(g?.definition))
        : [],
    },
  };
}

export function describeGenerationError(error: unknown, lang: Language): string {
  const isUz = lang === 'uz';
  const code = error instanceof GenerationError ? error.code : 'API_ERROR';
  switch (code) {
    case 'NO_API_KEY':
      return isUz
        ? 'Gemini API kaliti kiritilmagan. Yuqoridagi kalit belgisini bosib, kalitni kiriting.'
        : 'Gemini API key is missing. Click the key icon in the header to add it.';
    case 'EMPTY_SOURCE':
      return isUz ? 'Manbadan matn olinmadi. Boshqa fayl yoki matn bilan urinib ko\'ring.' : 'No text could be extracted from the source.';
    case 'BAD_RESPONSE':
      return isUz ? 'AI javobi noto\'g\'ri formatda keldi. Qayta urinib ko\'ring.' : 'The AI returned an invalid response. Please try again.';
    default:
      return isUz ? 'AI xizmatiga ulanib bo\'lmadi. Kalit va internetni tekshiring.' : 'Could not reach the AI service. Check your key and connection.';
  }
}
