import qdrantClient from '../lib/qdrantClient.js';
import { ensureCodeChunksCollection } from '../lib/qdrantCollection.js';

const COLLECTION_NAME = 'codeChunks';
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isValidQdrantId(id) {
  if (typeof id === 'number') {
    return Number.isInteger(id) && id >= 0;
  }
  if (typeof id === 'string') {
    return UUID_RE.test(id);
  }
  return false;
}

export async function saveCodeChunkVector({
  id,
  vector,
  repositoryId,
  filePath,
  startLine,
  endLine,
  content,
}) {
  if (!isValidQdrantId(id)) {
    throw new Error('id must be an unsigned integer or a UUID string');
  }
  if (!repositoryId) {
    throw new Error('repositoryId is required');
  }
  if (typeof filePath !== 'string' || filePath.length === 0) {
    throw new Error('filePath must be a non-empty string');
  }
  if (typeof content !== 'string') {
    throw new Error('content must be a string');
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
  if (!Array.isArray(vector) || vector.length === 0 || !vector.every(v => typeof v === 'number')) {
    throw new Error('vector must be a non-empty array of numbers');
  }

  await ensureCodeChunksCollection();

  await qdrantClient.upsert(COLLECTION_NAME, {
    points: [
      {
        id,
        vector,
        payload: {
          repositoryId,
          filePath,
          startLine,
          endLine,
          content,
        },
      },
    ],
  });

  return { success: true, id };
}
