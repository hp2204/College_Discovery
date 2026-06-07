"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bookmark,
  Bot,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Database,
  GitCompare,
  GraduationCap,
  Globe2,
  Home,
  LifeBuoy,
  Mail,
  MapPin,
  Menu,
  MessageSquare,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import type { College } from "@/lib/sample-data";

type Question = { id: string; title: string; body: string; college?: { name?: string }; answers: { id: string; body: string }[] };
type Prediction = College & {
  probability: number;
  riskLevel: "Safe" | "Moderate" | "Ambitious";
  branchCutoff: number;
  competitionIntensity: string;
  confidence: string;
  guidance: string;
  dataSource: string;
  lastUpdated: string;
  cutoffHistory: { year: number; closingRank: number }[];
};

const exams = ["", "JEE Advanced", "JEE Main", "BITSAT", "MET", "VITEEE", "GATE"];
const types = ["", "Public", "Private", "Deemed"];
const branches = ["Any", "CSE", "AI/ML", "ECE", "Electrical", "Mechanical", "Civil"];
const categories = ["GEN", "EWS", "OBC", "SC", "ST"];
const quotas = ["All India", "State quota", "Home state"];
const modes = ["Flexible", "Strict"] as const;
const navItems = ["Home", "College Finder", "Rank Predictor", "About", "Contact", "Feedback"] as const;
type NavItem = (typeof navItems)[number];
type LanguageCode = "en" | "hi" | "ta" | "te" | "bn" | "mr" | "gu" | "kn";

const navTargets: Record<NavItem, string> = {
  Home: "top",
  "College Finder": "college-finder",
  "Rank Predictor": "rank-predictor",
  About: "about",
  Contact: "contact",
  Feedback: "feedback",
};
type LanguageOption = { code: LanguageCode; native: string; label: string };
type CleanCopy = {
  nav: Record<NavItem, string>;
  heroEyebrow: string;
  heroTitle: string;
  heroText: string;
  aboutTitle: string;
  aboutText: string;
  finder: string;
  predictor: string;
  predictCta: string;
  languageApplied: string;
  contactTitle: string;
  contactText: string;
  feedbackTitle: string;
  ask: string;
  findMatches: string;
  rankImproves: string;
  rankWorsens: string;
  stepsTitle: string;
  questionTitlePlaceholder: string;
  questionContextPlaceholder: string;
};

const languageOptions: LanguageOption[] = [
  { code: "en", native: "English", label: "English" },
  { code: "hi", native: "हिन्दी", label: "Hindi" },
  { code: "ta", native: "தமிழ்", label: "Tamil" },
  { code: "te", native: "తెలుగు", label: "Telugu" },
  { code: "bn", native: "বাংলা", label: "Bengali" },
  { code: "mr", native: "मराठी", label: "Marathi" },
  { code: "gu", native: "ગુજરાતી", label: "Gujarati" },
  { code: "kn", native: "ಕನ್ನಡ", label: "Kannada" },
];

const englishCopy: CleanCopy = {
  nav: { Home: "Home", "College Finder": "College Finder", "Rank Predictor": "Rank Predictor", About: "About", Contact: "Contact", Feedback: "Feedback" },
  heroEyebrow: "India's college discovery cockpit",
  heroTitle: "Navigate your future with confidence",
  heroText: "Compare colleges, test rank scenarios, shortlist realistic choices, and ask counselling questions from one focused workspace.",
  aboutTitle: "About CollegeCompass",
  aboutText: "Built for JEE, BITSAT, MET, VITEEE, and GATE aspirants who need clear filters, rank insights, fee context, and placement signals before locking their preference list.",
  finder: "College Finder",
  predictor: "Rank Predictor",
  predictCta: "Predict My College",
  languageApplied: "Language applied",
  contactTitle: "Contact CollegeCompass",
  contactText: "Need help with counselling choices, data corrections, or partnerships? Reach the support desk below.",
  feedbackTitle: "Counselling Q&A",
  ask: "Ask",
  findMatches: "Find matches",
  rankImproves: "Rank improves",
  rankWorsens: "Rank worsens",
  stepsTitle: "3 simple steps to find your college",
  questionTitlePlaceholder: "Question title",
  questionContextPlaceholder: "Add context",
};

