"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface InternData {
    id: string;
    email: string;
    full_name: string | null;
    totalGoalsSet: number;
    totalGoalsCompleted: number;
}

export async function getInternsWithGoalStats(): Promise<InternData[]> {
    const supabase = await createSupabaseServerClient();

    const adminEmailsStr = process.env.ADMIN_EMAILS || "";
    const adminEmails = new Set(
        adminEmailsStr
            .split(",")
            .map((e) => e.trim().toLowerCase())
            .filter((e) => e.length > 0)
    );

    const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .order("full_name", { ascending: true });

    const interns = (allProfiles ?? []).filter(
        (profile: any) => !adminEmails.has((profile.email ?? "").toLowerCase())
    );

    const internIds = interns.map((intern) => intern.id);

    if (internIds.length === 0) {
        return interns.map((intern) => ({
            id: intern.id,
            email: intern.email ?? "",
            full_name: intern.full_name,
            totalGoalsSet: 0,
            totalGoalsCompleted: 0,
        }));
    }

    const { data: allGoals } = await supabase
        .from("goals")
        .select("user_id, status")
        .in("user_id", internIds);

    const goalStats: Record<string, { set: number; completed: number }> = {};
    interns.forEach((intern) => {
        goalStats[intern.id] = { set: 0, completed: 0 };
    });

    (allGoals ?? []).forEach((goal: any) => {
        if (goalStats[goal.user_id]) {
            goalStats[goal.user_id].set += 1;
            if (goal.status === "completed") {
                goalStats[goal.user_id].completed += 1;
            }
        }
    });

    return interns.map((intern) => ({
        id: intern.id,
        email: intern.email ?? "",
        full_name: intern.full_name,
        totalGoalsSet: goalStats[intern.id].set,
        totalGoalsCompleted: goalStats[intern.id].completed,
    }));
}
