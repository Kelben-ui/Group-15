const prisma = require("../lib/prisma");

async function getQuizById(req, res, next) {
  try {
    const { id } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            options: true,
            points: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    res.json({
      success: true,
      quiz,
    });
  } catch (error) {
    next(error);
  }
}

async function submitQuiz(req, res, next) {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({
        success: false,
        message: "Answers are required.",
      });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    let score = 0;
    let totalPoints = 0;

    quiz.questions.forEach((question) => {
      totalPoints += question.points;

      const learnerAnswer = answers[question.id];

      if (learnerAnswer === question.correctAnswer) {
        score += question.points;
      }
    });

    const result = await prisma.quizResult.create({
      data: {
        learnerId: req.user.id,
        quizId: id,
        score,
        totalPoints,
        answers,
      },
    });

    res.status(201).json({
      success: true,
      message: "Quiz submitted successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQuizById,
  submitQuiz,
};