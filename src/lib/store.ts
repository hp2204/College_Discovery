import { hasDatabase, prisma } from "./prisma";
import { colleges, seedQuestions } from "./sample-data";

type Question = (typeof seedQuestions)[number];
type PredictorCollege = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  exams: string[];
  annualFee: number;
  rating: number;
  rankCutoff: number;
  overview: string;
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  imageUrl?: string | null;
  courses?: { id: string; name: string; duration: string; seats: number; fee: number }[];
};

const categoryBoost: Record<string, number> = {
  GEN: 1,
  EWS: 1.18,
  OBC: 1.28,
  SC: 1.75,
  ST: 2.05,
};

const branchPressure: Record<string, number> = {
  CSE: 0.72,
  "AI/ML": 0.78,
  ECE: 0.9,
  Electrical: 1,
  Mechanical: 1.14,
  Civil: 1.28,
  Any: 1,
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(value, max));
}

function resolveBranchCutoff(college: PredictorCollege, branch: string, category: string, quota: string) {
  const pressure = branchPressure[branch] ?? 1;
  const quotaLift = quota === "State quota" ? 1.14 : quota === "Home state" ? 1.2 : 1;
  const categoryLift = categoryBoost[category] ?? 1;
  return Math.round(college.rankCutoff * pressure * quotaLift * categoryLift);
}

function buildCutoffHistory(baseCutoff: number) {
  return [
    { year: 2023, closingRank: Math.round(baseCutoff * 0.9) },
    { year: 2024, closingRank: Math.round(baseCutoff * 0.98) },
    { year: 2025, closingRank: Math.round(baseCutoff * 1.06) },
  ];
}

const users = new Map<string, { id: string; name: string; email: string; passwordHash: string }>();
const saved = new Map<string, Set<string>>();
let questions: Question[] = [...seedQuestions];

function filterSampleColleges(params: {
  q?: string;
  exam?: string;
  type?: string;
  maxFee?: number;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 6, 1), 20);
  const filtered = colleges
    .filter((college) => !params.q || `${college.name} ${college.city} ${college.state}`.toLowerCase().includes(params.q.toLowerCase()))
    .filter((college) => !params.exam || college.exams.includes(params.exam))
    .filter((college) => !params.type || college.type === params.type)
    .filter((college) => !params.maxFee || college.annualFee <= params.maxFee)
    .sort((a, b) => b.rating - a.rating);

  return { items: filtered.slice((page - 1) * pageSize, page * pageSize), total: filtered.length, page, pageSize };
}

export async function listColleges(params: {
  q?: string;
  exam?: string;
  type?: string;
  maxFee?: number;
  page?: number;
  pageSize?: number;
}) {
  const page = Math.max(params.page ?? 1, 1);
  const pageSize = Math.min(Math.max(params.pageSize ?? 6, 1), 20);

  if (hasDatabase) {
    try {
      const where = {
        AND: [
          params.q
            ? {
                OR: [
                  { name: { contains: params.q, mode: "insensitive" as const } },
                  { city: { contains: params.q, mode: "insensitive" as const } },
                  { state: { contains: params.q, mode: "insensitive" as const } },
                ],
              }
            : {},
          params.exam ? { exams: { has: params.exam } } : {},
          params.type ? { type: params.type } : {},
          params.maxFee ? { annualFee: { lte: params.maxFee } } : {},
        ],
      };
      const [items, total] = await Promise.all([
        prisma!.college.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { rating: "desc" } }),
        prisma!.college.count({ where }),
      ]);
      if (total > 0) return { items, total, page, pageSize };
    } catch (error) {
      console.warn("Falling back to bundled college data", error);
    }
  }

  return filterSampleColleges(params);
}

export async function getCollege(slug: string) {
  if (hasDatabase) {
    try {
      const college = await prisma!.college.findUnique({ where: { slug }, include: { courses: true, reviews: { orderBy: { createdAt: "desc" } } } });
      if (college) return college;
    } catch (error) {
      console.warn("Falling back to bundled college detail", error);
    }
  }
  return colleges.find((college) => college.slug === slug) ?? null;
}

export async function getCollegesByIds(ids: string[]) {
  if (hasDatabase) {
    try {
      const items = await prisma!.college.findMany({ where: { id: { in: ids } }, include: { courses: true } });
      if (items.length) return items;
    } catch (error) {
      console.warn("Falling back to bundled compare data", error);
    }
  }
  return colleges.filter((college) => ids.includes(college.id));
}

export async function predictColleges(
  exam: string,
  rank: number,
  options: { category?: string; branch?: string; quota?: string; mode?: "Strict" | "Flexible" } = {},
) {
  const category = options.category || "GEN";
  const branch = options.branch || "Any";
  const quota = options.quota || "All India";
  const mode = options.mode || "Flexible";
  let pool: PredictorCollege[] = colleges.filter((college) => college.exams.includes(exam)).sort((a, b) => a.rankCutoff - b.rankCutoff);
  if (hasDatabase) {
    try {
      const items = await prisma!.college.findMany({
        where: { exams: { has: exam } },
        include: { courses: true, reviews: true },
        orderBy: [{ rankCutoff: "asc" }, { rating: "desc" }],
      });
      if (items.length) pool = items;
    } catch (error) {
      console.warn("Falling back to bundled predictor data", error);
    }
  }
  return pool
    .map((college) => {
      const branchCutoff = resolveBranchCutoff(college, branch, category, quota);
      const margin = branchCutoff - rank;
      const probability = clamp(Math.round(55 + (margin / branchCutoff) * 85), 8, 96);
      const riskLevel = probability >= 72 ? "Safe" : probability >= 45 ? "Moderate" : "Ambitious";
      const competitionIntensity = branch === "CSE" || branch === "AI/ML" ? "Very high" : branch === "ECE" ? "High" : "Balanced";
      const trend = buildCutoffHistory(branchCutoff);
      return {
        ...college,
        branchCutoff,
        probability,
        riskLevel,
        competitionIntensity,
        cutoffHistory: trend,
        confidence: riskLevel,
        dataSource: "JoSAA/CSAB-style historical cutoff model",
        lastUpdated: "2026-06-06",
        guidance:
          probability >= 72
            ? "Keep this high in your preference list as a realistic anchor choice."
            : probability >= 45
              ? "Use this as an upgrade attempt, backed by safer colleges below it."
              : "Treat this as a dream option and do not rely on it as your only path.",
      };
    })
    .filter((college) => mode === "Flexible" || college.probability >= 55)
    .sort((a, b) => b.probability - a.probability || b.rating - a.rating)
    .slice(0, 6);
}

export async function createUser(input: { name: string; email: string; passwordHash: string }) {
  if (hasDatabase) {
    return prisma!.user.create({ data: input, select: { id: true, name: true, email: true } });
  }
  if ([...users.values()].some((user) => user.email === input.email)) throw new Error("Email already exists");
  const user = { id: `u${users.size + 1}`, ...input };
  users.set(user.id, user);
  return { id: user.id, name: user.name, email: user.email };
}

export async function findUserByEmail(email: string) {
  if (hasDatabase) return prisma!.user.findUnique({ where: { email } });
  return [...users.values()].find((user) => user.email === email) ?? null;
}

export async function getUser(userId: string) {
  if (hasDatabase) return prisma!.user.findUnique({ where: { id: userId }, select: { id: true, name: true, email: true } });
  const user = users.get(userId);
  return user ? { id: user.id, name: user.name, email: user.email } : null;
}

export async function listSaved(userId: string) {
  if (hasDatabase) {
    const items = await prisma!.savedCollege.findMany({ where: { userId }, include: { college: true }, orderBy: { createdAt: "desc" } });
    return items.map((item) => item.college);
  }
  const ids = saved.get(userId) ?? new Set<string>();
  return colleges.filter((college) => ids.has(college.id));
}

export async function toggleSaved(userId: string, collegeId: string) {
  if (hasDatabase) {
    const existing = await prisma!.savedCollege.findUnique({ where: { userId_collegeId: { userId, collegeId } } });
    if (existing) {
      await prisma!.savedCollege.delete({ where: { id: existing.id } });
      return { saved: false };
    }
    await prisma!.savedCollege.create({ data: { userId, collegeId } });
    return { saved: true };
  }
  const set = saved.get(userId) ?? new Set<string>();
  const exists = set.has(collegeId);
  if (exists) set.delete(collegeId);
  else set.add(collegeId);
  saved.set(userId, set);
  return { saved: !exists };
}

export async function listQuestions() {
  if (hasDatabase) {
    try {
      const items = await prisma!.question.findMany({ include: { answers: true, college: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
      if (items.length) return items;
    } catch (error) {
      console.warn("Falling back to bundled Q&A data", error);
    }
  }
  return questions.map((question) => ({ ...question, college: colleges.find((college) => college.id === question.collegeId) }));
}

export async function createQuestion(input: { title: string; body: string; collegeId?: string; authorId?: string }) {
  if (hasDatabase) {
    return prisma!.question.create({ data: input, include: { answers: true, college: { select: { name: true } } } });
  }
  const question = { id: `q${questions.length + 1}`, createdAt: new Date().toISOString(), answers: [], ...input } as Question;
  questions = [question, ...questions];
  return question;
}

export async function createAnswer(input: { questionId: string; body: string; authorId?: string }) {
  if (hasDatabase) {
    return prisma!.answer.create({ data: input });
  }
  questions = questions.map((question) =>
    question.id === input.questionId
      ? { ...question, answers: [...question.answers, { id: `a${Date.now()}`, body: input.body, createdAt: new Date().toISOString() }] }
      : question,
  );
  return { ok: true };
}
