import {
  createRepository as createRepoData,
  findAllRepositories,
  findRepositoryByGithubId,
  findRepositoryById,
} from '../repositories/repositoryData.js';
import {
  getRepository,
  getRepositoryFiles as getFilesFromGithub,
} from './githubApi.js';

function parseGithubUrl(rawUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    throw new Error('Invalid URL format');
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (hostname !== 'github.com' && hostname !== 'www.github.com') {
    throw new Error('URL must be a github.com repository URL');
  }

  const pathSegments = parsedUrl.pathname.split('/').filter(Boolean);
  if (pathSegments.length !== 2) {
    throw new Error('URL must be in the format https://github.com/owner/repository');
  }

  const owner = pathSegments[0];
  const repo = pathSegments[1].replace(/\.git$/i, '');

  if (!owner || !repo) {
    throw new Error('Invalid owner or repository in URL');
  }

  return { owner, repo };
}

export async function importRepository(url) {
  const { owner, repo } = parseGithubUrl(url);
  const metadata = await getRepository(owner, repo);

  const existing = await findRepositoryByGithubId(metadata.githubId);
  if (existing) {
    return existing;
  }

  return createRepoData(metadata);
}

export async function getAllRepositories() {
  return findAllRepositories();
}

export async function getRepositoryFiles(id) {
  const repository = await findRepositoryById(id);
  if (!repository) {
    throw new Error('Repository not found');
  }

  return getFilesFromGithub(repository.owner, repository.name, repository.defaultBranch);
}

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
