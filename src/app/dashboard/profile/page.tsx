import { redirect } from "next/navigation";
import { getUserProfile, updateUserProfile } from "@/lib/actions/profile";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
    const profile = await getUserProfile();

    if (!profile) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen bg-slate-950 px-6 py-10">
            <div className="mx-auto max-w-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Profile</h1>
                    <p className="mt-2 text-slate-400">
                        Manage your internship profile information
                    </p>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8">
                    <ProfileForm initialData={profile} onSubmit={updateUserProfile} />
                </div>
            </div>
        </main>
    );
}
