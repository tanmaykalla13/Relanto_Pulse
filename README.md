
# RelantoPulse 🚀

**RelantoPulse** is a professional Micro-SaaS platform designed to track and manage the progress of interns during intensive training cycles at Relanto. It streamlines the transition from onboarding to project-readiness by bridging the gap between intern self-management and administrative oversight.

## 🌟 Key Features

### 🎓 For Interns

* **Goal Setting & Milestones:** Define and track specific training objectives to ensure timely completion of the 5 month internship.
* **Evidence & File Uploads:** Securely upload assignments, certifications, and project documents directly to your profile.
* **AI-Powered Assessments:** Test your knowledge using the integrated AI Quiz module powered by Gemini.
* **Learning Roadmap & Planner:** Visualize your journey and schedule daily tasks to stay organized.
* **Role-Based Theme Toggle:** A polished Dark/Light mode switch located in the sidebar for a personalized workspace.

### 🛡️ For Admins

* **Centralized Intern Roster:** A high-level, searchable view of every trainee in the system to monitor participation.
* **Profile Oversight:** Direct access to intern details, tech stacks, and department assignments to ensure data accuracy across the cohort.
* **Access Control:** A secured administrative environment that hides intern-specific tools to maintain a focused "Command Center" view.

---

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | **Next.js 15+** (App Router), **TypeScript** |
| **Styling** | **Tailwind CSS v4**, **Lucide React** |
| **Database & Auth** | **Supabase** (PostgreSQL) |
| **AI Integration** | **Google Gemini AI** |
| **State & Theme** | **Next-Themes** |
| **Deployment** | **Vercel** |

---

## 🔑 Environment Setup

To run RelantoPulse locally, create a `.env.local` file in the root directory and add the following keys:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key

```

### 🛰️ How to get your API Keys

#### 1. Supabase (Database & Auth)

1. Log in to the **[Supabase Dashboard](https://www.google.com/search?q=https://supabase.com/dashboard)**.
2. Select your project and go to **Project Settings** > **API**.
3. Copy the **Project URL** and the **`anon` public API Key**.

#### 2. Gemini AI (Assessments)

1. Visit **[Google AI Studio](https://aistudio.google.com/)**.
2. Click on **"Get API key"** in the sidebar.
3. Click **"Create API key in new project"** and copy the resulting string.

---

## 🚀 Installation & Development

1. **Clone the Repository:**
```bash
git clone https://github.com/your-username/relantopulse2.git
cd relantopulse2

```


2. **Install Dependencies:**
```bash
npm install

```


3. **Run Development Server:**
```bash
npm run dev

```


4. **Vercel Deployment:**
When deploying, ensure all environment variables are added to the **Vercel Dashboard** under **Project Settings > Environment Variables**.

---

## 📁 Project Structure

relantopulse2/
├── .github/
│   └── workflows/
├── public/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── quiz/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── dashboard/
│   │   ├── planner/
│   │   ├── profile/
│   │   ├── roadmap/
│   │   ├── ui/
│   │   ├── GoogleSignInButton.tsx
│   │   ├── sign-out-button.tsx
│   │   ├── theme-provider.tsx
│   │   └── theme-toggle.tsx
│   ├── lib/
│   │   ├── actions/
│   │   ├── supabase/
│   │   ├── utils/
│   │   └── utils.ts
│   ├── types/
│   │   └── supabase-ssr.d.ts
│   └── middleware.ts
├── supabase/
│   └── migrations/
├── .dockerignore
├── .env.local
├── .gitignore
├── build_guide.md
├── Dockerfile
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
---

## 🛡️ License

Distributed under the MIT License.

