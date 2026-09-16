import { Router } from 'express';
import {
  createRepository,
  getAllRepositories,
  getFileContent,
  getRepositoryByGithubId,
  getRepositoryById,
  getRepositoryFiles,
  indexRepository,
  searchRepositoryCode,
} from '../controllers/repositoryController.js';

const router = Router();

router.post('/repositories', createRepository);
router.get('/repositories', getAllRepositories);
router.get('/repositories/github/:githubId', getRepositoryByGithubId);
router.get('/repositories/:id', getRepositoryById);
router.get('/repositories/:id/files', getRepositoryFiles);
router.get('/repositories/:id/files/content', getFileContent);
router.post('/repositories/:id/index', indexRepository);
router.post('/repositories/:id/search', searchRepositoryCode);

export default router;
