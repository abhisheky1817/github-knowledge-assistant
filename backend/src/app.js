import express from 'express';
import repositoryRoutes from './routes/repositoryRoutes.js';

const app = express();

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', repositoryRoutes);

export default app;
