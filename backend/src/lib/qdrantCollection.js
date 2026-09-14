import qdrantClient from './qdrantClient.js';

const COLLECTION_NAME = 'codeChunks';
const VECTOR_SIZE = 1536;
const DISTANCE = 'Cosine';

export async function ensureCodeChunksCollection() {
  const { exists } = await qdrantClient.collectionExists(COLLECTION_NAME);
  if (exists) {
    return;
  }

  await qdrantClient.createCollection(COLLECTION_NAME, {
    vectors: {
      size: VECTOR_SIZE,
      distance: DISTANCE,
    },
  });
}
