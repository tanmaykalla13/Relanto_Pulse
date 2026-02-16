"use server";

import { format } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const INTERNSHIP_START = new Date("2026-02-02");
const INTERNSHIP_END = new Date("2026-06-30");

export type GoalStatus = "pending" | "in_progress" | "completed";

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  status: GoalStatus;
  target_date: string;
  created_at: string;
}

export interface DashboardStats {
  progressPercent: number;
  currentDay: number;
  totalDays: number;
  backlogCount: number;
  profile: {
    full_name: string | null;
    email: string;
    role: string;
  };
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(INTERNSHIP_START);
  start.setHours(0, 0, 0, 0);
  const end = new Date(INTERNSHIP_END);
  end.setHours(0, 0, 0, 0);

  const totalDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  const elapsedDays = Math.max(
    0,
    Math.ceil((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );
  const progressPercent = Math.min(
    100,
    Math.round((elapsedDays / totalDays) * 100)
  );

  const todayStr = format(today, "yyyy-MM-dd");

  const { count: backlogCount } = await supabase
    .from("goals")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lt("target_date", todayStr)
    .neq("status", "completed");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .single();

  const fullName =
    profileRow?.full_name?.trim() ||
    user.user_metadata?.full_name ||
    null;
  const role = profileRow?.role ?? "Intern";

  return {
    progressPercent,
    currentDay: elapsedDays,
    totalDays,
    backlogCount: backlogCount ?? 0,
    profile: {
      full_name: fullName,
      email: user.email ?? "",
      role,
    },
  };
}

export async function getTodayGoals(): Promise<Goal[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", user.id)
    .eq("target_date", todayStr)
    .order("created_at", { ascending: true });

  if (error) return [];

  const statusOrder: Record<GoalStatus, number> = {
    pending: 0,
    in_progress: 1,
    completed: 2,
  };
  const goals = (data ?? []) as Goal[];
  goals.sort(
    (a, b) =>
      statusOrder[a.status] - statusOrder[b.status] ||
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
  return goals;
}

export async function toggleGoalStatus(
  goalId: string,
  newStatus: GoalStatus
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("goals")
    .update({ status: newStatus })
    .eq("id", goalId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}
