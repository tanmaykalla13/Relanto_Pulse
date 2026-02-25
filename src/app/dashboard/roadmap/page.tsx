import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getRoadmapData } from "@/lib/actions/roadmap";
import { WeekAccordion } from "@/components/roadmap/week-accordion";

export default async function RoadmapPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const weeks = await getRoadmapData();
  if (weeks.length === 0) {
    return (
      <main className="min-h-screen px-6 py-10 bg-white dark:bg-slate-950">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Roadmap</h1>
        <p className="mt-4 text-slate-600 dark:text-slate-400">
          No roadmap data. Run the database migration to seed weeks.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Roadmap</h1>
        <p className="mb-8 text-sm text-slate-600 dark:text-slate-400">
          Weeks 1–4: Virtual • Weeks 5–20: In-Office
        </p>
        <WeekAccordion weeks={weeks} />
      </div>
    </main>
  );
}
