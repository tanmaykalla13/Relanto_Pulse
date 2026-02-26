
RelantoPulse 🚀
RelantoPulse is a professional Micro-SaaS platform built to track and manage digital trainees during intensive training cycles. It bridges the gap between intern self-management and administrative oversight.


🌟 Key Features
For Interns
Goal Setting & Milestone Tracking: Ability to set specific training goals to stay on track.

Document & File Uploads: Upload relevant files, assignments, or certifications directly to specific goals or profile sections.

Personalized Dashboard: A real-time view of training progress and upcoming tasks.

Learning Roadmap & AI Quiz: Interactive visual guides and AI-powered assessments to test knowledge.

Role-Based Theme Toggle: A polished Dark/Light mode switch located in the sidebar.

For Admins
Centralized Intern Roster: A high-level, searchable view of every intern in the system.

Profile Oversight: Access to intern details, tech stacks, and department assignments to ensure data accuracy.

Access Control: Secured administrative environment restricted from intern-only features.


🛠️ Tech Stack
Layer,Technology
Frontend,"Next.js 15+ (App Router), TypeScript"
Styling,"Tailwind CSS v4, Lucide React (Icons)"
Database/Auth,Supabase (Postgres & Auth)
AI Integration,Gemini AI API (For Quiz/GenAI features)
Deployment,Vercel


🔑 Setup & Environment Variables
To run this project, you must create a .env.local file in the root directory and include the following keys:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key

📡 How to get your Supabase Keys
Log in to the Supabase Dashboard.

Select your project (or create a new one).

On the left sidebar, click the Settings (cog icon).

Navigate to API.

Copy the Project URL and the anon public API Key.

🤖 How to get your Gemini API Key
Go to the Google AI Studio.

Sign in with your Google account.

Click on "Get API key" in the top left sidebar.

Click "Create API key in new project".

Copy your key and paste it as GEMINI_API_KEY in your .env.local.


🚀 Installation & Deployment
Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Vercel Deployment:
When deploying to Vercel, ensure you add all three environment variables mentioned above in the Project Settings > Environment Variables section of the Vercel dashboard.


📁 Project Structure
src/app: Routes, layouts, and page views.

src/components: UI components (Sidebar, ThemeToggle, FileUploaders).

src/lib: Supabase and Gemini client configurations.