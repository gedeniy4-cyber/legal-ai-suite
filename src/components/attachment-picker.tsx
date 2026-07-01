// Reusable attachment picker: file uploads + URL paste. Files kept as base64 for server transport.
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, X, Link2 } from "lucide-react";

export type UIAttachment = { name: string; mime: string; dataBase64?: string; url?: string; size: number };

async function fileToBase64(file: File): Promise<string> {
  const buf = await file.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export function AttachmentPicker({
  attachments,
  onChange,
  compact = false,
}: {
  attachments: UIAttachment[];
  onChange: (next: UIAttachment[]) => void;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState("");

  const addFiles = async (files: FileList | null) => {
    if (!files) return;
    const next = [...attachments];
    for (const f of Array.from(files)) {
      const b64 = await fileToBase64(f);
      next.push({ name: f.name, mime: f.type || "application/octet-stream", dataBase64: b64, size: f.size });
    }
    onChange(next);
  };

  const addUrl = () => {
    if (!urlInput.trim()) return;
    onChange([...attachments, { name: urlInput, mime: "text/uri-list", url: urlInput.trim(), size: 0 }]);
    setUrlInput("");
  };

  const remove = (i: number) => onChange(attachments.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {!compact && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Paste URL, Google Drive, OneDrive, Dropbox link..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
          />
          <Button type="button" variant="outline" size="sm" onClick={addUrl}>
            <Link2 className="h-4 w-4 mr-1" /> Add link
          </Button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
          <Paperclip className="h-4 w-4 mr-1" /> Attach files
        </Button>
        {attachments.map((a, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-xs">
            <span className="max-w-[180px] truncate">{a.name}</span>
            <button type="button" onClick={() => remove(i)} aria-label="Remove">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
