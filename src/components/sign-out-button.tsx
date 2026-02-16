"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    setError(null);
    const supabase = createSupabaseBrowserClient();

    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return;
    }

    startTransition(() => {
      router.push("/login");
      router.refresh();
    });
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleSignOut}
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-slate-50 shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LogOut className="h-4 w-4" />
        {isPending ? "Signing out..." : "Sign out"}
      </button>
      {error ? (
        <p className="text-xs text-red-400" role="status">
          {error}
        </p>
      ) : null}
    </div>
  );
}