const localizedCopy: Record<LanguageCode, CleanCopy> = {
  en: englishCopy,
  hi: {
    ...englishCopy,
    nav: { Home: "होम", "College Finder": "कॉलेज खोज", "Rank Predictor": "रैंक अनुमान", About: "परिचय", Contact: "संपर्क", Feedback: "प्रतिक्रिया" },
    heroEyebrow: "भारत का कॉलेज डिस्कवरी कॉकपिट",
    heroTitle: "आत्मविश्वास के साथ अपना भविष्य चुनें",
    heroText: "कॉलेजों की तुलना करें, रैंक परिदृश्य देखें, सही विकल्प शॉर्टलिस्ट करें, और काउंसलिंग सवाल पूछें.",
    aboutTitle: "CollegeCompass के बारे में",
    aboutText: "JEE, BITSAT, MET, VITEEE और GATE छात्रों के लिए फिल्टर, रैंक संकेत, फीस और प्लेसमेंट जानकारी एक जगह.",
    finder: "कॉलेज खोज",
    predictor: "रैंक अनुमान",
    predictCta: "मेरा कॉलेज बताएं",
    languageApplied: "भाषा लागू हुई",
    contactTitle: "CollegeCompass संपर्क",
    contactText: "काउंसलिंग, डेटा सुधार या साझेदारी के लिए नीचे दिए गए सपोर्ट डेस्क से संपर्क करें.",
    feedbackTitle: "काउंसलिंग सवाल-जवाब",
    ask: "पूछें",
    findMatches: "मैच खोजें",
    rankImproves: "रैंक बेहतर",
    rankWorsens: "रैंक कमजोर",
    stepsTitle: "कॉलेज खोजने के 3 आसान चरण",
    questionTitlePlaceholder: "प्रश्न शीर्षक",
    questionContextPlaceholder: "संदर्भ जोड़ें",
  },
  ta: {
    ...englishCopy,
    nav: { Home: "முகப்பு", "College Finder": "கல்லூரி தேடல்", "Rank Predictor": "தரவரிசை கணிப்பு", About: "அறிமுகம்", Contact: "தொடர்பு", Feedback: "கருத்து" },
    heroEyebrow: "இந்தியாவின் கல்லூரி தேர்வு மையம்",
    heroTitle: "நம்பிக்கையுடன் உங்கள் எதிர்காலத்தை தேர்வு செய்யுங்கள்",
    heroText: "கல்லூரிகளை ஒப்பிடுங்கள், தரவரிசை வாய்ப்புகளை பாருங்கள், பட்டியலை உருவாக்குங்கள், ஆலோசனை கேள்விகளை கேளுங்கள்.",
    aboutTitle: "CollegeCompass பற்றி",
    aboutText: "JEE, BITSAT, MET, VITEEE, GATE மாணவர்களுக்கு வடிகட்டிகள், தரவரிசை, கட்டணம், வேலைவாய்ப்பு தகவல்கள்.",
    finder: "கல்லூரி தேடல்",
    predictor: "தரவரிசை கணிப்பு",
    predictCta: "என் கல்லூரியை கணிக்க",
    languageApplied: "மொழி செயல்படுத்தப்பட்டது",
    contactTitle: "CollegeCompass தொடர்பு",
    contactText: "ஆலோசனை, தரவு திருத்தம் அல்லது கூட்டாண்மை உதவிக்கு கீழே தொடர்பு கொள்ளுங்கள்.",
    feedbackTitle: "ஆலோசனை Q&A",
    ask: "கேள்",
    findMatches: "பொருத்தங்களை தேடு",
    rankImproves: "ரேங்க் மேம்படும்",
    rankWorsens: "ரேங்க் குறையும்",
    stepsTitle: "கல்லூரியை கண்டறிய 3 எளிய படிகள்",
    questionTitlePlaceholder: "கேள்வி தலைப்பு",
    questionContextPlaceholder: "சூழலை சேர்க்கவும்",
  },
  te: {
    ...englishCopy,
    nav: { Home: "హోమ్", "College Finder": "కాలేజీ శోధన", "Rank Predictor": "ర్యాంక్ అంచనా", About: "గురించి", Contact: "సంప్రదించండి", Feedback: "అభిప్రాయం" },
    heroEyebrow: "భారత కాలేజీ డిస్కవరీ కాక్‌పిట్",
    heroTitle: "నమ్మకంతో మీ భవిష్యత్తును ఎంచుకోండి",
    heroText: "కాలేజీలను పోల్చండి, ర్యాంక్ అవకాశాలు చూడండి, షార్ట్‌లిస్ట్ చేయండి, కౌన్సెలింగ్ ప్రశ్నలు అడగండి.",
    aboutTitle: "CollegeCompass గురించి",
    aboutText: "JEE, BITSAT, MET, VITEEE, GATE విద్యార్థులకు ఫిల్టర్లు, ర్యాంక్ సూచనలు, ఫీజు మరియు ప్లేస్‌మెంట్ సమాచారం.",
    finder: "కాలేజీ శోధన",
    predictor: "ర్యాంక్ అంచనా",
    predictCta: "నా కాలేజీ అంచనా",
    languageApplied: "భాష అమలైంది",
    contactTitle: "CollegeCompass సంప్రదించండి",
    contactText: "కౌన్సెలింగ్, డేటా సవరణలు లేదా భాగస్వామ్యాల కోసం క్రింద సంప్రదించండి.",
    feedbackTitle: "కౌన్సెలింగ్ Q&A",
    ask: "అడగండి",
    findMatches: "మ్యాచ్‌లు కనుగొనండి",
    rankImproves: "ర్యాంక్ మెరుగవుతుంది",
    rankWorsens: "ర్యాంక్ తగ్గుతుంది",
    stepsTitle: "మీ కాలేజీని కనుగొనడానికి 3 సులభ దశలు",
    questionTitlePlaceholder: "ప్రశ్న శీర్షిక",
    questionContextPlaceholder: "సందర్భం జోడించండి",
  },
  bn: {
    ...englishCopy,
    nav: { Home: "হোম", "College Finder": "কলেজ খোঁজ", "Rank Predictor": "র‍্যাঙ্ক অনুমান", About: "পরিচিতি", Contact: "যোগাযোগ", Feedback: "মতামত" },
    heroEyebrow: "ভারতের কলেজ ডিসকভারি ককপিট",
    heroTitle: "আত্মবিশ্বাসের সঙ্গে ভবিষ্যৎ বেছে নিন",
    heroText: "কলেজ তুলনা করুন, র‍্যাঙ্ক সম্ভাবনা দেখুন, শর্টলিস্ট বানান, কাউন্সেলিং প্রশ্ন করুন.",
    aboutTitle: "CollegeCompass সম্পর্কে",
    aboutText: "JEE, BITSAT, MET, VITEEE, GATE শিক্ষার্থীদের জন্য ফিল্টার, র‍্যাঙ্ক, ফি ও প্লেসমেন্ট তথ্য.",
    finder: "কলেজ খোঁজ",
    predictor: "র‍্যাঙ্ক অনুমান",
    predictCta: "আমার কলেজ অনুমান",
    languageApplied: "ভাষা প্রয়োগ হয়েছে",
    contactTitle: "CollegeCompass যোগাযোগ",
    contactText: "কাউন্সেলিং, ডেটা সংশোধন বা পার্টনারশিপের জন্য নিচের সাপোর্ট ডেস্কে যোগাযোগ করুন.",
    feedbackTitle: "কাউন্সেলিং Q&A",
    ask: "জিজ্ঞাসা",
    findMatches: "ম্যাচ খুঁজুন",
    rankImproves: "র‍্যাঙ্ক উন্নত",
    rankWorsens: "র‍্যাঙ্ক কমে",
    stepsTitle: "কলেজ খুঁজতে 3টি সহজ ধাপ",
    questionTitlePlaceholder: "প্রশ্নের শিরোনাম",
    questionContextPlaceholder: "প্রসঙ্গ যোগ করুন",
  },
  mr: {
    ...englishCopy,
    nav: { Home: "होम", "College Finder": "कॉलेज शोध", "Rank Predictor": "रँक अंदाज", About: "माहिती", Contact: "संपर्क", Feedback: "अभिप्राय" },
    heroEyebrow: "भारताचा कॉलेज डिस्कव्हरी कॉकपिट",
    heroTitle: "आत्मविश्वासाने भविष्य निवडा",
    heroText: "कॉलेज तुलना करा, रँक शक्यता तपासा, शॉर्टलिस्ट करा आणि काउन्सेलिंग प्रश्न विचारा.",
    aboutTitle: "CollegeCompass बद्दल",
    aboutText: "JEE, BITSAT, MET, VITEEE आणि GATE विद्यार्थ्यांसाठी फिल्टर्स, रँक, फी व प्लेसमेंट माहिती.",
    finder: "कॉलेज शोध",
    predictor: "रँक अंदाज",
    predictCta: "माझे कॉलेज सांगा",
    languageApplied: "भाषा लागू झाली",
    contactTitle: "CollegeCompass संपर्क",
    contactText: "काउन्सेलिंग, डेटा दुरुस्ती किंवा भागीदारीसाठी खालील सपोर्ट डेस्कशी संपर्क करा.",
    feedbackTitle: "काउन्सेलिंग Q&A",
    ask: "विचारा",
    findMatches: "जुळणारे शोधा",
    rankImproves: "रँक सुधारते",
    rankWorsens: "रँक कमी होते",
    stepsTitle: "कॉलेज शोधण्यासाठी 3 सोपे टप्पे",
    questionTitlePlaceholder: "प्रश्न शीर्षक",
    questionContextPlaceholder: "संदर्भ जोडा",
  },
  gu: {
    ...englishCopy,
    nav: { Home: "હોમ", "College Finder": "કોલેજ શોધ", "Rank Predictor": "રેન્ક અનુમાન", About: "વિશે", Contact: "સંપર્ક", Feedback: "પ્રતિસાદ" },
    heroEyebrow: "ભારતનું કોલેજ ડિસ્કવરી કોકપિટ",
    heroTitle: "વિશ્વાસ સાથે તમારું ભવિષ્ય પસંદ કરો",
    heroText: "કોલેજો સરખાવો, રેન્ક સંભાવનાઓ જુઓ, શોર્ટલિસ્ટ બનાવો અને કાઉન્સેલિંગ પ્રશ્નો પૂછો.",
    aboutTitle: "CollegeCompass વિશે",
    aboutText: "JEE, BITSAT, MET, VITEEE અને GATE વિદ્યાર્થીઓ માટે ફિલ્ટર, રેન્ક, ફી અને પ્લેસમેન્ટ માહિતી.",
    finder: "કોલેજ શોધ",
    predictor: "રેન્ક અનુમાન",
    predictCta: "મારું કોલેજ અનુમાન",
    languageApplied: "ભાષા લાગુ થઈ",
    contactTitle: "CollegeCompass સંપર્ક",
    contactText: "કાઉન્સેલિંગ, ડેટા સુધારા અથવા ભાગીદારી માટે નીચે સંપર્ક કરો.",
    feedbackTitle: "કાઉન્સેલિંગ Q&A",
    ask: "પૂછો",
    findMatches: "મેચ શોધો",
    rankImproves: "રેન્ક સુધરે",
    rankWorsens: "રેન્ક ઘટે",
    stepsTitle: "કોલેજ શોધવા માટે 3 સરળ પગલાં",
    questionTitlePlaceholder: "પ્રશ્નનું શીર્ષક",
    questionContextPlaceholder: "સંદર્ભ ઉમેરો",
  },
  kn: {
    ...englishCopy,
    nav: { Home: "ಮುಖಪುಟ", "College Finder": "ಕಾಲೇಜು ಹುಡುಕು", "Rank Predictor": "ರ್ಯಾಂಕ್ ಅಂದಾಜು", About: "ಬಗ್ಗೆ", Contact: "ಸಂಪರ್ಕ", Feedback: "ಪ್ರತಿಕ್ರಿಯೆ" },
    heroEyebrow: "ಭಾರತದ ಕಾಲೇಜು ಡಿಸ್ಕವರಿ ಕಾಕ್‌ಪಿಟ್",
    heroTitle: "ನಂಬಿಕೆಯಿಂದ ನಿಮ್ಮ ಭವಿಷ್ಯ ಆರಿಸಿ",
    heroText: "ಕಾಲೇಜುಗಳನ್ನು ಹೋಲಿಸಿ, ರ್ಯಾಂಕ್ ಅವಕಾಶಗಳನ್ನು ನೋಡಿ, ಶಾರ್ಟ್‌ಲಿಸ್ಟ್ ಮಾಡಿ, ಕೌನ್ಸೆಲಿಂಗ್ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.",
    aboutTitle: "CollegeCompass ಬಗ್ಗೆ",
    aboutText: "JEE, BITSAT, MET, VITEEE, GATE ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಫಿಲ್ಟರ್, ರ್ಯಾಂಕ್, ಶುಲ್ಕ ಮತ್ತು ಪ್ಲೇಸ್‌ಮೆಂಟ್ ಮಾಹಿತಿ.",
    finder: "ಕಾಲೇಜು ಹುಡುಕು",
    predictor: "ರ್ಯಾಂಕ್ ಅಂದಾಜು",
    predictCta: "ನನ್ನ ಕಾಲೇಜು ಅಂದಾಜು",
    languageApplied: "ಭಾಷೆ ಅನ್ವಯಿಸಲಾಗಿದೆ",
    contactTitle: "CollegeCompass ಸಂಪರ್ಕ",
    contactText: "ಕೌನ್ಸೆಲಿಂಗ್, ಡೇಟಾ ತಿದ್ದುಪಡಿ ಅಥವಾ ಪಾಲುದಾರಿಕೆಗಾಗಿ ಕೆಳಗೆ ಸಂಪರ್ಕಿಸಿ.",
    feedbackTitle: "ಕೌನ್ಸೆಲಿಂಗ್ Q&A",
    ask: "ಕೇಳಿ",
    findMatches: "ಹೊಂದಾಣಿಕೆ ಹುಡುಕಿ",
    rankImproves: "ರ್ಯಾಂಕ್ ಸುಧಾರಿಸುತ್ತದೆ",
    rankWorsens: "ರ್ಯಾಂಕ್ ಕಡಿಮೆಯಾಗುತ್ತದೆ",
    stepsTitle: "ನಿಮ್ಮ ಕಾಲೇಜು ಕಂಡುಹಿಡಿಯಲು 3 ಸರಳ ಹಂತಗಳು",
    questionTitlePlaceholder: "ಪ್ರಶ್ನೆ ಶೀರ್ಷಿಕೆ",
    questionContextPlaceholder: "ಸಂದರ್ಭ ಸೇರಿಸಿ",
  },
};

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function tierFor(college: College) {
  if (college.name.includes("Indian Institute of Technology")) return "IIT";
  if (college.name.includes("National Institute of Technology")) return "NIT";
  if (college.name.includes("BITS")) return "Private elite";
  if (college.type === "Public") return "GFTI/Public";
  return "Private";
}

