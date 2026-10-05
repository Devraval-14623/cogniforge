const { GoogleGenerativeAI } = require('@google/generative-ai');
const prisma = require('../prisma');

const generateStudyAids = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.startsWith('replace-with-')) {
      return res.status(503).json({
        message: 'AI generation is not configured. Set GEMINI_API_KEY on the server.',
      });
    }

    const { materialId } = req.params;
    const material = await prisma.material.findFirst({
      where: { id: materialId, userId: req.userId },
    });

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const prompt = `You are a study assistant. Based on the following study material, generate:
1. A concise summary (3-5 sentences covering the key points)
2. 5 flashcards (question and answer pairs)
3. 5 multiple choice quiz questions (with 4 options each and the correct answer)

Respond ONLY with valid JSON in this exact format, no other text:
{
  "summary": "...",
  "flashcards": [{ "question": "...", "answer": "..." }],
  "quiz": [{ "question": "...", "options": ["...", "...", "...", "..."], "correctAns": "..." }]
}

Study Material:
${material.content.substring(0, 8000)}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });
    const result = await model.generateContent(prompt);
    const cleanText = result.response.text().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanText);

    await prisma.$transaction([
      ...parsed.flashcards.map((fc) => prisma.flashcard.create({
        data: { question: fc.question, answer: fc.answer, materialId: material.id },
      })),
      ...parsed.quiz.map((q) => prisma.quiz.create({
        data: { question: q.question, options: JSON.stringify(q.options), correctAns: q.correctAns, materialId: material.id },
      })),
    ]);

    res.status(200).json({
      message: 'Study aids generated successfully',
      summary: parsed.summary,
      flashcards: parsed.flashcards,
      quiz: parsed.quiz,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI generation failed', error: error.message });
  }
};

module.exports = { generateStudyAids };
