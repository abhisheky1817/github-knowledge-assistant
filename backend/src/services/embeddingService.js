import OpenAI from 'openai';

let client;

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }

  if (!client || client.apiKey !== apiKey) {
    client = new OpenAI({ apiKey });
  }

  return client;
}

export async function generateEmbedding(text) {
  if (typeof text !== 'string' || text.trim().length === 0) {
    throw new Error('Text must be a non-empty string');
  }

  const openai = getClient();
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  });

  return response.data[0].embedding;
}
