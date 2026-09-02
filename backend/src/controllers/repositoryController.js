import {
  createRepository as createRepoService,
  getRepositoryByGithubId as getRepoByGithubIdService,
  getRepositoryById as getRepoByIdService,
} from '../services/repositoryService.js';

export async function createRepository(req, res) {
  try {
    const { githubId, name, fullName, owner, url, description, defaultBranch } = req.body;

    if (!githubId || !name || !fullName || !owner || !url || !defaultBranch) {
      return res.status(400).json({ error: 'Missing required repository fields' });
    }

    const parsedGithubId = Number(githubId);
    if (Number.isNaN(parsedGithubId)) {
      return res.status(400).json({ error: 'Invalid githubId' });
    }

    const repository = await createRepoService({
      githubId: parsedGithubId,
      name,
      fullName,
      owner,
      url,
      description: description ?? null,
      defaultBranch,
    });

    return res.status(201).json(repository);
  } catch {
    return res.status(500).json({ error: 'Failed to create repository' });
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
