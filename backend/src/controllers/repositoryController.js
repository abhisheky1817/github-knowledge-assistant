import {
  importRepository,
  getAllRepositories as getAllReposService,
  getRepositoryByGithubId as getRepoByGithubIdService,
  getRepositoryById as getRepoByIdService,
  getRepositoryFiles as getRepoFilesService,
} from '../services/repositoryService.js';

export async function createRepository(req, res) {
  try {
    const { url } = req.body;

    if (!url || typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Valid repository URL is required' });
    }

    const before = Date.now();
    const repository = await importRepository(url.trim());

    const isNew = new Date(repository.createdAt).getTime() >= before;
    const statusCode = isNew ? 201 : 200;

    return res.status(statusCode).json(repository);
  } catch (err) {
    if (
      err.message.includes('URL') ||
      err.message.includes('Invalid') ||
      err.message.includes('required')
    ) {
      return res.status(400).json({ error: err.message });
    }

    if (err.message.includes('not found')) {
      return res.status(404).json({ error: 'Repository not found on GitHub' });
    }

    return res.status(500).json({ error: 'Failed to import repository' });
  }
}

export async function getAllRepositories(req, res) {
  try {
    const repositories = await getAllReposService();
    return res.status(200).json(repositories);
  } catch {
    return res.status(500).json({ error: 'Failed to retrieve repositories' });
  }
}

export async function getRepositoryByGithubId(req, res) {
  try {
    const githubId = Number(req.params.githubId);
    if (Number.isNaN(githubId)) {
      return res.status(400).json({ error: 'Invalid githubId' });
    }

    const repository = await getRepoByGithubIdService(githubId);
    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    return res.status(200).json(repository);
  } catch {
    return res.status(500).json({ error: 'Failed to retrieve repository' });
  }
}

export async function getRepositoryById(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing repository id' });
    }

    const repository = await getRepoByIdService(id);
    if (!repository) {
      return res.status(404).json({ error: 'Repository not found' });
    }

    return res.status(200).json(repository);
  } catch {
    return res.status(500).json({ error: 'Failed to retrieve repository' });
  }
}

export async function getRepositoryFiles(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'Missing repository id' });
    }

    const files = await getRepoFilesService(id);
    return res.status(200).json(files);
  } catch (err) {
    if (err.message === 'Repository not found') {
      return res.status(404).json({ error: 'Repository not found' });
    }

    if (err.message.includes('not found')) {
      return res.status(404).json({ error: 'Repository or branch not found on GitHub' });
    }

    if (err.message.includes('too large') || err.message.includes('truncated')) {
      return res.status(422).json({ error: 'Repository file tree is too large to display' });
    }

    return res.status(500).json({ error: 'Failed to retrieve repository files' });
  }
}
