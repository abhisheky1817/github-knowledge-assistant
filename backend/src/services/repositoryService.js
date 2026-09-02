import {
  createRepository as createRepoData,
  findRepositoryByGithubId,
  findRepositoryById,
} from '../repositories/repositoryData.js';

export async function createRepository(data) {
  const existing = await findRepositoryByGithubId(data.githubId);
  if (existing) {
    return existing;
  }

  return createRepoData(data);
}

export async function getRepositoryByGithubId(githubId) {
  return findRepositoryByGithubId(githubId);
}

export async function getRepositoryById(id) {
  return findRepositoryById(id);
}
