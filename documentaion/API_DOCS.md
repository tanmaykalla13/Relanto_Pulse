# Relanto Pulse - API Reference

**⚠️ Important: This application does NOT expose standard REST API endpoints (like `/api/goals`, `/api/users`). All backend operations are handled server-side via Next.js Server Actions, which are compiled away at build-time and cannot be called from external services. This is a self-contained application with no REST endpoints or external API access.**

---

## Overview

Relanto Pulse is an intern training platform built with Next.js Server Actions and Supabase. **This is NOT a REST API**—all communication occurs server-side via Next.js Server Actions (not publicly accessible). The application is self-contained with no external API integrations.

---

## Server Actions

### Auth
- **`getLoginRedirectPath()`** — Determines redirect path (`/admin` or `/dashboard`) based on user role. Requires authentication.

### Dashboard
- **`getDashboardStats()`** — Fetches progress stats, profile info, and overdue dates. Requires authentication (Intern).
- **`getTodayGoals()`** — Retrieves goals for today. Requires authentication (Intern).
- **`toggleGoalStatus()`** — Cycles goal status through states. Requires authentication (Intern).

### Profile
- **`getUserProfile()`** — Retrieves complete user profile. Requires authentication (Intern).
- **`updateUserProfile()`** — Updates profile fields and revalidates cache. Requires authentication (Intern).

### Planner
- **`getPlannerData(dateStr)`** — Retrieves goals, journals, and attachments for a date. Requires authentication (Intern).
- **`saveJournal(dateStr, content)`** — Creates or updates a journal entry. Requires authentication (Intern).
- **`createGoal(dateStr, title)`** — Creates a new goal. Requires authentication (Intern).
- **`updateGoal(goalId, updates)`** — Updates goal title/status. Requires authentication (Intern).
- **`toggleGoalStatus(goalId, currentStatus)`** — Cycles goal status in planner. Requires authentication (Intern).
- **`deleteGoal(goalId)`** — Permanently deletes a goal. Requires authentication (Intern).
- **`uploadAttachment(dateStr, formData)`** — Uploads file to Supabase Storage. Requires authentication (Intern).
- **`deleteAttachment(id, filePath)`** — Removes attachment and deletes file from storage. Requires authentication (Intern).

### Roadmap
- **`getRoadmapData()`** — Retrieves complete roadmap with weekly and daily breakdowns. Requires authentication (Intern).
- **`updateWeekTitle(weekId, newTitle)`** — Updates a week's title in roadmap. Requires authentication (Intern).

### Quiz
- **`getRandomGoalTopic(excludeTopic?)`** — Returns random completed goal or default topic for quiz. Requires authentication (Intern).
- **`generateInterviewQuestion(topic)`** — Generates multiple-choice question via Google Gemini API. Requires authentication (Intern).

### Admin
- **`getInternsWithGoalStats()`** — Returns all interns with goal statistics. Requires authentication (Admin only).

---

## Route Handlers

- **`GET /auth/callback`** — Handles OAuth callback, exchanges auth code for session, redirects to `/admin` or `/dashboard`. Public endpoint.

---

## Google Gemini Integration

The Quiz feature uses Google Gemini 2.5 Flash API to generate interview questions. Requires `GOOGLE_GENERATIVE_AI_API_KEY` environment variable. Outputs validated JSON with question, 4 options, correct answer index, and explanation. Targets junior to mid-level developers.

---

## Authentication

All server actions require a Supabase session. Unauthenticated requests redirect to login.

- **Intern:** Default access to dashboard, planner, quiz, roadmap.
- **Admin:** Configured via `ADMIN_EMAILS` environment variable; access to admin panel.

---

## Error Handling

Server actions return: `{ error: string | null, success?: boolean }`. Errors include standard messages for unauthorized access, database constraints, file operation failures, and API errors.

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
ADMIN_EMAILS=email1@company.com,email2@company.com
```

---

**Last Updated:** February 2026 | **Framework:** Next.js 16.1.6 | **Backend:** Supabase PostgreSQL
