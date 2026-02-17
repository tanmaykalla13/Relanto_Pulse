"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateNavProps {
  currentDate: string;
}

export function DateNav({ currentDate }: DateNavProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dt = new Date(currentDate);

  function goTo(d: Date) {
    const str = format(d, "yyyy-MM-dd");
    router.push(`/dashboard/planner?date=${str}`);
    setOpen(false);
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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors"
          >
            <CalendarIcon className="h-4 w-4" />
            {format(dt, "EEE, MMM d, yyyy")}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={dt}
            onSelect={(date) => date && goTo(date)}
            defaultMonth={dt}
            onMonthChange={() => {}}
            className="rounded-xl border-0"
            disabled={(date) => {
              const start = new Date("2026-02-02");
              const end = new Date("2026-06-30");
              return date < start || date > end;
            }}
          />
        </PopoverContent>
      </Popover>

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
