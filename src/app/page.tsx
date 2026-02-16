import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-5xl mx-auto grid gap-12 md:grid-cols-2 items-center">
        <section className="space-y-6">
          <p className="text-sm font-semibold tracking-[0.2em] text-sky-400 uppercase">
            Progress Tracking Platform
          </p>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            RELANTO PULSE - A PROGRESS TRACKING PLATFORM
          </h1>
          <p className="text-slate-300 text-base md:text-lg max-w-xl">
            The all-in-one workspace for Digital Trainees. Centralize goals,
            track milestones, and stay aligned with every learning sprint.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-sky-400 hover:text-sky-200"
            >
              Sign Up
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-400 pt-4">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live cohort visibility
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Weekly progress pulses
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Actionable feedback loops
            </span>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-900/50 to-sky-950/50 p-6 md:p-8 shadow-2xl shadow-black/40">
          <div className="space-y-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Snapshot
            </p>
            <h2 className="text-lg font-semibold text-slate-50">
              Cohort Pulse Overview
            </h2>
            <p className="text-sm text-slate-300">
              See how every trainee is progressing across tracks, skills, and
              learning modules in real time.
            </p>
          </div>

          <div className="mt-6 grid gap-4 text-xs text-slate-200">
            <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
              <span>Active Trainees</span>
              <span className="text-sm font-semibold text-emerald-400">
                48 / 52
              </span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
              <span>On-track Modules</span>
              <span className="text-sm font-semibold text-sky-400">87%</span>
            </div>
            <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-4 py-3">
              <span>Feedback Cycles</span>
              <span className="text-sm font-semibold text-violet-400">
                Every 7 days
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

