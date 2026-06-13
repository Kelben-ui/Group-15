const prisma = require("../lib/prisma");

async function getLearnerDashboard(req, res, next) {
  try {
    const learnerId = req.user.id;

    const enrollments = await prisma.enrollment.findMany({
      where: {
        learnerId,
      },
      include: {
        course: {
          include: {
            lessons: true,
          },
        },
      },
    });

    const completedLessons = await prisma.progress.count({
      where: {
        learnerId,
        isCompleted: true,
      },
    });

    const quizResults = await prisma.quizResult.findMany({
      where: {
        learnerId,
      },
      include: {
        quiz: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
      take: 5,
    });

    const totalCourses = enrollments.length;

    let totalLessons = 0;

    enrollments.forEach((enrollment) => {
      totalLessons += enrollment.course.lessons.length;
    });

    const progressPercentage =
      totalLessons === 0
        ? 0
        : Math.round((completedLessons / totalLessons) * 100);

    res.json({
      success: true,
      dashboard: {
        totalCourses,
        totalLessons,
        completedLessons,
        progressPercentage,
        recentQuizResults: quizResults,
        enrolledCourses: enrollments.map((item) => item.course),
      },
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLearnerDashboard,
};