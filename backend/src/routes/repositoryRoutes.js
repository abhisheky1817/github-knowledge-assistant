import { Router } from 'express';
import {
  createRepository,
  getRepositoryByGithubId,
  getRepositoryById,
} from '../controllers/repositoryController.js';

const router = Router();

router.post('/repositories', createRepository);
router.get('/repositories/github/:githubId', getRepositoryByGithubId);
router.get('/repositories/:id', getRepositoryById);

export default router;
