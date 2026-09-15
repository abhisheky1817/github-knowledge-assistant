import { GoogleGenAI } from '@google/genai';

let client;

function getClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is not set');
  }

  if (!client || client.apiKey !== apiKey) {
    client = new GoogleGenAI({ apiKey });
  }

  return client;
}

export async function generateEmbedding(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text must be a non-empty string');
  }

  const ai = getClient();
  const response = await ai.models.embedContent({
    model: 'gemini-embedding-2',
    contents: text,
    config: {
      outputDimensionality: 1536,
    },
  });

  return response.embedding?.values || response.embeddings?.[0]?.values;
}
