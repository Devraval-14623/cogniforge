const fs = require('fs');
const pdfParse = require('pdf-parse');
const prisma = require('../prisma');

// UPLOAD PDF AND EXTRACT TEXT
const uploadMaterial = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF file' });
    }

    const { title } = req.body;
    const filePath = req.file.path;

    // PDF file read karo aur text extract karo
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    // Database mein save karo
    const material = await prisma.material.create({
      data: {
        title: title || req.file.originalname,
        content: extractedText,
        userId: req.userId,
      },
    });

    res.status(201).json({
      message: 'PDF uploaded and text extracted successfully',
      material: {
        id: material.id,
        title: material.title,
        contentPreview: extractedText.substring(0, 200) + '...',
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET ALL MATERIALS OF LOGGED IN USER
const getMaterials = async (req, res) => {
  try {
    const materials = await prisma.material.findMany({
      where: { userId: req.userId },
      select: { id: true, title: true, createdAt: true },
    });

    res.status(200).json({ materials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { uploadMaterial, getMaterials };