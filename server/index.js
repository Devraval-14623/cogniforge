const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const aiRoutes = require('./routes/aiRoutes');
const progressRoutes = require('./routes/progressRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'CogniForge backend is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/progress', progressRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});





