"use server";

import { z } from "zod";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const DEFAULT_TOPICS = [
  "Software Engineering Professionalism",
  "Agile Methodology",
  "System Design Fundamentals",
];

const InterviewResponseSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswerIndex: z.number().min(0).max(3),
  explanation: z.string(),
});

export type InterviewQuestion = z.infer<typeof InterviewResponseSchema>;

export async function getRandomGoalTopic(
  excludeTopic?: string
): Promise<string> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return DEFAULT_TOPICS[0];

  let query = supabase
    .from("goals")
    .select("title")
    .eq("user_id", user.id)
    .eq("status", "completed");

  if (excludeTopic?.trim()) {
    query = query.neq("title", excludeTopic.trim());
  }

  const { data, error } = await query.limit(50);

  if (error || !data?.length) {
    return DEFAULT_TOPICS[Math.floor(Math.random() * DEFAULT_TOPICS.length)];
  }

  const titles: string[] = data
    .map((r: { title?: string }) => (r.title ?? "") as string)
    .filter((t: string): t is string => Boolean(t));

  const unique = Array.from(new Set(titles));
  const filtered = excludeTopic?.trim()
    ? unique.filter((t: string) => t !== excludeTopic.trim())
    : unique;

  if (filtered.length === 0) {
    return DEFAULT_TOPICS[Math.floor(Math.random() * DEFAULT_TOPICS.length)];
  }

  const shuffled: string[] = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled[0] ?? DEFAULT_TOPICS[0];
}

export async function generateInterviewQuestion(
  topic: string
): Promise<{ data: InterviewQuestion | null; error: string | null }> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey?.trim()) {
    return {
      data: null,
      error:
        "Gemini API key not configured. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local",
    };
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using 'gemini-1.5-flash' as it is the current standard stable model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a Senior Technical Interviewer. Generate exactly one multiple-choice question as JSON. Output only valid JSON, no markdown or fences. Use: {"question":"...","options":["A","B","C","D"],"correctAnswerIndex":0,"explanation":"..."} where correctAnswerIndex is 0-3.`,
    });

    const prompt = `Context: The candidate (intern) has worked on: "${topic}".
Generate 1 challenging scenario-based multiple-choice question.
- If technical: ask about architecture, edge cases, or best practices.
- If non-technical: ask about soft skills, conflict resolution, or teamwork.
Output JSON only.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text()?.trim() ?? "";

    // Clean up any potential markdown code blocks from the AI response
    const raw = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(raw);

    const validation = InterviewResponseSchema.safeParse(parsed);
    if (!validation.success) {
      console.error("Validation error:", validation.error);
      return { data: null, error: "Invalid response format from AI" };
    }

    return { data: validation.data, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return { data: null, error: `Gemini error: ${msg}` };
  }
}