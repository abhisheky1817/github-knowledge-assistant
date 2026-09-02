import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// --- Routes ---

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// --- Start ---

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
