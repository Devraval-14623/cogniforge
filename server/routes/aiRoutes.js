const express = require('express');
const router = express.Router();
const { generateStudyAids } = require('../controllers/aiController');
const protect = require('../middleware/authMiddleware');

router.post('/generate/:materialId', protect, generateStudyAids);

module.exports = router;