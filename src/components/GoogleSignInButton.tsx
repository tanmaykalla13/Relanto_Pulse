"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
        <svg viewBox="0 0 24 24" className="h-4 w-4">
          <path
            fill="#EA4335"
            d="M12 11.9v4.3h6.1c-.2 1.4-.9 2.6-2 3.4l3.2 2.5c1.9-1.8 3-4.4 3-7.5 0-.7-.1-1.4-.2-2.1z"
          />
          <path
            fill="#34A853"
            d="M12 24c2.7 0 5-0.9 6.7-2.4l-3.2-2.5c-.9.6-2 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.9v2.7C4.6 21.8 8 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M6.2 15.8c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V9.5H2.9C2.3 10.7 2 12 2 13.2c0 1.2.3 2.5.9 3.7z"
          />
          <path
            fill="#4285F4"
            d="M12 7.5c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.9 4.4 14.7 3.5 12 3.5 8 3.5 4.6 5.7 2.9 9.5l3.3 2.7C7 9.3 9.3 7.5 12 7.5z"
          />
        </svg>
      </span>
      <span>{loading ? "Redirecting..." : "Continue with Google"}</span>
    </button>
  );
}

