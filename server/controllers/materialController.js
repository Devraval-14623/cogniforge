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
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text.trim();

    if (!extractedText) {
      return res.status(422).json({ message: 'Could not extract readable text from this PDF' });
    }

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
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ materials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET GENERATED STUDY AIDS FOR ONE MATERIAL
const getStudyAids = async (req, res) => {
  try {
    const material = await prisma.material.findFirst({
      where: { id: req.params.materialId, userId: req.userId },
      select: {
        id: true,
        title: true,
        summary: true,
        flashcards: {
          orderBy: { id: 'asc' },
          select: { id: true, topic: true, importance: true, importanceNote: true, question: true, answer: true },
        },
        quizzes: {
          orderBy: { id: 'asc' },
          select: { id: true, question: true, options: true, correctAns: true },
        },
      },
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    res.status(200).json({
      materialId: material.id,
      title: material.title,
      summary: material.summary,
      flashcards: material.flashcards,
      quiz: material.quizzes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to load saved study aids', error: error.message });
  }
};

module.exports = { uploadMaterial, getMaterials, getStudyAids };
