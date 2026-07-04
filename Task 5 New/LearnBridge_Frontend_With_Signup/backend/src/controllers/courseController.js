const prisma = require("../lib/prisma");

async function getAllCourses(req, res, next) {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lessons: {
          select: {
            id: true,
            title: true,
            order: true,
            duration: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        _count: {
          select: {
            enrollments: true,
            lessons: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    next(error);
  }
}

async function getCourseById(req, res, next) {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
        quizzes: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    res.json({
      success: true,
      course,
    });
  } catch (error) {
    next(error);
  }
}

async function createCourse(req, res, next) {
  try {
    const { title, description, category, level, imageUrl, price } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, description, and category are required.",
      });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        level: level || "BEGINNER",
        imageUrl,
        price: price || 0,
        instructorId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully.",
      course,
    });
  } catch (error) {
    next(error);
  }
}

async function enrollInCourse(req, res, next) {
  try {
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    const enrollment = await prisma.enrollment.upsert({
      where: {
        learnerId_courseId: {
          learnerId: req.user.id,
          courseId: id,
        },
      },
      update: {},
      create: {
        learnerId: req.user.id,
        courseId: id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Enrollment successful.",
      enrollment,
    });
  } catch (error) {
    next(error);
  }
}

async function getMyCourses(req, res, next) {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        learnerId: req.user.id,
      },
      include: {
        course: {
          include: {
            lessons: {
              select: {
                id: true,
                title: true,
                order: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      courses: enrollments.map((item) => item.course),
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  getMyCourses,
};