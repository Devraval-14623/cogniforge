const express = require('express');
const router = express.Router();
const { uploadMaterial, getMaterials } = require('../controllers/materialController');
const protect = require('../middleware/authMiddleware');
const upload = require('../multerconfig');

router.post('/upload', protect, upload.single('pdf'), uploadMaterial);
router.get('/', protect, getMaterials);

module.exports = router;
