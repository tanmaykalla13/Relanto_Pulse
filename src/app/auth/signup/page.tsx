"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setIsLoading(false);
      const msg = signUpError.message.toLowerCase();
      if (msg.includes("already") && (msg.includes("registered") || msg.includes("exists"))) {
        setError("Account already created. Please log in.");
      } else {
        setError(signUpError.message);
      }
      return;
    }

    // Try to sign the user in immediately after successful signup
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      // Fallback: send them to login with their new credentials
      router.push("/login");
      router.refresh();
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-black/40">
        <header className="mb-8 space-y-2 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] text-sky-400 uppercase">
            Relanto Pulse
          </p>
          <h1 className="text-2xl font-semibold">Create your trainee account</h1>
          <p className="text-xs text-slate-300">
            Sign up to start tracking your progress and weekly pulses.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-medium text-slate-200"
            >
              Email
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-500">
              <Mail className="h-4 w-4 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-50 outline-none placeholder:text-slate-500"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-slate-200"
            >
              Password
            </label>
            <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900 px-3 py-2 focus-within:border-sky-400 focus-within:ring-1 focus-within:ring-sky-500">
              <Lock className="h-4 w-4 text-slate-400" />
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-50 outline-none placeholder:text-slate-500"
                placeholder="Create a strong password"
              />
            </div>
          </div>

          {error ? (
            <p className="text-xs text-red-400" role="status">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-500/30 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <GoogleSignInButton />

        <p className="mt-6 text-center text-xs text-slate-400">
          Already have an account?{" "}
          <a href="/login" className="text-sky-300 underline-offset-2 hover:underline">
            Go to login
          </a>
        </p>
      </div>
    </main>
  );
}

