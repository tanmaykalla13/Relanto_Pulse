"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

const departments = [
    "Digital Engineering",
    "Data & AI",
    "Cloud Infrastructure",
    "Product Design",
];

const roles = [
    "Digital Trainee Intern",
    "Software Engineering Intern",
    "Data Intern",
];

const techStacks = [
    "Java / Spring Boot",
    "Next.js / React",
    "Python / AI",
    "Data Engineering",
];

export interface ProfileFormProps {
    initialData: {
        email: string;
        full_name: string | null;
        manager: string | null;
        github_url: string | null;
        linkedin_url: string | null;
        department: string | null;
        role: string | null;
        tech_stack: string | null;
    };
    onSubmit: (data: any) => Promise<{ error: string | null; success: boolean }>;
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {pending && (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-sky-200 border-t-sky-600" />
            )}
            {pending ? "Saving..." : "Save Profile"}
        </button>
    );
}

export function ProfileForm({
    initialData,
    onSubmit,
}: ProfileFormProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(initialData);

    async function handleSubmit(formDataObj: FormData) {
        setError(null);
        setSuccess(false);

        const data = {
            full_name: formDataObj.get("full_name") as string,
            manager: formDataObj.get("manager") as string,
            github_url: formDataObj.get("github_url") as string,
            linkedin_url: formDataObj.get("linkedin_url") as string,
            department: formDataObj.get("department") as string,
            role: formDataObj.get("role") as string,
            tech_stack: formDataObj.get("tech_stack") as string,
        };

        setFormData({
            ...formData,
            full_name: data.full_name || null,
            manager: data.manager || null,
            github_url: data.github_url || null,
            linkedin_url: data.linkedin_url || null,
            department: data.department || null,
            role: data.role || null,
            tech_stack: data.tech_stack || null,
        });

        const result = await onSubmit(data);

        if (result.error) {
            setError(result.error);
            setFormData(initialData);
        } else if (result.success) {
            setSuccess(true);
            setIsEditing(false);
            setTimeout(() => setSuccess(false), 5000);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <div className="rounded-lg border border-red-400 dark:border-red-500/30 bg-red-100 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-lg border border-green-400 dark:border-green-500/30 bg-green-100 dark:bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
                    Profile updated successfully!
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        Email
                    </label>
                    <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 px-3 py-2 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                    />
                </div>

                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        Full Name
                    </label>
                    <input
                        id="full_name"
                        name="full_name"
                        type="text"
                        defaultValue={formData.full_name ?? ""}
                        disabled={!isEditing}
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                            ? "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500/20"
                            : "border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            }`}
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="manager" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        Reporting Manager
                    </label>
                    <input
                        id="manager"
                        name="manager"
                        type="text"
                        defaultValue={formData.manager ?? ""}
                        disabled={!isEditing}
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                            ? "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500/20"
                            : "border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            }`}
                        placeholder="Manager Name"
                    />
                </div>

                <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        GitHub Profile URL
                    </label>
                    <input
                        id="github_url"
                        name="github_url"
                        type="url"
                        defaultValue={formData.github_url ?? ""}
                        disabled={!isEditing}
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                            ? "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500/20"
                            : "border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            }`}
                        placeholder="https://github.com/username"
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        LinkedIn Profile URL
                    </label>
                    <input
                        id="linkedin_url"
                        name="linkedin_url"
                        type="url"
                        defaultValue={formData.linkedin_url ?? ""}
                        disabled={!isEditing}
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                            ? "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500/20"
                            : "border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            }`}
                        placeholder="https://linkedin.com/in/username"
                    />
                </div>

                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        Department
                    </label>
                    <select
                        id="department"
                        name="department"
                        defaultValue={formData.department ?? ""}
                        disabled={!isEditing}
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                            ? "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500/20"
                            : "border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        <option value="">Select a department</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>
                                {dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        defaultValue={formData.role ?? ""}
                        disabled={!isEditing}
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                            ? "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500/20"
                            : "border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        <option value="">Select a role</option>
                        {roles.map((role) => (
                            <option key={role} value={role}>
                                {role}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="tech_stack" className="block text-sm font-medium text-slate-900 dark:text-slate-200">
                        Tech Stack
                    </label>
                    <select
                        id="tech_stack"
                        name="tech_stack"
                        defaultValue={formData.tech_stack ?? ""}
                        disabled={!isEditing}
                        className={`mt-2 block w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 ${isEditing
                            ? "border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-sky-500 dark:focus:border-sky-500 focus:ring-sky-500/20"
                            : "border-gray-300 dark:border-slate-700 bg-gray-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                            }`}
                    >
                        <option value="">Select a tech stack</option>
                        {techStacks.map((tech) => (
                            <option key={tech} value={tech}>
                                {tech}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex gap-3 pt-6">
                {!isEditing ? (
                    <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-slate-700 dark:bg-slate-700 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-800 dark:hover:bg-slate-600"
                    >
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <SubmitButton />
                        <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-slate-600 px-6 py-3 font-medium text-slate-700 dark:text-slate-200 transition-colors hover:bg-gray-100 dark:hover:bg-slate-800"
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </form>
    );
}
