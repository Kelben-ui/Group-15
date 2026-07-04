const prisma = require("../lib/prisma");

async function getLessonById(req, res, next) {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });
    }

    res.json({
      success: true,
      lesson,
    });
  } catch (error) {
    next(error);
  }
}

async function markLessonCompleted(req, res, next) {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found.",
      });
    }

    const progress = await prisma.progress.upsert({
      where: {
        learnerId_lessonId: {
          learnerId: req.user.id,
          lessonId: id,
        },
      },
      update: {
        isCompleted: true,
        completedAt: new Date(),
      },
      create: {
        learnerId: req.user.id,
        courseId: lesson.courseId,
        lessonId: id,
        isCompleted: true,
        completedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Lesson marked as completed.",
      progress,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getLessonById,
  markLessonCompleted,
};