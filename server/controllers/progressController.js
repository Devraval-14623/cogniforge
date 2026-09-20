const prisma = require('../prisma');

// Quiz questions fetch karo (correct answer nahi bhejenge, warna cheating ho jaayegi)
const getQuizQuestions = async (req, res) => {
  try {
    const { materialId } = req.params;

    const material = await prisma.material.findFirst({
      where: { id: materialId, userId: req.userId },
    });
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const quizzes = await prisma.quiz.findMany({
      where: { materialId },
      select: { id: true, question: true, options: true },
    });

    if (quizzes.length === 0) {
      return res.status(404).json({ message: 'No quiz found. Generate study aids first.' });
    }

    res.status(200).json({ quiz: quizzes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User ke answers submit karo, score calculate karo, attempt save karo
const submitQuiz = async (req, res) => {
  try {
    const { materialId, answers } = req.body; // answers: [{ quizId, selectedOption }]

    const material = await prisma.material.findFirst({
      where: { id: materialId, userId: req.userId },
    });
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const quizzes = await prisma.quiz.findMany({ where: { materialId } });

    let score = 0;
    const results = quizzes.map((q) => {
      const userAnswer = answers.find((a) => a.quizId === q.id);
      const isCorrect = userAnswer && userAnswer.selectedOption === q.correctAns;
      if (isCorrect) score++;
      return {
        quizId: q.id,
        question: q.question,
        correctAns: q.correctAns,
        selectedOption: userAnswer ? userAnswer.selectedOption : null,
        isCorrect,
      };
    });

    await prisma.quizAttempt.create({
      data: { score, total: quizzes.length, materialId, userId: req.userId },
    });

    res.status(200).json({ score, total: quizzes.length, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Past attempts history nikalo
const getProgress = async (req, res) => {
  try {
    const { materialId } = req.params;
    const attempts = await prisma.quizAttempt.findMany({
      where: { materialId, userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ attempts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getQuizQuestions, submitQuiz, getProgress };