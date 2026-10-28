import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

let apiKey = 'test-key';
vi.mock('./storage', () => ({ getApiKey: () => apiKey }));

import { generateStudySet, GenerationError } from './ai';

function mockGemini(payload: unknown, status = 200) {
  const text = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const fetchMock = vi.fn().mockResolvedValue({
    ok: status === 200,
    status,
    text: async () => text,
    json: async () => ({ candidates: [{ content: { parts: [{ text }] } }] }),
  });
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

const base = { rawContent: 'Fotosintez xloroplastlarda boradi.', sourceType: 'text' as const, title: 'Biologiya' };

describe('generateStudySet', () => {
  beforeEach(() => {
    apiKey = 'test-key';
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fails clearly without an API key instead of inventing questions', async () => {
    apiKey = '';
    await expect(generateStudySet({ ...base, targetType: 'quiz' })).rejects.toMatchObject({ code: 'NO_API_KEY' });
  });

  it('rejects empty source text', async () => {
    await expect(generateStudySet({ ...base, rawContent: '   ', targetType: 'quiz' })).rejects.toMatchObject({ code: 'EMPTY_SOURCE' });
  });

  it('sends the key in a header, not in the URL', async () => {
    const fetchMock = mockGemini({
      questions: [{ question: 'Qayerda?', options: ['Xloroplast', 'Yadro'], correctAnswer: 0 }],
    });
    await generateStudySet({ ...base, targetType: 'quiz' });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).not.toContain('test-key');
    expect(init.headers['x-goog-api-key']).toBe('test-key');
  });

  it('keeps valid questions and drops ones with an out-of-range answer', async () => {
    mockGemini({
      title: 'Fotosintez',
      questions: [
        { question: 'Qayerda boradi?', options: ['Xloroplast', 'Yadro', 'Ribosoma', 'Lizosoma'], correctAnswer: 0, explanation: '1-sahifa' },
        { question: 'Buzuq', options: ['A', 'B'], correctAnswer: 5 },
        { question: '', options: ['A', 'B'], correctAnswer: 0 },
      ],
    });
    const set = await generateStudySet({ ...base, targetType: 'quiz' });
    expect(set.title).toBe('Fotosintez');
    expect(set.questions).toHaveLength(1);
    expect(set.itemCount).toBe(1);
    expect(set.questions![0].correctAnswer).toBe(0);
  });

  it('errors when no question survives validation', async () => {
    mockGemini({ questions: [{ question: 'Buzuq', options: ['A'], correctAnswer: 3 }] });
    await expect(generateStudySet({ ...base, targetType: 'quiz' })).rejects.toBeInstanceOf(GenerationError);
  });

  it('errors on non-JSON output', async () => {
    mockGemini('not json at all');
    await expect(generateStudySet({ ...base, targetType: 'flashcards' })).rejects.toMatchObject({ code: 'BAD_RESPONSE' });
  });

  it('reports HTTP failures as API_ERROR', async () => {
    mockGemini({ error: 'model not found' }, 404);
    await expect(generateStudySet({ ...base, targetType: 'notes' })).rejects.toMatchObject({ code: 'API_ERROR' });
  });

  it('builds flashcards and notes from valid responses', async () => {
    mockGemini({ flashcards: [{ front: 'Xloroplast', back: 'Fotosintez organoidi' }, { front: '', back: 'x' }] });
    const deck = await generateStudySet({ ...base, targetType: 'flashcards' });
    expect(deck.flashcards).toHaveLength(1);

    mockGemini({ summary: 'Qisqa mazmun', keyPoints: ['a', 5], glossary: [{ term: 'ATF', definition: 'energiya' }, { term: 'x' }] });
    const notes = await generateStudySet({ ...base, targetType: 'notes' });
    expect(notes.notes!.keyPoints).toEqual(['a']);
    expect(notes.notes!.glossary).toHaveLength(1);
  });
});
