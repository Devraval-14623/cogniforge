const express = require('express');
const router = express.Router();
const { getQuizQuestions, submitQuiz, getProgress } = require('../controllers/progressController');
const protect = require('../middleware/authMiddleware');

router.get('/quiz/:materialId', protect, getQuizQuestions);
router.post('/submit', protect, submitQuiz);
router.get('/:materialId', protect, getProgress);

module.exports = router;