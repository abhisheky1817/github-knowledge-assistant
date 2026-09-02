export function chunkCode(content, options = {}) {
  if (typeof content !== 'string') {
    throw new TypeError('Content must be a string');
  }

  if (content.length === 0) {
    return [];
  }

  const { chunkSize = 80, overlap = 10 } = options;

  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error('Chunk size must be a positive integer');
  }

  if (!Number.isInteger(overlap) || overlap < 0) {
    throw new Error('Overlap must be a non-negative integer');
  }

  if (overlap >= chunkSize) {
    throw new Error('Overlap must be smaller than chunk size');
  }

  const lines = content.split(/\r?\n/);
  if (lines.length === 0) {
    return [];
  }

  const chunks = [];
  const step = chunkSize - overlap;

  for (let i = 0; i < lines.length; i += step) {
    const chunkLines = lines.slice(i, i + chunkSize);
    chunks.push({
      content: chunkLines.join('\n'),
      startLine: i + 1,
      endLine: i + chunkLines.length,
    });

    if (i + chunkSize >= lines.length) {
      break;
    }
  }

  return chunks;
}
