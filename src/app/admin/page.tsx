import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/utils/admin";
import { getInternsWithGoalStats } from "@/lib/actions/admin";
import { SignOutButton } from "@/components/sign-out-button";

export default async function AdminPage() {
    const supabase = await createSupabaseServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
        redirect("/login");
    }

    if (!isAdminEmail(user.email)) {
        redirect("/dashboard");
    }

    const interns = await getInternsWithGoalStats();

    return (
        <main className="min-h-screen px-6 py-10 bg-slate-950">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">
                            Admin Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Manage and monitor intern progress
                        </p>
                    </div>
                    <SignOutButton />
                </header>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 overflow-x-auto">
                    <h2 className="mb-4 text-sm font-semibold text-slate-200">
                        Intern Performance Overview
                    </h2>
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="px-4 py-3 font-semibold text-slate-300">
                                    Name
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-300">
                                    Email
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-300">
                                    Total Goals Set
                                </th>
                                <th className="px-4 py-3 font-semibold text-slate-300">
                                    Total Goals Completed
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {interns.map((intern) => (
                                <tr
                                    key={intern.id}
                                    className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors"
                                >
                                    <td className="px-4 py-3 text-slate-100">
                                        {intern.full_name || "Unknown"}
                                    </td>
                                    <td className="px-4 py-3 text-slate-300">{intern.email}</td>
                                    <td className="px-4 py-3 text-slate-300">
                                        {intern.totalGoalsSet}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                            {intern.totalGoalsCompleted}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {interns.length === 0 && (
                        <div className="py-8 text-center text-slate-400">
                            No interns found.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
