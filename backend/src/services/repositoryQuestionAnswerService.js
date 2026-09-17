import { searchCode } from './codeSearchService.js';
import { generateAnswer } from './answerGenerationService.js';

export async function answerRepositoryQuestion(question, repositoryId, limit) {
  if (typeof question !== 'string' || question.trim().length === 0) {
    throw new Error('question must be a non-empty string');
  }

  if (!repositoryId || (typeof repositoryId === 'string' && repositoryId.trim().length === 0)) {
    throw new Error('repositoryId is required');
  }

  if (limit !== undefined && limit !== null && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error('limit must be a positive integer');
  }

  const searchResults = await searchCode(question, repositoryId, limit);
  const points = Array.isArray(searchResults?.points)
    ? searchResults.points
    : (Array.isArray(searchResults) ? searchResults : []);

  const answer = await generateAnswer(question, points);

  const sources = points.map(point => ({
    filePath: point.filePath ?? point.payload?.filePath ?? '',
    startLine: point.startLine ?? point.payload?.startLine ?? null,
    endLine: point.endLine ?? point.payload?.endLine ?? null,
    score: point.score ?? point.payload?.score ?? null,
  }));

  return {
    answer,
    sources,
  };
}
