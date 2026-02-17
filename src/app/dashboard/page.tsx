import { redirect } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getDashboardStats,
  getTodayGoals,
} from "@/lib/actions/dashboard";
import { TodayGoalsList } from "@/components/dashboard/today-goals-list";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [stats, todayGoals] = await Promise.all([
    getDashboardStats(),
    getTodayGoals(),
  ]);

  if (!stats) {
    redirect("/login");
  }

  const displayName = stats.profile.full_name || stats.profile.email || "there";
  const currentDate = format(new Date(), "EEEE, MMM d, yyyy");

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            Welcome back, {displayName} 👋
          </h1>
          <p className="mt-1 text-sm text-slate-400">{currentDate}</p>
        </header>

        {/* Stats Grid */}
        <section className="mb-10 grid gap-6 md:grid-cols-2">
          {/* Progress Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-sm font-semibold text-slate-200">
              Internship Progress
            </h2>
            <div className="mt-4">
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-sky-500 transition-all duration-500"
                  style={{ width: `${stats.progressPercent}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-slate-400">
                Day {stats.currentDay} of {stats.totalDays}
              </p>
            </div>
          </div>

          {/* Backlog Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-sm font-semibold text-slate-200">
              Action Required
            </h2>
            <div className="mt-4">
              {stats.overdueDates.length === 0 ? (
                <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  You are all caught up! 🚀
                </div>
              ) : (
                <div className="rounded-xl bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
                  <span className="block mb-2">
                    You have pending goals on:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {stats.overdueDates.map((dateStr) => {
                      const d = new Date(dateStr + "T12:00:00");
                      const label = format(d, "MMM d");
                      return (
                        <Link
                          key={dateStr}
                          href={`/dashboard/planner?date=${dateStr}`}
                          className="inline-flex items-center rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-medium text-amber-200 hover:bg-amber-500/30 hover:text-amber-100"
                        >
                          {label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Today's Focus */}
        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">
            Today&apos;s Focus
          </h2>
          <TodayGoalsList goals={todayGoals} />
        </section>
      </div>
    </main>
  );
}
