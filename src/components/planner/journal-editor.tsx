"use client";

import { useState, useCallback, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveJournal } from "@/lib/actions/planner";

const DELIMITER = "\n";

function contentToLines(content: string): string[] {
  if (content.trim() === "") return [""];
  return content.split(/\r?\n/);
}

function linesToContent(lines: string[]): string {
  return lines.join(DELIMITER);
}

interface JournalEditorProps {
  dateStr: string;
  initialContent: string;
}

export function JournalEditor({ dateStr, initialContent }: JournalEditorProps) {
  const router = useRouter();
  const [lines, setLines] = useState<string[]>(() =>
    contentToLines(initialContent)
  );
  const [isSaving, setIsSaving] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await saveJournal(dateStr, linesToContent(lines));
    setIsSaving(false);
    router.refresh();
  }, [dateStr, lines, router]);

  const setLine = useCallback((index: number, value: string) => {
    setLines((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }, []);

  const insertLineAfter = useCallback((index: number) => {
    setLines((prev) => {
      const next = [...prev];
      next.splice(index + 1, 0, "");
      return next;
    });
    setTimeout(() => {
      inputRefs.current[index + 1]?.focus();
    }, 0);
  }, []);

  const removeLine = useCallback((index: number) => {
    if (lines.length <= 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
    setTimeout(() => {
      const prevIndex = Math.max(0, index - 1);
      inputRefs.current[prevIndex]?.focus();
    }, 0);
  }, [lines.length]);

  const handleKeyDown = useCallback(
    (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        insertLineAfter(index);
        return;
      }
      if (e.key === "Backspace" && lines[index] === "") {
        e.preventDefault();
        removeLine(index);
      }
    },
    [insertLineAfter, removeLine, lines]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Journal</h3>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1 rounded-lg bg-gray-200 dark:bg-slate-700 px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-gray-300 dark:hover:bg-slate-600 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      <div
        className="min-h-[8rem] rounded-xl border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3"
        onClick={(e) => {
          const target = e.target as HTMLElement;
          if (target.tagName !== "INPUT" && lines.length === 1 && lines[0] === "") {
            inputRefs.current[0]?.focus();
          }
        }}
      >
        <ul className="list-none space-y-1">
          {lines.map((line, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-500 select-none" aria-hidden>
                •
              </span>
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                value={line}
                onChange={(e) => setLine(index, e.target.value)}
                onKeyDown={handleKeyDown(index)}
                onBlur={handleSave}
                placeholder={index === 0 ? "Write a reflection..." : ""}
                className="flex-1 min-w-0 bg-transparent py-0.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-500 outline-none"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
