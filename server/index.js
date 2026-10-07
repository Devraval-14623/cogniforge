const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const prisma = require('./prisma');

dotenv.config({ path: path.resolve(__dirname, '.env') });

const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const aiRoutes = require('./routes/aiRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const aiConfigured = Boolean(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.startsWith('replace-with-'));
const allowedOrigins = (process.env.FRONTEND_URL || '*')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

fs.mkdirSync(path.resolve(__dirname, 'uploads'), { recursive: true });

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Origin is not allowed by CORS'));
  },
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CogniForge backend is running!' });
});

app.get('/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected', aiConfigured });
  } catch (error) {
    res.status(503).json({ status: 'error', database: 'unavailable', message: error.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(400).json({ message: err.message || 'Request failed' });
});

if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Signup and login will fail until it is configured.');
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
