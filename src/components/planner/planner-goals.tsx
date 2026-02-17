"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  Circle,
  Pencil,
  Trash2,
  Plus,
  Loader2,
  X,
} from "lucide-react";
import type { Goal, GoalStatus } from "@/lib/actions/dashboard";
import {
  createGoal,
  updateGoal,
  deleteGoal,
  toggleGoalStatus,
} from "@/lib/actions/planner";

interface PlannerGoalsProps {
  dateStr: string;
  goals: Goal[];
}

const statusToNext: Record<GoalStatus, GoalStatus> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: "pending",
};

export function PlannerGoals({ dateStr, goals: initialGoals }: PlannerGoalsProps) {
  const router = useRouter();
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  async function handleAdd() {
    if (!newTitle.trim()) return;
    setIsAdding(true);
    await createGoal(dateStr, newTitle.trim());
    setNewTitle("");
    setIsAdding(false);
    router.refresh();
  }

  async function handleToggle(goalId: string, status: GoalStatus) {
    setPendingId(goalId);
    await toggleGoalStatus(goalId, statusToNext[status]);
    setPendingId(null);
    router.refresh();
  }

  async function handleSaveEdit(goalId: string) {
    if (editingId !== goalId) return;
    await updateGoal(goalId, { title: editTitle });
    setEditingId(null);
    setEditTitle("");
    router.refresh();
  }

  async function handleDelete(goalId: string) {
    setPendingId(goalId);
    await deleteGoal(goalId);
    setPendingId(null);
    setEditingId(null);
    router.refresh();
  }

  function startEdit(g: Goal) {
    setEditingId(g.id);
    setEditTitle(g.title);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Goals</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add goal..."
            className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={isAdding || !newTitle.trim()}
            className="flex items-center gap-1 rounded-lg bg-sky-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-sky-600 disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </div>
      </div>

      <ul className="space-y-2">
        {initialGoals.map((goal) => {
          const isCompleted = goal.status === "completed";
          const isEditing = editingId === goal.id;

          return (
            <li
              key={goal.id}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2"
            >
              <button
                type="button"
                onClick={() => handleToggle(goal.id, goal.status)}
                disabled={pendingId === goal.id}
                className="shrink-0 rounded p-0.5 hover:bg-slate-700 disabled:opacity-50"
              >
                {isCompleted ? (
                  <Check className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Circle className="h-5 w-5 text-slate-500" />
                )}
              </button>

              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(goal.id);
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    className="flex-1 rounded border border-slate-600 bg-slate-800 px-2 py-1 text-sm text-white outline-none focus:border-sky-500"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => handleSaveEdit(goal.id)}
                    className="rounded p-1 text-sky-400 hover:bg-slate-700"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`flex-1 text-sm ${
                      isCompleted ? "text-slate-500 line-through" : "text-slate-100"
                    }`}
                  >
                    {goal.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(goal)}
                    className="rounded p-1 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(goal.id)}
                    disabled={pendingId === goal.id}
                    className="rounded p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </li>
          );
        })}
      </ul>

      {initialGoals.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-700 py-6 text-center text-sm text-slate-500">
          No goals for this date. Add one above.
        </p>
      )}
    </div>
  );
}
