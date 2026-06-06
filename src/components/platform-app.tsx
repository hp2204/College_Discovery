"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Bookmark,
  Bot,
  Building2,
  Database,
  GitCompare,
  GraduationCap,
  Home,
  LogOut,
  MapPin,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { College } from "@/lib/sample-data";

type User = { id: string; name: string; email: string };
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
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [auth, setAuth] = useState({ name: "Demo Student", email: "demo@student.com", password: "password" });
  const [saved, setSaved] = useState<College[]>([]);

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
    fetch("/api/auth/me").then((res) => res.json()).then((data) => setUser(data.user));
    refreshSaved();
    refreshQuestions();
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

  async function submitAuth() {
    const endpoint = authMode === "signup" ? "/api/auth/signup" : "/api/auth/login";
    const res = await fetch(endpoint, { method: "POST", body: JSON.stringify(auth) });
    const data = await res.json();
    if (res.ok) {
      setUser(data.user);
      refreshSaved();
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setSaved([]);
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

  const savedIds = new Set(saved.map((college) => college.id));
  const pages = Math.max(Math.ceil(total / 6), 1);
  const bestPrediction = predictions[0];

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#161712]">
      <header className="border-b border-[#d7d5c9] bg-[#fbfbf6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-md bg-[#256f5a] text-white">
              <GraduationCap size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#6b6a60]">Decision intelligence for admissions</p>
              <h1 className="text-2xl font-semibold tracking-normal">AdmitLens</h1>
            </div>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-[#d7d5c9] bg-white px-3 py-2 text-sm">Signed in as {user.name}</span>
              <button className="icon-button" onClick={logout} title="Log out">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="grid gap-2 rounded-md border border-[#d7d5c9] bg-white p-2 sm:grid-cols-[110px_170px_120px_44px]">
              {authMode === "signup" && <input className="field" aria-label="Name" value={auth.name} onChange={(e) => setAuth({ ...auth, name: e.target.value })} />}
              <input className="field" aria-label="Email" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} />
              <input className="field" aria-label="Password" type="password" value={auth.password} onChange={(e) => setAuth({ ...auth, password: e.target.value })} />
              <button className="primary-button" onClick={submitAuth}>{authMode === "signup" ? "Join" : "Go"}</button>
              <button className="text-left text-xs font-semibold text-[#256f5a] sm:col-span-full" onClick={() => setAuthMode(authMode === "signup" ? "login" : "signup")}>
                Switch to {authMode === "signup" ? "login" : "signup"}
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[1fr_390px]">
        <div className="space-y-5">
          <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
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
                  style={{ backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.48)), url(${college.imageUrl})` }}
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
          <Discussion questions={questions} draft={questionDraft} setDraft={setQuestionDraft} askQuestion={askQuestion} />
        </div>

        <aside className="space-y-5">
          <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-[#b16d2a]" size={20} />
              <h2 className="text-lg font-semibold">Prediction cockpit</h2>
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
              <button className="primary-button h-11" onClick={() => predict()}>Find matches</button>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="secondary-button" onClick={() => { const next = String(Math.max(Number(rank) - 5000, 1)); setRank(next); predict(next); }}>Rank improves</button>
              <button className="secondary-button" onClick={() => { const next = String(Number(rank) + 5000); setRank(next); predict(next); }}>Rank worsens</button>
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
    </main>
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
    <section className="grid gap-3 rounded-md border border-[#d7d5c9] bg-white p-4 md:grid-cols-3">
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

function Discussion({ questions, draft, setDraft, askQuestion }: { questions: Question[]; draft: { title: string; body: string }; setDraft: (value: { title: string; body: string }) => void; askQuestion: () => void }) {
  return (
    <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="text-[#9b5147]" size={20} />
        <h2 className="text-lg font-semibold">Counselling Q&A</h2>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_120px]">
        <input className="field h-11" placeholder="Question title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} />
        <input className="field h-11" placeholder="Add context" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
        <button className="primary-button" onClick={askQuestion}>Ask</button>
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
