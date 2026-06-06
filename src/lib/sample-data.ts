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
  imageUrl?: string;
  courses: { id: string; name: string; duration: string; seats: number; fee: number }[];
  reviews: { id: string; author: string; rating: number; comment: string; createdAt: string }[];
};

export const collegeImages: Record<string, string> = {
  "indian-institute-technology-bombay":
    "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80",
  "bits-pilani":
    "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80",
  "national-institute-technology-trichy":
    "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  "delhi-technological-university":
    "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?auto=format&fit=crop&w=1200&q=80",
  "manipal-institute-of-technology":
    "https://images.unsplash.com/photo-1576495199011-eb94736d05d6?auto=format&fit=crop&w=1200&q=80",
  "vellore-institute-of-technology":
    "https://images.unsplash.com/photo-1589308454676-22b9ec2f3c94?auto=format&fit=crop&w=1200&q=80",
  "srm-institute-of-science-and-technology":
    "https://images.unsplash.com/photo-1567521464027-f127ff144326?auto=format&fit=crop&w=1200&q=80",
  "amity-university-noida":
    "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?auto=format&fit=crop&w=1200&q=80",
  "pes-university-bengaluru":
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
  "jadavpur-university":
    "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=1200&q=80",
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
    imageUrl: collegeImages["indian-institute-technology-bombay"],
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
    imageUrl: collegeImages["bits-pilani"],
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
    imageUrl: collegeImages["national-institute-technology-trichy"],
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
    imageUrl: collegeImages["delhi-technological-university"],
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
    imageUrl: collegeImages["manipal-institute-of-technology"],
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
    imageUrl: collegeImages["vellore-institute-of-technology"],
    courses: [
      { id: "co14", name: "B.Tech Computer Science", duration: "4 years", seats: 600, fee: 255000 },
      { id: "co15", name: "B.Tech Civil Engineering", duration: "4 years", seats: 120, fee: 210000 },
    ],
    reviews: [
      { id: "r8", author: "Ishan", rating: 4.0, comment: "Lots of opportunities, though you need to stand out in a large batch.", createdAt: "2026-01-09" },
    ],
  },
  {
    id: "c7",
    slug: "srm-institute-of-science-and-technology",
    name: "SRM Institute of Science and Technology",
    city: "Chennai",
    state: "Tamil Nadu",
    type: "Private",
    exams: ["SRMJEEE", "JEE Main"],
    annualFee: 310000,
    rating: 4.0,
    rankCutoff: 52000,
    overview:
      "A large multidisciplinary private university with strong engineering intake, modern labs, and broad recruiter participation across IT services and product roles.",
    placementRate: 78,
    averagePackage: 820000,
    highestPackage: 4200000,
    imageUrl: collegeImages["srm-institute-of-science-and-technology"],
    courses: [
      { id: "co16", name: "B.Tech Computer Science", duration: "4 years", seats: 720, fee: 310000 },
      { id: "co17", name: "B.Tech Artificial Intelligence", duration: "4 years", seats: 240, fee: 325000 },
    ],
    reviews: [
      { id: "r9", author: "Sana", rating: 4.0, comment: "A good option if you use the large campus ecosystem actively.", createdAt: "2026-03-18" },
    ],
  },
  {
    id: "c8",
    slug: "amity-university-noida",
    name: "Amity University Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    type: "Private",
    exams: ["JEE Main", "Amity JEE"],
    annualFee: 285000,
    rating: 3.9,
    rankCutoff: 62000,
    overview:
      "A private university near Delhi NCR with broad program choice, corporate exposure, and strong facilities for management, technology, and applied sciences.",
    placementRate: 73,
    averagePackage: 720000,
    highestPackage: 3200000,
    imageUrl: collegeImages["amity-university-noida"],
    courses: [
      { id: "co18", name: "B.Tech Computer Science", duration: "4 years", seats: 360, fee: 285000 },
      { id: "co19", name: "BBA Analytics", duration: "3 years", seats: 120, fee: 210000 },
    ],
    reviews: [
      { id: "r10", author: "Arjun", rating: 3.9, comment: "Corporate exposure is useful, but outcomes depend heavily on initiative.", createdAt: "2026-02-25" },
    ],
  },
  {
    id: "c9",
    slug: "pes-university-bengaluru",
    name: "PES University Bengaluru",
    city: "Bengaluru",
    state: "Karnataka",
    type: "Private",
    exams: ["KCET", "PESSAT", "JEE Main"],
    annualFee: 410000,
    rating: 4.2,
    rankCutoff: 24000,
    overview:
      "A Bengaluru-based university with strong software placement access, applied engineering programs, and proximity to startup and product-company ecosystems.",
    placementRate: 82,
    averagePackage: 1030000,
    highestPackage: 5200000,
    imageUrl: collegeImages["pes-university-bengaluru"],
    courses: [
      { id: "co20", name: "B.Tech Computer Science", duration: "4 years", seats: 480, fee: 410000 },
      { id: "co21", name: "B.Tech Electronics", duration: "4 years", seats: 180, fee: 385000 },
    ],
    reviews: [
      { id: "r11", author: "Neha", rating: 4.2, comment: "Bengaluru location creates a lot of internship momentum.", createdAt: "2026-04-03" },
    ],
  },
  {
    id: "c10",
    slug: "jadavpur-university",
    name: "Jadavpur University",
    city: "Kolkata",
    state: "West Bengal",
    type: "Public",
    exams: ["WBJEE", "GATE"],
    annualFee: 18000,
    rating: 4.4,
    rankCutoff: 9500,
    overview:
      "A high-ROI public university with a strong engineering culture, respected faculty, active student bodies, and excellent outcomes for core and software roles.",
    placementRate: 86,
    averagePackage: 1260000,
    highestPackage: 5800000,
    imageUrl: collegeImages["jadavpur-university"],
    courses: [
      { id: "co22", name: "B.E. Computer Science", duration: "4 years", seats: 90, fee: 18000 },
      { id: "co23", name: "B.E. Mechanical Engineering", duration: "4 years", seats: 100, fee: 18000 },
    ],
    reviews: [
      { id: "r12", author: "Ritwik", rating: 4.5, comment: "The ROI is outstanding, and the peer group is very serious.", createdAt: "2026-03-29" },
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
