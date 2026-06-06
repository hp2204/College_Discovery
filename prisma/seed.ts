import { PrismaClient } from "@prisma/client";
import { colleges, seedQuestions } from "../src/lib/sample-data";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

async function main() {
  await prisma.savedCollege.deleteMany();
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      name: "Demo Student",
      email: "demo@student.com",
      passwordHash: hashPassword("password"),
    },
  });

  for (const college of colleges) {
    await prisma.college.create({
      data: {
        id: college.id,
        slug: college.slug,
        name: college.name,
        city: college.city,
        state: college.state,
        type: college.type,
        exams: college.exams,
        annualFee: college.annualFee,
        rating: college.rating,
        rankCutoff: college.rankCutoff,
        overview: college.overview,
        placementRate: college.placementRate,
        averagePackage: college.averagePackage,
        highestPackage: college.highestPackage,
        courses: { create: college.courses.map(({ id, ...course }) => ({ id, ...course })) },
        reviews: { create: college.reviews.map(({ id, ...review }) => ({ id, ...review, createdAt: new Date(review.createdAt) })) },
      },
    });
  }

  for (const question of seedQuestions) {
    await prisma.question.create({
      data: {
        id: question.id,
        title: question.title,
        body: question.body,
        collegeId: question.collegeId,
        authorId: user.id,
        createdAt: new Date(question.createdAt),
        answers: { create: question.answers.map(({ id, createdAt, body }) => ({ id, body, createdAt: new Date(createdAt), authorId: user.id })) },
      },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
