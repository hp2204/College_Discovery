import { CollegeDetail } from "@/components/college-detail";

export default async function CollegePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollegeDetail slug={slug} />;
}
