"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { WeekWithDays } from "@/lib/actions/roadmap";
import { updateWeekTitle } from "@/lib/actions/roadmap";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

interface WeekAccordionProps {
  weeks: WeekWithDays[];
}

export function WeekAccordion({ weeks: initialWeeks }: WeekAccordionProps) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(
    initialWeeks[0]?.id ?? null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  async function handleTitleBlur(weekId: string) {
    if (editingId !== weekId || !editTitle.trim()) {
      setEditingId(null);
      return;
    }
    await updateWeekTitle(weekId, editTitle);
    setEditingId(null);
    setEditTitle("");
    router.refresh();
  }

  function startEdit(w: WeekWithDays) {
    setEditingId(w.id);
    setEditTitle(w.title);
  }

  return (
    <div className="space-y-2">
      {initialWeeks.map((week) => {
        const isExpanded = expandedId === week.id;
        const isEditing = editingId === week.id;
        const isVirtual = week.phase === "Virtual";

        return (
          <div
            key={week.id}
            className={cn(
              "overflow-hidden rounded-xl border",
              isVirtual
                ? "border-indigo-500/30 bg-indigo-950/20"
                : "border-emerald-500/30 bg-emerald-950/20"
            )}
          >
            {/* Header */}
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-3",
                isVirtual ? "bg-indigo-900/30" : "bg-emerald-900/30"
              )}
            >
              <button
                type="button"
                onClick={() =>
                  setExpandedId(isExpanded ? null : week.id)
                }
                className="rounded p-1 text-slate-400 hover:text-white"
              >
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </button>

              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-xs font-medium",
                  isVirtual ? "bg-indigo-500/30 text-indigo-200" : "bg-emerald-500/30 text-emerald-200"
                )}
              >
                {week.phase}
              </span>

              <span className="text-sm font-medium text-slate-300">
                Week {week.week_number}
              </span>

              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => handleTitleBlur(week.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleBlur(week.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-white outline-none focus:border-sky-500"
                  autoFocus
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit(week)}
                  className="flex-1 rounded px-2 py-1 text-left text-sm text-white hover:bg-slate-800/50"
                >
                  {week.title}
                </button>
              )}
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-slate-800/50 p-4">
                <div className="grid gap-3 sm:grid-cols-5">
                  {week.days.map((day) => (
                    <div
                      key={day.date}
                      className="rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                    >
                      <p className="text-xs font-medium text-slate-400">
                        {day.dayName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {day.date}
                      </p>
                      {day.goals.length === 0 ? (
                        <p className="mt-2 text-xs text-slate-500">
                          No goals
                        </p>
                      ) : (
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-emerald-400">
                            {day.completedCount} / {day.goals.length} completed
                          </p>
                          <ul className="space-y-0.5">
                            {day.goals.slice(0, 3).map((g) => (
                              <li
                                key={g.id}
                                className="truncate text-xs text-slate-300"
                              >
                                • {g.title}
                              </li>
                            ))}
                            {day.goals.length > 3 && (
                              <li className="text-xs text-slate-500">
                                +{day.goals.length - 3} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
