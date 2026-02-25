"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils/admin";

export async function getLoginRedirectPath(): Promise<string> {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
        return "/dashboard";
    }

    return isAdminEmail(user.email) ? "/admin" : "/dashboard";
}
