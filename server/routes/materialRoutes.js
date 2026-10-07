const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterials, getStudyAids } = require('../controllers/materialController');
const protect = require('../middleware/authMiddleware');
const upload = require('../multerconfig');

router.post('/upload', protect, upload.single('pdf'), uploadMaterial);
router.get('/:materialId/study-aids', protect, getStudyAids);
router.get('/', protect, getMaterials);

module.exports = router;