function roiScore(college: College) {
  return Math.round((college.averagePackage / Math.max(college.annualFee, 1)) * 10);
}

function branchMatches(college: College, branch: string) {
  if (branch === "Any") return true;
  const aliases: Record<string, string[]> = {
    CSE: ["computer science", "software", "information technology"],
    "AI/ML": ["artificial intelligence", "data systems", "machine learning"],
    ECE: ["electronics"],
    Electrical: ["electrical"],
    Mechanical: ["mechanical"],
    Civil: ["civil"],
  };
  const terms = aliases[branch] ?? [branch.toLowerCase()];
  return college.courses.some((course) => terms.some((term) => course.name.toLowerCase().includes(term)));
}

function collegeImage(college: College) {
  return college.imageUrl ?? `https://source.unsplash.com/900x520/?university,campus,${encodeURIComponent(college.city)}`;
}

export function PlatformApp() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [exam, setExam] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [branchFilter, setBranchFilter] = useState("Any");
  const [maxFee, setMaxFee] = useState("600000");
  const [minPlacement, setMinPlacement] = useState("70");
  const [hostelOnly, setHostelOnly] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compare, setCompare] = useState<College[]>([]);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [rank, setRank] = useState("9000");
  const [predictExam, setPredictExam] = useState("JEE Main");
  const [category, setCategory] = useState("GEN");
  const [quota, setQuota] = useState("All India");
  const [predictBranch, setPredictBranch] = useState("CSE");
  const [mode, setMode] = useState<(typeof modes)[number]>("Flexible");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionDraft, setQuestionDraft] = useState({ title: "", body: "" });
  const [saved, setSaved] = useState<College[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(languageOptions[0]);
  const [activeNavItem, setActiveNavItem] = useState<NavItem>("Home");
  const navClickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const text = localizedCopy[selectedLanguage.code];

  const params = useMemo(() => {
    const search = new URLSearchParams({ page: String(page), maxFee });
    if (query) search.set("q", query);
    if (exam) search.set("exam", exam);
    if (type) search.set("type", type);
    return search.toString();
  }, [exam, maxFee, page, query, type]);

  const visibleColleges = useMemo(() => {
    return colleges
      .filter((college) => !location || `${college.city} ${college.state}`.toLowerCase().includes(location.toLowerCase()))
      .filter((college) => branchMatches(college, branchFilter))
      .filter((college) => college.placementRate >= Number(minPlacement))
      .filter((college) => !hostelOnly || college.rating >= 4);
  }, [branchFilter, colleges, hostelOnly, location, minPlacement]);

  useEffect(() => {
    fetch(`/api/colleges?${params}`)
      .then((res) => res.json())
      .then((data) => {
        setColleges(data.items);
        setTotal(data.total);
      });
  }, [params]);

  useEffect(() => {
    refreshSaved();
    refreshQuestions();
  }, []);

  useEffect(() => {
    function updateActiveSection() {
      if (navClickTimer.current) return;
      if (window.scrollY < 8) {
        setActiveNavItem("Home");
        return;
      }
      const current =
        navItems
          .filter((item) => item !== "Home")
          .map((item) => {
            const section = document.getElementById(navTargets[item]);
            return section ? { item, distance: Math.abs(section.getBoundingClientRect().top - 96) } : null;
          })
          .filter(Boolean)
          .sort((a, b) => a!.distance - b!.distance)[0]?.item ?? "Home";
      setActiveNavItem(current);
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
      if (navClickTimer.current) clearTimeout(navClickTimer.current);
    };
  }, []);

  useEffect(() => {
    const source = compareIds.length
      ? fetch(`/api/compare?ids=${compareIds.join(",")}`).then((res) => res.json())
      : Promise.resolve({ items: [] });
    source.then((data) => setCompare(data.items));
  }, [compareIds]);

  function refreshSaved() {
    fetch("/api/saved").then((res) => res.json()).then((data) => setSaved(data.items));
  }

  function refreshQuestions() {
    fetch("/api/questions").then((res) => res.json()).then((data) => setQuestions(data.items));
  }

  async function toggleSaved(collegeId: string) {
    const res = await fetch("/api/saved", { method: "POST", body: JSON.stringify({ collegeId }) });
    if (res.ok) refreshSaved();
  }

  async function predict(nextRank = rank) {
    const res = await fetch("/api/predictor", {
      method: "POST",
      body: JSON.stringify({ exam: predictExam, rank: nextRank, category, branch: predictBranch, quota, mode }),
    });
    const data = await res.json();
    setPredictions(data.items ?? []);
  }

  async function askQuestion() {
    if (!questionDraft.title || !questionDraft.body) return;
    await fetch("/api/questions", { method: "POST", body: JSON.stringify(questionDraft) });
    setQuestionDraft({ title: "", body: "" });
    refreshQuestions();
  }

  function jumpTo(section: string) {
    const navItem = section as NavItem;
    setActiveNavItem(navItem);
    setLanguageOpen(false);
    if (navClickTimer.current) clearTimeout(navClickTimer.current);
    navClickTimer.current = setTimeout(() => {
      navClickTimer.current = null;
    }, 900);
    document.getElementById(navTargets[navItem])?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  }

  function predictAndJump() {
    predict();
    setActiveNavItem("Rank Predictor");
    setLanguageOpen(false);
    if (navClickTimer.current) clearTimeout(navClickTimer.current);
    navClickTimer.current = setTimeout(() => {
      navClickTimer.current = null;
    }, 900);
    document.getElementById("rank-predictor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileMenuOpen(false);
  }

  const savedIds = new Set(saved.map((college) => college.id));
  const pages = Math.max(Math.ceil(total / 6), 1);
  const bestPrediction = predictions[0];

  return (
    <main id="top" className="min-h-screen bg-[#f7f7f2] text-[#161712]">
      <header className="sticky top-0 z-40 border-b border-[#e4e7ef] bg-[#f8fafc]/95 shadow-sm backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-5">
          <button className="flex items-center gap-3" onClick={() => jumpTo("Home")} aria-label="CollegeCompass home">
            <span className="grid size-11 place-items-center rounded-xl bg-[#1398d8] text-white shadow-lg shadow-[#1398d8]/20">
              <GraduationCap size={23} />
            </span>
            <span className="text-2xl font-extrabold tracking-normal text-[#101827]">
              College<span className="text-[#2563eb]">Compass</span>
            </span>
          </button>

          <nav className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <button
                key={item}
                className={`rounded-md px-4 py-3 text-sm font-bold transition ${item === activeNavItem ? "bg-[#eef6ff] text-[#245bd6]" : "text-[#4b5563] hover:bg-[#eef6ff] hover:text-[#245bd6]"}`}
                onClick={() => jumpTo(item)}
                aria-current={item === activeNavItem ? "page" : undefined}
              >
                {text.nav[item]}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <div className="relative">
              <button className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-[#4b5563] hover:bg-[#eef6ff]" onClick={() => setLanguageOpen((value) => !value)}>
                <Globe2 size={18} /> {selectedLanguage.label} {languageOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {languageOpen && (
                <LanguageMenu
                  className="absolute right-0 top-12 z-50"
                  selectedLanguage={selectedLanguage.code}
                  onSelect={(language) => {
                    setSelectedLanguage(language);
                    setLanguageOpen(false);
                  }}
                />
              )}
            </div>
            <button className="primary-button h-11 bg-[#2563eb] px-5 hover:bg-[#1d4ed8]" onClick={predictAndJump}>
              {text.predictCta}
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button className="icon-button border-0 bg-transparent" onClick={() => setLanguageOpen((value) => !value)} title="Language">
              <Globe2 size={22} />
            </button>
            <button className="icon-button border-0 bg-transparent" onClick={() => setMobileMenuOpen((value) => !value)} title="Menu">
              {mobileMenuOpen ? <X size={28} /> : <Menu size={30} />}
            </button>
          </div>
        </div>

        {languageOpen && (
          <div className="absolute right-16 top-[64px] z-50 lg:hidden">
            <LanguageMenu
              className="relative"
              selectedLanguage={selectedLanguage.code}
              onSelect={(language) => {
                setSelectedLanguage(language);
                setLanguageOpen(false);
              }}
            />
          </div>
        )}

        {mobileMenuOpen && (
          <div className="border-t border-[#e4e7ef] bg-white px-4 pb-5 pt-4 lg:hidden">
            <div className="grid gap-3">
              {navItems.map((item) => (
                <button
                  key={item}
                  className={`rounded-xl px-5 py-4 text-left text-lg font-bold ${item === activeNavItem ? "bg-[#eef6ff] text-[#245bd6]" : "text-[#313946]"}`}
                  onClick={() => jumpTo(item)}
                  aria-current={item === activeNavItem ? "page" : undefined}
                >
                  {text.nav[item]}
                </button>
              ))}
              <button className="mt-2 rounded-xl bg-[#2563eb] px-5 py-4 text-lg font-extrabold text-white shadow-lg shadow-[#2563eb]/20" onClick={predictAndJump}>
                {text.predictCta}
              </button>
            </div>
          </div>
        )}
      </header>

      <HeroAbout
        text={text}
        selectedLanguage={selectedLanguage}
        collegeCount={total}
        jumpTo={jumpTo}
        predictAndJump={predictAndJump}
      />

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[1fr_390px]">
        <div className="space-y-5">
          <section id="college-finder" className="scroll-mt-24 rounded-md border border-[#d7d5c9] bg-white p-4">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#101827]">{text.finder}</h2>
                <p className="mt-1 text-sm text-[#64748b]">Filter by exam, branch, city, fees, placement, and hostel-ready options.</p>
              </div>
              <span className="rounded-md bg-[#eef6ff] px-3 py-2 text-xs font-bold text-[#245bd6]">{visibleColleges.length} live matches</span>
            </div>
            <div className="grid gap-3 lg:grid-cols-[1fr_150px_140px_150px]">
              <label className="relative">
                <Search className="absolute left-3 top-3 text-[#6b6a60]" size={18} />
                <input className="field h-11 w-full pl-10" placeholder="Search college, city, state" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
              </label>
              <select className="field h-11" value={exam} onChange={(e) => { setExam(e.target.value); setPage(1); }}>{exams.map((item) => <option key={item} value={item}>{item || "Any exam"}</option>)}</select>
              <select className="field h-11" value={type} onChange={(e) => { setType(e.target.value); setPage(1); }}>{types.map((item) => <option key={item} value={item}>{item || "Any tier"}</option>)}</select>
              <select className="field h-11" value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>{branches.map((item) => <option key={item}>{item}</option>)}</select>
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_170px]">
              <input className="field h-11" placeholder="Preferred city or state" value={location} onChange={(e) => setLocation(e.target.value)} />
              <label className="grid gap-1 text-xs font-semibold text-[#6b6a60]">
                Max fee {money.format(Number(maxFee))}
                <input type="range" min="150000" max="600000" step="25000" value={maxFee} onChange={(e) => { setMaxFee(e.target.value); setPage(1); }} />
              </label>
              <label className="grid gap-1 text-xs font-semibold text-[#6b6a60]">
                Min placement {minPlacement}%
                <input type="range" min="60" max="95" step="5" value={minPlacement} onChange={(e) => setMinPlacement(e.target.value)} />
              </label>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
              <button className={`secondary-button ${hostelOnly ? "border-[#256f5a] text-[#256f5a]" : ""}`} onClick={() => setHostelOnly((value) => !value)}>
                <Home size={16} /> Hostel-ready
              </button>
              <span className="rounded-md bg-[#f4f3ec] px-3 py-2 font-semibold text-[#55564d]">{visibleColleges.length} refined matches</span>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {visibleColleges.map((college) => (
              <article key={college.id} className="overflow-hidden rounded-md border border-[#d7d5c9] bg-white shadow-sm">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.48)), url(${collegeImage(college)})` }}
                >
                  <div className="flex h-full items-end justify-between gap-3 p-4 text-white">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.16em]">{tierFor(college)}</p>
                      <p className="mt-1 flex items-center gap-1 text-sm font-semibold"><MapPin size={15} /> {college.city}, {college.state}</p>
                    </div>
                    <span className="rounded-sm bg-white/90 px-2 py-1 text-xs font-bold text-[#161712]">ROI {roiScore(college)}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <Link className="block text-xl font-semibold hover:text-[#256f5a]" href={`/colleges/${college.slug}`}>{college.name}</Link>
                    <button className="icon-button" title="Save college" onClick={() => toggleSaved(college.id)}>
                      <Bookmark size={18} fill={savedIds.has(college.id) ? "#256f5a" : "none"} />
                    </button>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#55564d]">{college.overview}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <Metric label="Fee" value={money.format(college.annualFee)} />
                    <Metric label="Median proxy" value={money.format(Math.round(college.averagePackage * 0.82))} />
                    <Metric label="Placement" value={`${college.placementRate}%`} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <button
                      className="secondary-button"
                      onClick={() => setCompareIds((ids) => ids.includes(college.id) ? ids.filter((id) => id !== college.id) : ids.length < 5 ? [...ids, college.id] : ids)}
                    >
                      <GitCompare size={16} /> {compareIds.includes(college.id) ? "Selected" : "Compare"}
                    </button>
                    <Link className="text-sm font-semibold text-[#256f5a]" href={`/colleges/${college.slug}`}>Open detail</Link>
                  </div>
                </div>
              </article>
            ))}
          </section>

          <div className="flex items-center justify-between rounded-md border border-[#d7d5c9] bg-white p-3">
            <span className="text-sm text-[#55564d]">Showing page {page} of {pages} - {total} database matches</span>
            <div className="flex gap-2">
              <button className="secondary-button" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
              <button className="secondary-button" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</button>
            </div>
          </div>

          <CompareTable colleges={compare} />
          <TransparencyPanel />
          <Discussion questions={questions} draft={questionDraft} setDraft={setQuestionDraft} askQuestion={askQuestion} text={text} />
        </div>

        <aside className="space-y-5">
          <section id="rank-predictor" className="scroll-mt-24 rounded-md border border-[#d7d5c9] bg-white p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#b16d2a]" size={20} />
              <h2 className="text-lg font-semibold">{text.predictor}</h2>
            </div>
            <div className="mt-4 grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <select className="field h-11" value={predictExam} onChange={(e) => setPredictExam(e.target.value)}>{exams.filter(Boolean).map((item) => <option key={item}>{item}</option>)}</select>
                <input className="field h-11" type="number" value={rank} onChange={(e) => setRank(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="field h-11" value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
                <select className="field h-11" value={quota} onChange={(e) => setQuota(e.target.value)}>{quotas.map((item) => <option key={item}>{item}</option>)}</select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select className="field h-11" value={predictBranch} onChange={(e) => setPredictBranch(e.target.value)}>{branches.map((item) => <option key={item}>{item}</option>)}</select>
                <select className="field h-11" value={mode} onChange={(e) => setMode(e.target.value as (typeof modes)[number])}>{modes.map((item) => <option key={item}>{item}</option>)}</select>
              </div>
              <button className="primary-button h-11" onClick={() => predict()}>{text.findMatches}</button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="secondary-button" onClick={() => { const next = String(Math.max(Number(rank) - 5000, 1)); setRank(next); predict(next); }}>{text.rankImproves}</button>
              <button className="secondary-button" onClick={() => { const next = String(Number(rank) + 5000); setRank(next); predict(next); }}>{text.rankWorsens}</button>
            </div>
          </section>

          {bestPrediction && (
            <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
              <div className="flex items-center gap-2">
                <Bot className="text-[#256f5a]" size={20} />
                <h2 className="text-lg font-semibold">Guidance layer</h2>
              </div>
              <p className="mt-3 text-sm leading-6 text-[#55564d]">
                Best profile fit: <span className="font-semibold text-[#161712]">{bestPrediction.name}</span>. {bestPrediction.guidance}
              </p>
              <p className="mt-3 rounded-md bg-[#f4f3ec] p-3 text-sm leading-6 text-[#55564d]">
                If placements are your priority, compare average package against annual fee first. If campus experience matters more, prefer stronger rating and location even when probability is similar.
              </p>
            </section>
          )}

          <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="text-[#9b5147]" size={20} />
              <h2 className="text-lg font-semibold">Outcome intelligence</h2>
            </div>
            <div className="mt-4 space-y-3">
              {predictions.map((college) => (
                <PredictionCard key={college.id} college={college} />
              ))}
              {!predictions.length && <p className="text-sm leading-6 text-[#55564d]">Run the predictor to see probability, risk, branch cutoff history, and counselling strategy.</p>}
            </div>
          </section>

          <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
            <div className="flex items-center gap-2">
              <Bookmark className="text-[#256f5a]" size={20} />
              <h2 className="text-lg font-semibold">Shortlist</h2>
            </div>
            <div className="mt-3 space-y-2">
              {saved.length ? saved.map((college) => (
                <Link key={college.id} href={`/colleges/${college.slug}`} className="block rounded-md border border-[#e4e1d8] p-3 text-sm font-semibold hover:border-[#256f5a]">{college.name}</Link>
              )) : <p className="text-sm leading-6 text-[#55564d]">Sign up and save colleges to create a personalized shortlist.</p>}
            </div>
          </section>
        </aside>
      </section>
      <ContactFooter text={text} jumpTo={jumpTo} />
    </main>
  );
}

function HeroAbout({
  text,
  selectedLanguage,
  collegeCount,
  jumpTo,
  predictAndJump,
}: {
  text: CleanCopy;
  selectedLanguage: LanguageOption;
  collegeCount: number;
  jumpTo: (section: NavItem) => void;
  predictAndJump: () => void;
}) {
  const stats = [
    { label: "College profiles", value: `${collegeCount || 6}+`, icon: <Database size={20} /> },
    { label: "Prediction modes", value: "2", icon: <Sparkles size={20} /> },
    { label: "Exam pathways", value: "6", icon: <ClipboardList size={20} /> },
  ];
  const steps = [
    { title: "Choose your exam", body: "Pick JEE Main, Advanced, BITSAT, MET, VITEEE, or GATE.", icon: <CheckCircle2 size={20} /> },
    { title: "Tune your profile", body: "Use branch, fee, placement, quota, and location filters.", icon: <Users size={20} /> },
    { title: "Compare outcomes", body: "Save colleges, compare ROI, and run safer or ambitious rank cases.", icon: <TrendingUp size={20} /> },
  ];

  return (
    <section id="about" className="scroll-mt-24 border-b border-[#dfe7ee] bg-[#f8fafc]">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div className="overflow-hidden rounded-md border border-[#d9e4ee] bg-white shadow-sm">
          <div
            className="min-h-[420px] bg-cover bg-center"
            style={{ backgroundImage: "linear-gradient(90deg, rgba(8,20,37,0.86), rgba(19,96,137,0.56), rgba(255,255,255,0.08)), url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1400&q=80)" }}
          >
            <div className="flex min-h-[420px] flex-col justify-end p-6 text-white md:p-8">
              <span className="w-fit rounded-md bg-white/16 px-3 py-2 text-xs font-bold uppercase text-white backdrop-blur">{text.heroEyebrow}</span>
              <h1 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-normal md:text-5xl">{text.heroTitle}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#edf7ff] md:text-lg">{text.heroText}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="primary-button min-h-12 bg-[#2563eb] px-5 hover:bg-[#1d4ed8]" onClick={predictAndJump}>
                  <Sparkles size={18} /> {text.predictCta}
                </button>
                <button className="secondary-button min-h-12 border-white/40 bg-white/95 px-5 text-[#101827]" onClick={() => jumpTo("College Finder")}>
                  <Search size={18} /> {text.finder} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <section className="rounded-md border border-[#d9e4ee] bg-white p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="grid size-11 place-items-center rounded-md bg-[#e8f1ff] text-[#245bd6]"><GraduationCap size={22} /></span>
              <div>
                <h2 className="text-2xl font-bold text-[#101827]">{text.aboutTitle}</h2>
                <p className="mt-2 text-sm leading-6 text-[#4b5563]">{text.aboutText}</p>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-[#f1f7ff] p-3 text-sm font-semibold text-[#245bd6]">
              {text.languageApplied}: {selectedLanguage.native} ({selectedLanguage.label})
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-md border border-[#d9e4ee] bg-white p-4 shadow-sm">
                <div className="text-[#245bd6]">{stat.icon}</div>
                <p className="mt-3 text-2xl font-extrabold text-[#101827]">{stat.value}</p>
                <p className="mt-1 text-xs font-bold uppercase text-[#64748b]">{stat.label}</p>
              </div>
            ))}
          </section>

          <section className="rounded-md border border-[#d9e4ee] bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#101827]">{text.stepsTitle}</h2>
            <div className="mt-4 grid gap-3">
              {steps.map((step, index) => (
                <div key={step.title} className="grid grid-cols-[34px_1fr] gap-3 rounded-md border border-[#edf1f6] p-3">
                  <span className="grid size-8 place-items-center rounded-md bg-[#eef6ff] text-[#245bd6]">{step.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-[#101827]">0{index + 1} - {step.title}</p>
                    <p className="mt-1 text-sm leading-5 text-[#64748b]">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#f4f3ec] p-3">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b6a60]">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function LanguageMenu({
  className = "",
  selectedLanguage,
  onSelect,
}: {
  className?: string;
  selectedLanguage: LanguageCode;
  onSelect: (language: LanguageOption) => void;
}) {
  return (
    <div className={`${className} w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl border border-[#e5eaf3] bg-white p-3 shadow-2xl shadow-slate-900/18`}>
      {languageOptions.map((language) => {
        const selected = selectedLanguage === language.code;
        return (
          <button
            key={language.label}
            data-language-code={language.code}
            aria-label={`Select ${language.label}`}
            className={`grid w-full grid-cols-[42px_1fr_90px] items-center gap-3 rounded-xl px-4 py-3 text-left transition ${selected ? "bg-[#eef6ff] text-[#245bd6]" : "text-[#313946] hover:bg-[#f5f7fb]"}`}
            onClick={() => onSelect(language)}
          >
            <span className="text-sm font-extrabold uppercase text-[#245bd6]">{language.code}</span>
            <span className="text-lg font-bold">{language.native}</span>
            <span className={`text-right text-base ${selected ? "font-bold text-[#245bd6]" : "text-[#8a93a3]"}`}>{language.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function PredictionCard({ college }: { college: Prediction }) {
  const color = college.riskLevel === "Safe" ? "#256f5a" : college.riskLevel === "Moderate" ? "#b16d2a" : "#9b5147";
  const maxRank = Math.max(...college.cutoffHistory.map((item) => item.closingRank));
  return (
    <article className="rounded-md border border-[#e4e1d8] p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold">{college.name}</p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b6a60]">{college.competitionIntensity} competition</p>
        </div>
        <span className="rounded-sm px-2 py-1 text-xs font-bold text-white" style={{ backgroundColor: color }}>{college.probability}%</span>
      </div>
      <div className="mt-3 h-2 rounded-sm bg-[#e4e1d8]"><div className="h-full rounded-sm" style={{ width: `${college.probability}%`, backgroundColor: color }} /></div>
      <p className="mt-2 text-sm text-[#55564d]">{college.riskLevel} risk, branch cutoff near {college.branchCutoff.toLocaleString("en-IN")}</p>
      <div className="mt-3 grid gap-2">
        {college.cutoffHistory.map((item) => (
          <div key={item.year} className="grid grid-cols-[42px_1fr_70px] items-center gap-2 text-xs">
            <span className="font-semibold text-[#6b6a60]">{item.year}</span>
            <div className="h-2 rounded-sm bg-[#f4f3ec]"><div className="h-full rounded-sm bg-[#256f5a]" style={{ width: `${(item.closingRank / maxRank) * 100}%` }} /></div>
            <span className="text-right font-semibold">{item.closingRank.toLocaleString("en-IN")}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-md bg-[#f4f3ec] p-2 text-xs leading-5 text-[#55564d]">{college.guidance}</p>
    </article>
  );
}

function CompareTable({ colleges }: { colleges: College[] }) {
  if (!colleges.length) return null;
  const winner = [...colleges].sort((a, b) => roiScore(b) - roiScore(a) || b.placementRate - a.placementRate)[0];
  const rows = [
    ["Fees", ...colleges.map((college) => money.format(college.annualFee))],
    ["Placements", ...colleges.map((college) => `${college.placementRate}% placed, ${money.format(college.averagePackage)} avg`)],
    ["Tier", ...colleges.map((college) => tierFor(college))],
    ["Cutoff", ...colleges.map((college) => college.rankCutoff.toLocaleString("en-IN"))],
    ["Location", ...colleges.map((college) => `${college.city}, ${college.state}`)],
  ];
  return (
    <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Decision cockpit</h2>
        <span className="rounded-md bg-[#eaf3ee] px-3 py-2 text-xs font-bold text-[#256f5a]">Winner: {winner.name}</span>
      </div>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <tbody>{rows.map((row) => (
            <tr key={row[0]} className="border-t border-[#e4e1d8]">
              {row.map((cell, index) => <td key={`${row[0]}-${cell}`} className={`p-3 ${index === 0 ? "font-semibold text-[#6b6a60]" : ""}`}>{cell}</td>)}
            </tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}

function TransparencyPanel() {
  return (
    <section id="methodology" className="scroll-mt-24 grid gap-3 rounded-md border border-[#d7d5c9] bg-white p-4 md:grid-cols-3">
      <div className="flex gap-3">
        <Database className="mt-1 text-[#256f5a]" size={20} />
        <div>
          <h2 className="font-semibold">Data sources</h2>
          <p className="mt-1 text-sm leading-6 text-[#55564d]">JoSAA, CSAB, state counselling portals, and bundled fallback data.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <TrendingUp className="mt-1 text-[#b16d2a]" size={20} />
        <div>
          <h2 className="font-semibold">Trend model</h2>
          <p className="mt-1 text-sm leading-6 text-[#55564d]">Year-wise closing rank adjustment with quota, category, and branch pressure.</p>
        </div>
      </div>
      <div className="flex gap-3">
        <ShieldCheck className="mt-1 text-[#9b5147]" size={20} />
        <div>
          <h2 className="font-semibold">Last updated</h2>
          <p className="mt-1 text-sm leading-6 text-[#55564d]">June 6, 2026. Raw cutoff tables are represented through the trend bars.</p>
        </div>
      </div>
    </section>
  );
}

function ContactFooter({ text, jumpTo }: { text: CleanCopy; jumpTo: (section: NavItem) => void }) {
  const contacts = [
    { label: "Email", value: "support@collegecompass.in", icon: <Mail size={19} /> },
    { label: "Phone", value: "+91 98765 43210", icon: <Phone size={19} /> },
    { label: "Counselling desk", value: "Mon-Sat, 9:00 AM - 7:00 PM IST", icon: <LifeBuoy size={19} /> },
  ];

  return (
    <footer id="contact" className="scroll-mt-24 border-t border-[#dfe7ee] bg-[#101827] text-white">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-md bg-[#2563eb] text-white">
              <GraduationCap size={23} />
            </span>
            <span className="text-2xl font-extrabold">CollegeCompass</span>
          </div>
          <h2 className="mt-5 text-3xl font-bold tracking-normal">{text.contactTitle}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#cbd5e1]">{text.contactText}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="primary-button bg-[#2563eb] px-5 hover:bg-[#1d4ed8]" onClick={() => jumpTo("College Finder")}>
              <Search size={18} /> {text.finder}
            </button>
            <button className="secondary-button border-white/20 bg-white/10 px-5 text-white hover:border-white hover:text-white" onClick={() => jumpTo("Feedback")}>
              <MessageSquare size={18} /> {text.nav.Feedback}
            </button>
          </div>
        </div>

        <div className="grid gap-3">
          {contacts.map((contact) => (
            <div key={contact.label} className="grid grid-cols-[42px_1fr] gap-3 rounded-md border border-white/10 bg-white/[0.08] p-4">
              <span className="grid size-10 place-items-center rounded-md bg-white/10 text-[#93c5fd]">{contact.icon}</span>
              <div>
                <p className="text-xs font-bold uppercase text-[#94a3b8]">{contact.label}</p>
                <p className="mt-1 font-semibold text-white">{contact.value}</p>
              </div>
            </div>
          ))}
          <div className="rounded-md border border-white/10 bg-white/[0.08] p-4">
            <p className="text-xs font-bold uppercase text-[#94a3b8]">Quick links</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {navItems.map((item) => (
                <button key={item} className="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-[#e2e8f0] hover:bg-white/[0.18]" onClick={() => jumpTo(item)}>
                  {text.nav[item]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-4 text-center text-xs text-[#94a3b8]">
        © 2026 CollegeCompass. College data is for counselling guidance and should be verified with official admission portals.
      </div>
    </footer>
  );
}

function Discussion({
  questions,
  draft,
  setDraft,
  askQuestion,
  text,
}: {
  questions: Question[];
  draft: { title: string; body: string };
  setDraft: (value: { title: string; body: string }) => void;
  askQuestion: () => void;
  text: CleanCopy;
}) {
  return (
    <section id="feedback" className="scroll-mt-24 rounded-md border border-[#d7d5c9] bg-white p-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-[#9b5147]" size={20} />
        <h2 className="text-lg font-semibold">{text.feedbackTitle}</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_120px]">
        <input className="field h-11" placeholder={text.questionTitlePlaceholder} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <input className="field h-11" placeholder={text.questionContextPlaceholder} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
        <button className="primary-button" onClick={askQuestion}>{text.ask}</button>
      </div>
      <div className="mt-4 grid gap-3">
        {questions.map((question) => (
          <article key={question.id} className="rounded-md border border-[#e4e1d8] p-3">
            <h3 className="font-semibold">{question.title}</h3>
            <p className="mt-1 text-sm leading-6 text-[#55564d]">{question.body}</p>
            <p className="mt-2 text-xs font-semibold text-[#6b6a60]">{question.answers.length} answers {question.college?.name ? `- ${question.college.name}` : ""}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
