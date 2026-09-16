import qdrantClient from '../lib/qdrantClient.js';

const COLLECTION_NAME = 'codeChunks';
const DEFAULT_LIMIT = 10;

export async function searchCodeChunkVectors(vector, repositoryId, limit) {
  if (!Array.isArray(vector) || vector.length === 0 || !vector.every(v => typeof v === 'number' && Number.isFinite(v))) {
    throw new Error('vector must be a non-empty array of numbers');
  }

  if (!repositoryId || (typeof repositoryId === 'string' && repositoryId.trim().length === 0)) {
    throw new Error('repositoryId is required');
  }

  const finalLimit = limit === undefined || limit === null ? DEFAULT_LIMIT : limit;

  if (!Number.isInteger(finalLimit) || finalLimit < 1) {
    throw new Error('limit must be a positive integer');
  }

  return await qdrantClient.query(COLLECTION_NAME, {
    query: vector,
    filter: {
      must: [
        {
          key: 'repositoryId',
          match: {
            value: repositoryId,
          },
        },
      ],
    },
    limit: finalLimit,
    with_payload: true,
    with_vector: false,
  });
}
