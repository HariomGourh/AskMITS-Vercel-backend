const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Root Route ──────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AskMITS Backend Running',
    endpoints: {
      health:     'GET /health',
      chatbot:    'GET /api/chatbot?q=your_query',
      notices:    'GET /api/notices',
      events:     'GET /api/events',
      admissions: 'GET /api/admissions',
    }
  });
});

// ── API Routes (/api/chatbot, /api/notices, etc.) ───────────
app.use('/api', apiRoutes);

// ── Health Check ────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'AskMITS Scraper API is running.' });
});

// ── 404 Handler ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route not found. Visit / for available endpoints.`
  });
});

// ── Start Server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`[Server] AskMITS Backend Running → http://localhost:${PORT}`);
});
