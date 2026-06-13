require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const bcrypt = require("bcryptjs");

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.quizResult.deleteMany();
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.parentChild.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("password123", 12);

  const instructor = await prisma.user.create({
    data: {
      name: "Mr. Johnson",
      email: "instructor@learnbridge.com",
      password: hashedPassword,
      role: "INSTRUCTOR",
    },
  });

  const learner = await prisma.user.create({
    data: {
      name: "Student User",
      email: "learner@learnbridge.com",
      password: hashedPassword,
      role: "LEARNER",
    },
  });

  const course = await prisma.course.create({
    data: {
      title: "Introduction to Mathematics",
      description:
        "LearnBridge beginner mathematics course with lessons, quizzes, and progress tracking.",
      category: "Mathematics",
      level: "BEGINNER",
      price: 0,
      instructorId: instructor.id,
      lessons: {
        create: [
          {
            title: "Numbers and Operations",
            content:
              "This lesson introduces basic numbers, addition, subtraction, multiplication, and division.",
            order: 1,
            duration: 20,
          },
          {
            title: "Fractions",
            content:
              "This lesson explains fractions, numerators, denominators, and simple fraction operations.",
            order: 2,
            duration: 25,
          },
          {
            title: "Basic Algebra",
            content:
              "This lesson introduces variables, expressions, and simple equations.",
            order: 3,
            duration: 30,
          },
        ],
      },
    },
  });

  const quiz = await prisma.quiz.create({
    data: {
      title: "Basic Mathematics Quiz",
      description: "A short quiz for the Introduction to Mathematics course.",
      courseId: course.id,
      questions: {
        create: [
          {
            text: "What is 2 + 2?",
            options: ["2", "3", "4", "5"],
            correctAnswer: "4",
            points: 1,
          },
          {
            text: "What is 10 divided by 2?",
            options: ["2", "3", "5", "10"],
            correctAnswer: "5",
            points: 1,
          },
        ],
      },
    },
  });

  await prisma.enrollment.create({
    data: {
      learnerId: learner.id,
      courseId: course.id,
    },
  });

  console.log("Seed data created successfully.");
  console.log("Learner login: learner@learnbridge.com / password123");
  console.log("Instructor login: instructor@learnbridge.com / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });