export type College = {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: "Public" | "Private" | "Deemed";
  exams: string[];
  annualFee: number;
  rating: number;
  rankCutoff: number;
  overview: string;
  placementRate: number;
  averagePackage: number;
  highestPackage: number;
  imageUrl?: string | null;
  courses: { id: string; name: string; duration: string; seats: number; fee: number }[];
  reviews: { id: string; author: string; rating: number; comment: string; createdAt: string }[];
};

export const colleges: College[] = [
  {
    id: "c1",
    slug: "indian-institute-technology-bombay",
    name: "Indian Institute of Technology Bombay",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Public",
    exams: ["JEE Advanced", "GATE"],
    annualFee: 215000,
    rating: 4.8,
    rankCutoff: 1200,
    overview:
      "A research-led engineering institute with strong industry access, interdisciplinary labs, and one of India's deepest alumni networks.",
    placementRate: 93,
    averagePackage: 2180000,
    highestPackage: 16800000,
    courses: [
      { id: "co1", name: "B.Tech Computer Science", duration: "4 years", seats: 120, fee: 215000 },
      { id: "co2", name: "B.Tech Electrical Engineering", duration: "4 years", seats: 110, fee: 215000 },
      { id: "co3", name: "M.Tech Data Systems", duration: "2 years", seats: 48, fee: 165000 },
    ],
    reviews: [
      { id: "r1", author: "Aarav", rating: 4.9, comment: "Fantastic peer group and placements, but the academic pace is intense.", createdAt: "2026-02-11" },
      { id: "r2", author: "Meera", rating: 4.7, comment: "Research exposure starts early if you actively seek mentors.", createdAt: "2026-01-17" },
    ],
  },
  {
    id: "c2",
    slug: "bits-pilani",
    name: "BITS Pilani",
    city: "Pilani",
    state: "Rajasthan",
    type: "Private",
    exams: ["BITSAT"],
    annualFee: 565000,
    rating: 4.6,
    rankCutoff: 4500,
    overview:
      "A flexible private technical university known for practice school internships, strong entrepreneurship culture, and modern academic freedom.",
    placementRate: 91,
    averagePackage: 1850000,
    highestPackage: 9800000,
    courses: [
      { id: "co4", name: "B.E. Computer Science", duration: "4 years", seats: 150, fee: 565000 },
      { id: "co5", name: "B.E. Electronics", duration: "4 years", seats: 130, fee: 565000 },
      { id: "co6", name: "M.Sc. Economics", duration: "5 years", seats: 80, fee: 520000 },
    ],
    reviews: [
      { id: "r3", author: "Rhea", rating: 4.6, comment: "The no-attendance policy rewards ownership and planning.", createdAt: "2026-03-04" },
      { id: "r4", author: "Kabir", rating: 4.5, comment: "Practice school was the biggest differentiator for internships.", createdAt: "2026-02-02" },
    ],
  },
  {
    id: "c3",
    slug: "national-institute-technology-trichy",
    name: "National Institute of Technology Tiruchirappalli",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    type: "Public",
    exams: ["JEE Main", "GATE"],
    annualFee: 145000,
    rating: 4.5,
    rankCutoff: 8700,
    overview:
      "A top NIT with excellent core engineering outcomes, active student clubs, and a consistent national placement reputation.",
    placementRate: 88,
    averagePackage: 1420000,
    highestPackage: 5200000,
    courses: [
      { id: "co7", name: "B.Tech Computer Science", duration: "4 years", seats: 116, fee: 145000 },
      { id: "co8", name: "B.Tech Mechanical Engineering", duration: "4 years", seats: 120, fee: 145000 },
      { id: "co9", name: "MCA", duration: "3 years", seats: 60, fee: 120000 },
    ],
    reviews: [
      { id: "r5", author: "Nikhil", rating: 4.4, comment: "Great ROI and technical clubs, especially for competitive coding.", createdAt: "2026-01-28" },
    ],
  },
  {
    id: "c4",
    slug: "delhi-technological-university",
    name: "Delhi Technological University",
    city: "Delhi",
    state: "Delhi",
    type: "Public",
    exams: ["JEE Main"],
    annualFee: 235000,
    rating: 4.3,
    rankCutoff: 18000,
    overview:
      "A city-campus engineering university with strong Delhi NCR recruiter access, practical project culture, and high student activity.",
    placementRate: 84,
    averagePackage: 1180000,
    highestPackage: 6400000,
    courses: [
      { id: "co10", name: "B.Tech Software Engineering", duration: "4 years", seats: 180, fee: 235000 },
      { id: "co11", name: "B.Tech Electronics", duration: "4 years", seats: 160, fee: 235000 },
    ],
    reviews: [
      { id: "r6", author: "Tara", rating: 4.2, comment: "Location helps with internships and meetups throughout the year.", createdAt: "2026-03-12" },
    ],
  },
  {
    id: "c5",
    slug: "manipal-institute-of-technology",
    name: "Manipal Institute of Technology",
    city: "Manipal",
    state: "Karnataka",
    type: "Private",
    exams: ["MET"],
    annualFee: 390000,
    rating: 4.2,
    rankCutoff: 26000,
    overview:
      "A private engineering campus with broad program choice, polished facilities, global exposure, and a balanced campus experience.",
    placementRate: 79,
    averagePackage: 920000,
    highestPackage: 4600000,
    courses: [
      { id: "co12", name: "B.Tech Information Technology", duration: "4 years", seats: 180, fee: 390000 },
      { id: "co13", name: "B.Tech Biomedical Engineering", duration: "4 years", seats: 60, fee: 335000 },
    ],
    reviews: [
      { id: "r7", author: "Dev", rating: 4.1, comment: "Infrastructure is excellent and student life is very active.", createdAt: "2026-02-19" },
    ],
  },
  {
    id: "c6",
    slug: "vellore-institute-of-technology",
    name: "Vellore Institute of Technology",
    city: "Vellore",
    state: "Tamil Nadu",
    type: "Private",
    exams: ["VITEEE"],
    annualFee: 255000,
    rating: 4.1,
    rankCutoff: 42000,
    overview:
      "A large private university with wide branch availability, structured academics, and recruiter depth across software and core roles.",
    placementRate: 81,
    averagePackage: 860000,
    highestPackage: 5900000,
    courses: [
      { id: "co14", name: "B.Tech Computer Science", duration: "4 years", seats: 600, fee: 255000 },
      { id: "co15", name: "B.Tech Civil Engineering", duration: "4 years", seats: 120, fee: 210000 },
    ],
    reviews: [
      { id: "r8", author: "Ishan", rating: 4.0, comment: "Lots of opportunities, though you need to stand out in a large batch.", createdAt: "2026-01-09" },
    ],
  },
];

export const seedQuestions = [
  {
    id: "q1",
    title: "Is a lower-fee NIT better than a private university for CSE?",
    body: "I have a decent JEE Main rank and want strong placements without overextending my budget.",
    collegeId: "c3",
    createdAt: "2026-04-16",
    answers: [
      { id: "a1", body: "If branch quality is similar, compare average package, batch size, and internship access. NIT Trichy is usually excellent ROI.", createdAt: "2026-04-17" },
    ],
  },
  {
    id: "q2",
    title: "How important is city location for placements?",
    body: "Does being in Delhi, Bengaluru, or Mumbai materially improve outcomes?",
    collegeId: "c4",
    createdAt: "2026-04-22",
    answers: [
      { id: "a2", body: "It helps with internships and events, but campus recruiter history matters more for final placements.", createdAt: "2026-04-22" },
    ],
  },
];
