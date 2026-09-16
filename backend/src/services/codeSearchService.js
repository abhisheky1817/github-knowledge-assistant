import { generateEmbedding } from './embeddingService.js';
import { searchCodeChunkVectors } from '../repositories/codeVectorSearchData.js';

export async function searchCode(question, repositoryId, limit) {
  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new Error('question must be a non-empty string');
  }

  if (!repositoryId || (typeof repositoryId === 'string' && repositoryId.trim().length === 0)) {
    throw new Error('repositoryId is required');
  }

  const vector = await generateEmbedding(question.trim());

  return searchCodeChunkVectors(vector, repositoryId, limit);
}
