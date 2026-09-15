import { generateEmbedding } from './embeddingService.js';
import { saveCodeChunkVector } from '../repositories/codeVectorData.js';

export async function storeCodeChunk({
  id,
  repositoryId,
  filePath,
  startLine,
  endLine,
  content,
}) {
  if (!id) {
    throw new Error('id is required');
  }
  if (!repositoryId) {
    throw new Error('repositoryId is required');
  }
  if (typeof filePath !== 'string' || filePath.length === 0) {
    throw new Error('filePath must be a non-empty string');
  }
  if (!Number.isInteger(startLine) || startLine < 1) {
    throw new Error('startLine must be a positive integer');
  }
  if (!Number.isInteger(endLine) || endLine < 1) {
    throw new Error('endLine must be a positive integer');
  }
  if (endLine < startLine) {
    throw new Error('endLine must not be less than startLine');
  }
  if (typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('content must be a non-empty string');
  }

  const vector = await generateEmbedding(content);

  return saveCodeChunkVector({
    id,
    vector,
    repositoryId,
    filePath,
    startLine,
    endLine,
    content,
  });
}
