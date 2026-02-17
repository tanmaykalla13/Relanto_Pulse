"use client";

import { useRouter } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DateNavProps {
  currentDate: string;
}

export function DateNav({ currentDate }: DateNavProps) {
  const router = useRouter();
  const dt = new Date(currentDate);

  function goTo(d: Date) {
    const str = format(d, "yyyy-MM-dd");
    router.push(`/dashboard/planner?date=${str}`);
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2">
      <button
        type="button"
        onClick={() => goTo(subDays(dt, 1))}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        aria-label="Previous day"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-slate-800">
        <Calendar className="h-4 w-4" />
        {format(dt, "EEE, MMM d, yyyy")}
        <input
          type="date"
          value={currentDate}
          onChange={(e) => goTo(new Date(e.target.value))}
          className="absolute h-0 w-0 opacity-0"
        />
      </label>

      <button
        type="button"
        onClick={() => goTo(addDays(dt, 1))}
        className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
        aria-label="Next day"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
