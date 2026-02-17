"use server";

import { format, parseISO } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface Week {
  id: string;
  week_number: number;
  title: string;
  phase: "Virtual" | "In-Office";
  start_date: string;
  end_date: string;
}

export interface DaySummary {
  date: string;
  dayName: string;
  goals: { id: string; title: string; status: string }[];
  completedCount: number;
}

export interface WeekWithDays extends Week {
  days: DaySummary[];
}

export async function getRoadmapData(): Promise<WeekWithDays[]> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: weeks, error: weeksError } = await supabase
    .from("weeks")
    .select("*")
    .order("week_number", { ascending: true });

  if (weeksError || !weeks) return [];

  const { data: goals } = await supabase
    .from("goals")
    .select("id, title, status, target_date")
    .eq("user_id", user.id);

  const goalsByDate = new Map<string, { id: string; title: string; status: string }[]>();
  for (const g of goals ?? []) {
    const d = (g as { target_date: string }).target_date;
    if (!goalsByDate.has(d)) goalsByDate.set(d, []);
    goalsByDate.get(d)!.push({
      id: (g as { id: string }).id,
      title: (g as { title: string }).title,
      status: (g as { status: string }).status,
    });
  }

  const result: WeekWithDays[] = [];

  for (const w of weeks as Week[]) {
    const start = parseISO(w.start_date);
    const end = parseISO(w.end_date);
    const days: DaySummary[] = [];

    for (let i = 0; i < 5; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      if (d > end) break;
      const dateStr = format(d, "yyyy-MM-dd");
      const list = goalsByDate.get(dateStr) ?? [];
      const completedCount = list.filter((g) => g.status === "completed").length;
      days.push({
        date: dateStr,
        dayName: format(d, "EEE"),
        goals: list,
        completedCount,
      });
    }

    result.push({
      ...w,
      days,
    });
  }

  return result;
}

export async function updateWeekTitle(
  weekId: string,
  newTitle: string
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("weeks")
    .update({ title: newTitle.trim() || "Untitled" })
    .eq("id", weekId);

  return { error: error?.message ?? null };
}
