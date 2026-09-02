import { Router } from 'express';
import {
  createRepository,
  getAllRepositories,
  getRepositoryByGithubId,
  getRepositoryById,
  getRepositoryFiles,
} from '../controllers/repositoryController.js';

const router = Router();

router.post('/repositories', createRepository);
router.get('/repositories', getAllRepositories);
router.get('/repositories/github/:githubId', getRepositoryByGithubId);
router.get('/repositories/:id', getRepositoryById);
router.get('/repositories/:id/files', getRepositoryFiles);

export default router;
