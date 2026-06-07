"use client";

import Link from "next/link";
import type React from "react";
import { useEffect, useState } from "react";
import { ArrowLeft, Building2, IndianRupee, Star, TrendingUp } from "lucide-react";
import type { College } from "@/lib/sample-data";

const money = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function collegeImage(college: College) {
  return college.imageUrl ?? `https://source.unsplash.com/1200x620/?university,campus,${encodeURIComponent(college.city)}`;
}

export function CollegeDetail({ slug }: { slug: string }) {
  const [college, setCollege] = useState<College | null>(null);

  useEffect(() => {
    fetch(`/api/colleges/${slug}`).then((res) => res.json()).then(setCollege);
  }, [slug]);

  if (!college) {
    return <main className="grid min-h-screen place-items-center bg-[#f7f7f2] text-[#161712]">Loading college profile...</main>;
  }

  return (
    <main className="min-h-screen bg-[#f7f7f2] text-[#161712]">
      <section className="border-b border-[#d7d5c9] bg-white">
        <div
          className="min-h-[360px] bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(90deg, rgba(22,23,18,0.88), rgba(22,23,18,0.56), rgba(22,23,18,0.12)), url(${collegeImage(college)})` }}
        >
          <div className="mx-auto max-w-6xl px-5 py-6 text-white">
            <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#bde8d5]"><ArrowLeft size={16} /> Back to discovery</Link>
            <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_320px] lg:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#f2c078]">{college.type} - {college.city}, {college.state}</p>
                <h1 className="mt-2 max-w-4xl text-4xl font-semibold tracking-normal">{college.name}</h1>
                <p className="mt-4 max-w-3xl leading-7 text-[#f4f3ec]">{college.overview}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Tile icon={<Star size={18} />} label="Rating" value={`${college.rating}/5`} />
                <Tile icon={<TrendingUp size={18} />} label="Placement" value={`${college.placementRate}%`} />
                <Tile icon={<IndianRupee size={18} />} label="Annual fee" value={money.format(college.annualFee)} />
                <Tile icon={<Building2 size={18} />} label="Avg package" value={money.format(college.averagePackage)} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
            <h2 className="text-xl font-semibold">Courses</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead className="bg-[#f4f3ec] text-left text-xs uppercase tracking-[0.12em] text-[#6b6a60]">
                  <tr><th className="p-3">Program</th><th className="p-3">Duration</th><th className="p-3">Seats</th><th className="p-3">Fee</th></tr>
                </thead>
                <tbody>{college.courses.map((course) => (
                  <tr key={course.id} className="border-t border-[#e4e1d8]">
                    <td className="p-3 font-semibold">{course.name}</td><td className="p-3">{course.duration}</td><td className="p-3">{course.seats}</td><td className="p-3">{money.format(course.fee)}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </section>

          <section className="rounded-md border border-[#d7d5c9] bg-white p-4">
            <h2 className="text-xl font-semibold">Reviews</h2>
            <div className="mt-4 grid gap-3">
              {college.reviews.map((review) => (
                <article key={review.id} className="rounded-md border border-[#e4e1d8] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{review.author}</p>
                    <span className="text-sm font-semibold text-[#b16d2a]">{review.rating}/5</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[#55564d]">{review.comment}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-md border border-[#d7d5c9] bg-white p-4 lg:self-start">
          <h2 className="text-xl font-semibold">Placement snapshot</h2>
          <div className="mt-4 space-y-3">
            <Bar label="Placement rate" value={college.placementRate} suffix="%" />
            <div className="rounded-md bg-[#f4f3ec] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b6a60]">Average package</p>
              <p className="mt-1 text-2xl font-semibold">{money.format(college.averagePackage)}</p>
            </div>
            <div className="rounded-md bg-[#f4f3ec] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b6a60]">Highest package</p>
              <p className="mt-1 text-2xl font-semibold">{money.format(college.highestPackage)}</p>
            </div>
            <div className="rounded-md bg-[#eaf3ee] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#256f5a]">Decision hint</p>
              <p className="mt-1 text-sm leading-6 text-[#335347]">Use this profile as a comparator for ROI, branch availability, and location trade-offs before locking a counselling order.</p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}

function Tile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/20 bg-white/90 p-3 text-[#161712]">
      <div className="text-[#256f5a]">{icon}</div>
      <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b6a60]">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function Bar({ label, value, suffix }: { label: string; value: number; suffix: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-semibold"><span>{label}</span><span>{value}{suffix}</span></div>
      <div className="mt-2 h-2 rounded-sm bg-[#e4e1d8]"><div className="h-full rounded-sm bg-[#256f5a]" style={{ width: `${value}%` }} /></div>
    </div>
  );
}
