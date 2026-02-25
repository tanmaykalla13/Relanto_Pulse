export function isAdminEmail(email: string): boolean {
    const adminEmailsStr = process.env.ADMIN_EMAILS || "";
    if (!adminEmailsStr.trim()) {
        return false;
    }
    const adminEmails = adminEmailsStr
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0);
    return adminEmails.includes(email.toLowerCase());
}

export function getAdminRedirectPath(email: string): string {
    return isAdminEmail(email) ? "/admin" : "/dashboard";
}
