"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Dice5, ArrowLeft } from "lucide-react";
import {
  getRandomGoalTopic,
  generateInterviewQuestion,
  type InterviewQuestion,
} from "@/lib/actions/quiz";

type Mode = "targeted" | "surprise" | null;

export default function QuizPage() {
  const [mode, setMode] = useState<Mode>(null);
  const [topicInput, setTopicInput] = useState("");
  const [currentTopic, setCurrentTopic] = useState<string | null>(null);
  const [question, setQuestion] = useState<InterviewQuestion | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 4000);
  }, []);

  const resetToTopics = useCallback(() => {
    setMode(null);
    setQuestion(null);
    setCurrentTopic(null);
    setSelectedIndex(null);
    setShowExplanation(false);
    setTopicInput("");
  }, []);

  const startTargeted = useCallback(async () => {
    const topic = topicInput.trim() || "Software Engineering";
    setMode("targeted");
    setCurrentTopic(topic);
    setQuestion(null);
    setSelectedIndex(null);
    setShowExplanation(false);
    setLoading(true);
    setError(null);

    const { data, error: err } = await generateInterviewQuestion(topic);
    setLoading(false);

    if (err || !data) {
      showToast(err ?? "Failed to generate question");
      return;
    }
    setQuestion(data);
  }, [topicInput, showToast]);

  const startSurprise = useCallback(async () => {
    setMode("surprise");
    setLoading(true);
    setError(null);

    const topic = await getRandomGoalTopic();
    setCurrentTopic(topic);

    const { data, error: err } = await generateInterviewQuestion(topic);
    setLoading(false);

    if (err || !data) {
      showToast(err ?? "Failed to generate question");
      return;
    }
    setQuestion(data);
    setSelectedIndex(null);
    setShowExplanation(false);
  }, [showToast]);

  const handleSelect = useCallback(
    (index: number) => {
      if (selectedIndex !== null || !question) return;
      setSelectedIndex(index);
      setShowExplanation(true);
      if (index === question.correctAnswerIndex) {
        setScore((s) => s + 1);
      }
    },
    [selectedIndex, question]
  );

  const handleNext = useCallback(async () => {
    if (mode === "surprise") {
      const nextTopic = await getRandomGoalTopic(currentTopic ?? undefined);
      setCurrentTopic(nextTopic);
      setLoading(true);
      const { data, error: err } = await generateInterviewQuestion(nextTopic);
      setLoading(false);
      if (err || !data) {
        showToast(err ?? "Failed to generate question");
        return;
      }
      setQuestion(data);
      setSelectedIndex(null);
      setShowExplanation(false);
    } else {
      resetToTopics();
    }
  }, [mode, currentTopic, showToast, resetToTopics]);

  const showQuiz =
    (question || loading) && mode !== null && currentTopic !== null;

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold text-white">
            AI Mock Interviewer
          </h1>
        </header>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 rounded-xl bg-red-500/20 px-4 py-3 text-sm text-red-400"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!showQuiz ? (
            <motion.div
              key="mode-select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-100">
                  Targeted Practice
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Enter a topic to practice (e.g., React Hooks)
                </p>
                <input
                  type="text"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startTargeted()}
                  placeholder="e.g., React Hooks"
                  className="mt-4 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-sky-500"
                />
                <button
                  type="button"
                  onClick={startTargeted}
                  disabled={loading}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Ask Me Anything
                </button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
              >
                <h2 className="text-lg font-semibold text-slate-100">
                  Review My Work
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  Test your knowledge on your completed tasks.
                </p>
                <button
                  type="button"
                  onClick={startSurprise}
                  disabled={loading}
                  className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-600 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Dice5 className="h-4 w-4" />
                  )}
                  Surprise Me 🎲
                </button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={resetToTopics}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
                    aria-label="Back to topics"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <span className="text-sm text-slate-300">
                    Topic: <strong className="text-white">{currentTopic}</strong>
                  </span>
                </div>
                <span className="text-sm font-medium text-sky-400">
                  Score: {score}
                </span>
              </div>

              {loading ? (
                <div className="flex min-h-[200px] items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/80">
                  <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
                </div>
              ) : question ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
                >
                  <p className="text-lg font-medium text-slate-100">
                    {question.question}
                  </p>

                  <ul className="mt-6 space-y-3">
                    {question.options.map((opt, i) => {
                      const selected = selectedIndex === i;
                      const correct = i === question.correctAnswerIndex;
                      const showResult = showExplanation;

                      return (
                        <motion.li
                          key={i}
                          whileHover={
                            selectedIndex === null ? { scale: 1.01 } : {}
                          }
                          whileTap={selectedIndex === null ? { scale: 0.99 } : {}}
                        >
                          <button
                            type="button"
                            onClick={() => handleSelect(i)}
                            disabled={selectedIndex !== null}
                            className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                              selectedIndex === null
                                ? "border-slate-700 bg-slate-800/60 text-slate-100 hover:border-sky-500/50 hover:bg-slate-800"
                                : showResult && correct
                                  ? "border-emerald-500/50 bg-emerald-500/20 text-emerald-200"
                                  : showResult && selected && !correct
                                    ? "border-red-500/50 bg-red-500/20 text-red-200"
                                    : "border-slate-700/50 bg-slate-900/50 text-slate-400"
                            }`}
                          >
                            {String.fromCharCode(65 + i)}. {opt}
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0 }}
                        className="mt-6 rounded-xl bg-slate-800/60 px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          Explanation
                        </p>
                        <p className="mt-2 text-sm text-slate-200">
                          {question.explanation}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {showExplanation && (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="mt-6 w-full rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-sky-600"
                    >
                      {mode === "surprise"
                        ? "Next Challenge"
                        : "Back to Topics"}
                    </button>
                  )}
                </motion.div>
              ) : null}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
