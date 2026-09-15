import { createHash } from 'crypto';
import path from 'path';
import { getRepositoryFiles, getFileContent } from './githubApi.js';
import { chunkCode } from './codeChunker.js';
import { storeCodeChunk } from './vectorService.js';

const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'ico', 'webp', 'bmp', 'tiff', 'svg',
  'mp3', 'mp4', 'wav', 'avi', 'mov', 'mkv', 'webm', 'ogg', 'flac',
  'pdf', 'zip', 'tar', 'gz', 'bz2', '7z', 'rar',
  'woff', 'woff2', 'ttf', 'eot', 'otf',
  'exe', 'dll', 'so', 'dylib', 'bin', 'obj', 'o', 'a', 'lib', 'class', 'jar', 'wasm', 'pyc',
  'db', 'sqlite', 'sqlite3',
]);

function isBinaryFile(filePath) {
  const ext = path.extname(filePath).toLowerCase().slice(1);
  return BINARY_EXTENSIONS.has(ext);
}

function generateChunkId(repositoryId, filePath, startLine, endLine) {
  const key = `${repositoryId}:${filePath}:${startLine}:${endLine}`;
  const hash = createHash('sha256').update(key).digest('hex');
  return [
    hash.slice(0, 8),
    hash.slice(8, 12),
    '5' + hash.slice(13, 16),
    ((parseInt(hash.slice(16, 18), 16) & 0x3f) | 0x80).toString(16).padStart(2, '0') + hash.slice(18, 20),
    hash.slice(20, 32),
  ].join('-');
}

export async function indexRepository(repository) {
  if (!repository) {
    throw new Error('Repository is required');
  }

  const { owner, name, defaultBranch } = repository;
  if (!owner || !name || !defaultBranch) {
    throw new Error('Repository owner, name, and defaultBranch are required');
  }

  const repositoryId = repository.id || repository.githubId;
  if (!repositoryId) {
    throw new Error('Repository id or githubId is required');
  }

  const files = await getRepositoryFiles(owner, name, defaultBranch);

  let filesIndexed = 0;
  let chunksIndexed = 0;

  for (const file of files) {
    if (file.size === 0 || isBinaryFile(file.path)) {
      continue;
    }

    const { content } = await getFileContent(owner, name, defaultBranch, file.path);
    if (!content || content.trim().length === 0) {
      continue;
    }

    const chunks = chunkCode(content);
    if (chunks.length === 0) {
      continue;
    }

    for (const chunk of chunks) {
      if (!chunk.content || chunk.content.trim().length === 0) {
        continue;
      }

      await storeCodeChunk({
        id: generateChunkId(repositoryId, file.path, chunk.startLine, chunk.endLine),
        repositoryId,
        filePath: file.path,
        startLine: chunk.startLine,
        endLine: chunk.endLine,
        content: chunk.content,
      });

      chunksIndexed++;
    }

    filesIndexed++;
  }

  return {
    repositoryId,
    filesIndexed,
    chunksIndexed,
  };
}
