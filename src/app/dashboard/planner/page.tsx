import { redirect } from "next/navigation";
import { format } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getPlannerData } from "@/lib/actions/planner";
import { DateNav } from "@/components/planner/date-nav";
import { PlannerGoals } from "@/components/planner/planner-goals";
import { JournalEditor } from "@/components/planner/journal-editor";
import { FileUploadSection } from "@/components/planner/file-upload-section";

const INTERNSHIP_START = new Date("2026-02-02");
const INTERNSHIP_END = new Date("2026-06-30");

export default async function PlannerPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const params = await searchParams;
  const rawDate = params.date;
  let dateStr: string;

  if (rawDate) {
    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      dateStr = format(d, "yyyy-MM-dd");
    } else {
      dateStr = format(new Date(), "yyyy-MM-dd");
    }
  } else {
    dateStr = format(new Date(), "yyyy-MM-dd");
  }

  const start = new Date(INTERNSHIP_START);
  const end = new Date(INTERNSHIP_END);
  const selected = new Date(dateStr);
  if (selected < start || selected > end) {
    dateStr = format(new Date(), "yyyy-MM-dd");
  }

  const data = await getPlannerData(dateStr);
  if (!data) redirect("/login");

  return (
    <main className="min-h-screen px-6 py-10 bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">Planner</h1>

        <div className="mb-8">
          <DateNav currentDate={dateStr} />
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-6">
            <PlannerGoals key={dateStr} dateStr={dateStr} goals={data.goals} />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-6">
              <JournalEditor
                key={dateStr}
                dateStr={dateStr}
                initialContent={data.journal?.content ?? ""}
              />
            </div>
            <div className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-6">
              <FileUploadSection
                key={dateStr}
                dateStr={dateStr}
                attachments={data.attachments}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
