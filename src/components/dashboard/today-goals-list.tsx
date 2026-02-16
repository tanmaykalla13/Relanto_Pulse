"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Circle, Loader2 } from "lucide-react";
import type { Goal, GoalStatus } from "@/lib/actions/dashboard";
import { toggleGoalStatus } from "@/lib/actions/dashboard";

interface TodayGoalsListProps {
  goals: Goal[];
}

const statusToNext: Record<GoalStatus, GoalStatus> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: "pending",
};

export function TodayGoalsList({ goals: initialGoals }: TodayGoalsListProps) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function handleToggle(goalId: string, currentStatus: GoalStatus) {
    const nextStatus = statusToNext[currentStatus];
    setPendingId(goalId);
    await toggleGoalStatus(goalId, nextStatus);
    setPendingId(null);
    router.refresh();
  }

  if (initialGoals.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 px-6 py-10 text-center text-sm text-slate-400">
        No goals set for today. Go to Planner to add some.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {initialGoals.map((goal) => {
        const isCompleted = goal.status === "completed";
        return (
          <li
            key={goal.id}
            className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-3"
          >
            <button
              type="button"
              onClick={() => handleToggle(goal.id, goal.status)}
              disabled={pendingId === goal.id}
              className="flex shrink-0 items-center justify-center rounded-full transition-colors hover:bg-slate-700 disabled:opacity-50"
              aria-label={
                isCompleted ? "Mark as incomplete" : "Mark as complete"
              }
            >
              {isCompleted ? (
                <Check className="h-5 w-5 text-emerald-400" />
              ) : (
                <Circle className="h-5 w-5 text-slate-500" />
              )}
            </button>
            <span
              className={`flex-1 text-sm ${
                isCompleted ? "text-slate-500 line-through" : "text-slate-100"
              }`}
            >
              {goal.title}
            </span>
            {pendingId === goal.id && (
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            )}
          </li>
        );
      })}
    </ul>
  );
}
