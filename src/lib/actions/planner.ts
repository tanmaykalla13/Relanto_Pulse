"use server";

import { format } from "date-fns";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Goal, GoalStatus } from "./dashboard";

export interface JournalEntry {
  id: string;
  user_id: string;
  entry_date: string;
  content: string;
  created_at: string;
}

export interface Attachment {
  id: string;
  user_id: string;
  entry_date: string;
  file_name: string;
  file_path: string;
  file_type: string | null;
  file_size: number | null;
  created_at: string;
}

export interface PlannerData {
  goals: Goal[];
  journal: JournalEntry | null;
  attachments: Attachment[];
}

export async function getPlannerData(
  dateStr: string
): Promise<PlannerData | null> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [goalsRes, journalRes, attachmentsRes] = await Promise.all([
    supabase
      .from("goals")
      .select("*")
      .eq("user_id", user.id)
      .eq("target_date", dateStr)
      .order("created_at", { ascending: true }),
    supabase
      .from("journals")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", dateStr)
      .maybeSingle(),
    supabase
      .from("attachments")
      .select("*")
      .eq("user_id", user.id)
      .eq("entry_date", dateStr)
      .order("created_at", { ascending: true }),
  ]);

  const statusOrder: Record<GoalStatus, number> = {
    pending: 0,
    in_progress: 1,
    completed: 2,
  };
  const goals = ((goalsRes.data ?? []) as Goal[]).sort(
    (a, b) =>
      statusOrder[a.status] - statusOrder[b.status] ||
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return {
    goals,
    journal: journalRes.data as JournalEntry | null,
    attachments: (attachmentsRes.data ?? []) as Attachment[],
  };
}

export async function saveJournal(
  dateStr: string,
  content: string
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("journals").upsert(
    {
      user_id: user.id,
      entry_date: dateStr,
      content,
    },
    {
      onConflict: "user_id,entry_date",
    }
  );

  return { error: error?.message ?? null };
}

export async function uploadAttachment(
  dateStr: string,
  formData: FormData
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const file = formData.get("file") as File | null;
  if (!file || !file.size) return { error: "No file provided" };

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const storagePath = `${user.id}/${dateStr}_${crypto.randomUUID()}_${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("attachments")
    .upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) return { error: uploadError.message };

  const { error: insertError } = await supabase.from("attachments").insert({
    user_id: user.id,
    entry_date: dateStr,
    file_name: file.name,
    file_path: storagePath,
    file_type: file.type || null,
    file_size: file.size,
  });

  if (insertError) {
    await supabase.storage.from("attachments").remove([storagePath]);
    return { error: insertError.message };
  }

  return { error: null };
}

export async function deleteAttachment(
  id: string,
  filePath: string
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error: dbError } = await supabase
    .from("attachments")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (dbError) return { error: dbError.message };

  await supabase.storage.from("attachments").remove([filePath]);
  return { error: null };
}

export async function createGoal(
  dateStr: string,
  title: string
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase.from("goals").insert({
    user_id: user.id,
    target_date: dateStr,
    title: title.trim() || "Untitled Goal",
    status: "pending",
  });

  return { error: error?.message ?? null };
}

export async function updateGoal(
  goalId: string,
  updates: { title?: string; status?: GoalStatus }
): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const payload: Record<string, unknown> = {};
  if (updates.title !== undefined) payload.title = updates.title.trim();
  if (updates.status !== undefined) payload.status = updates.status;

  const { error } = await supabase
    .from("goals")
    .update(payload)
    .eq("id", goalId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}

const statusToNext: Record<GoalStatus, GoalStatus> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: "pending",
};

export async function toggleGoalStatus(
  goalId: string,
  currentStatus: GoalStatus
): Promise<{ error: string | null }> {
  return updateGoal(goalId, { status: statusToNext[currentStatus] });
}

export async function deleteGoal(goalId: string): Promise<{ error: string | null }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("goals")
    .delete()
    .eq("id", goalId)
    .eq("user_id", user.id);

  return { error: error?.message ?? null };
}
