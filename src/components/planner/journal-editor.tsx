"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveJournal } from "@/lib/actions/planner";

interface JournalEditorProps {
  dateStr: string;
  initialContent: string;
}

export function JournalEditor({ dateStr, initialContent }: JournalEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    await saveJournal(dateStr, content);
    setIsSaving(false);
    router.refresh();
  }, [dateStr, content, router]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Journal</h3>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1 rounded-lg bg-slate-700 px-2 py-1 text-xs font-medium text-slate-200 hover:bg-slate-600 disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSave}
        placeholder="Write your reflections for today..."
        rows={8}
        className="w-full resize-y rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-sky-500"
      />
    </div>
  );
}
