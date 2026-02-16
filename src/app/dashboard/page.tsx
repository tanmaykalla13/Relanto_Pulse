import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const email = user.email ?? "trainee";

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-sky-400 uppercase">
              Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold">
              Welcome, <span className="text-sky-300">{email}</span>
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              Track cohort progress, surface risks early, and keep every digital
              trainee on course.
            </p>
          </div>

          <SignOutButton />
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-xs font-medium text-slate-400">On-track</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-400">32</p>
            <p className="mt-1 text-[11px] text-slate-400">
              Trainees meeting all current sprint expectations.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-xs font-medium text-slate-400">
              Needs Attention
            </p>
            <p className="mt-2 text-3xl font-semibold text-amber-300">9</p>
            <p className="mt-1 text-[11px] text-slate-400">
              At-risk trainees flagged by the latest pulse.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
            <p className="text-xs font-medium text-slate-400">Check-ins</p>
            <p className="mt-2 text-3xl font-semibold text-sky-300">14</p>
            <p className="mt-1 text-[11px] text-slate-400">
              1:1s scheduled for this week across the cohort.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

