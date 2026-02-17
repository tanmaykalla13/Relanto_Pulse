"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Trash2, File, Loader2 } from "lucide-react";
import type { Attachment } from "@/lib/actions/planner";
import { uploadAttachment, deleteAttachment } from "@/lib/actions/planner";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

interface FileUploadSectionProps {
  dateStr: string;
  attachments: Attachment[];
}

export function FileUploadSection({
  dateStr,
  attachments: initialAttachments,
}: FileUploadSectionProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.set("file", file);
    await uploadAttachment(dateStr, formData);
    setIsUploading(false);
    e.target.value = "";
    router.refresh();
  }

  async function handleDelete(id: string, filePath: string) {
    setDeletingId(id);
    await deleteAttachment(id, filePath);
    setDeletingId(null);
    router.refresh();
  }

  async function getDownloadUrl(filePath: string): Promise<string> {
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.storage
      .from("attachments")
      .createSignedUrl(filePath, 60);
    return data?.signedUrl ?? "#";
  }

  function handleDownload(a: Attachment) {
    getDownloadUrl(a.file_path).then((url) => {
      window.open(url, "_blank");
    });
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">Upload Resources</h3>
      <input
        ref={inputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="flex items-center gap-2 rounded-lg border border-dashed border-slate-600 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 hover:border-sky-500 hover:bg-slate-800 hover:text-sky-300 disabled:opacity-50"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? "Uploading..." : "Choose file"}
      </button>

      {initialAttachments.length > 0 && (
        <ul className="space-y-2">
          {initialAttachments.map((a) => (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
            >
              <File className="h-4 w-4 shrink-0 text-slate-500" />
              <button
                type="button"
                onClick={() => handleDownload(a)}
                className="min-w-0 flex-1 truncate text-left text-sm text-sky-300 hover:underline"
              >
                {a.file_name}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(a.id, a.file_path)}
                disabled={deletingId === a.id}
                className="rounded p-1 text-slate-400 hover:bg-red-500/20 hover:text-red-400 disabled:opacity-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
