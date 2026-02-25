"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ProfileData {
  full_name: string;
  manager: string;
  github_url: string;
  linkedin_url: string;
  department: string;
  role: string;
  tech_stack: string;
}

export async function updateUserProfile(
  data: ProfileData
): Promise<{ error: string | null; success: boolean }> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", success: false };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      manager: data.manager,
      github_url: data.github_url,
      linkedin_url: data.linkedin_url,
      department: data.department,
      role: data.role,
      tech_stack: data.tech_stack,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/dashboard/profile");

  return { error: null, success: true };
}

export async function getUserProfile() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    return null;
  }

  return {
    email: data.email || "",
    full_name: data.full_name || null,
    manager: data.manager || null,
    github_url: data.github_url || null,
    linkedin_url: data.linkedin_url || null,
    department: data.department || null,
    role: data.role || null,
    tech_stack: data.tech_stack || null,
  };
}
