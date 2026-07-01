import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Markdown } from "@/components/markdown";
import { AttachmentPicker, type UIAttachment } from "@/components/attachment-picker";
import { ResponsibleAiNotice } from "@/components/responsible-ai-notice";
import { LengthSelector } from "@/components/length-selector";
import { Send, Sparkles, Trash2, Copy, Plus } from "lucide-react";
import { toast } from "sonner";
import { buildLengthDirective } from "@/lib/ai/prompts";

export const Route = createFileRoute("/app/chat")({ component: Chat });

const SUGGESTIONS = [
  "Explain the elements of unjustified enrichment under SA law.",
  "Draft a demand letter for outstanding invoices.",
  "What are the requirements for a valid arbitration clause?",
  "Summarize the differences between condictio indebiti and condictio sine causa.",
];

function Chat() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status, setMessages } = useChat({ transport, onError: (e) => toast.error(e.message) });
  const [input, setInput] = useState("");
  const [attachments, setAttachments] = useState<UIAttachment[]>([]);
  const [length, setLength] = useState("medium");
  const [customWords, setCustomWords] = useState<number | undefined>();
  const endRef = useRef<HTMLDivElement>(null);
  const loading = status === "streaming" || status === "submitted";

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const submit = async (text?: string) => {
    const raw = (text ?? input).trim();
    if (!raw) return;
    let full = raw + buildLengthDirective(length, customWords);
    if (attachments.length) {
      full += "\n\n[Attachments: " + attachments.map((a) => a.name).join(", ") + "]";
    }
    setInput("");
    await sendMessage({ text: full });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-9rem)] animate-fade-up">
      <header className="mb-4">
        <h1 className="text-2xl font-bold">AI Legal Chat</h1>
        <p className="text-sm text-muted-foreground">Ask anything. Attach files. Chambers OS is context-aware.</p>
      </header>

      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 overflow-y-auto pt-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <Sparkles className="h-8 w-8 mx-auto text-[--gold]" />
              <div className="text-muted-foreground">Start your first conversation.</div>
              <div className="grid sm:grid-cols-2 gap-2 max-w-2xl mx-auto">
                {SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => submit(s)} className="text-left text-sm p-3 rounded-lg border border-border hover:border-[--gold]/60 hover:bg-accent/30 transition-colors">{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m) => {
            const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
            return (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === "user" ? "bg-[--gold] text-[--navy-deep]" : "bg-muted"}`}>
                  {m.role === "assistant" ? <Markdown text={text} /> : <div className="text-sm whitespace-pre-wrap">{text}</div>}
                  {m.role === "assistant" && text && (
                    <button className="mt-2 text-xs opacity-60 hover:opacity-100 inline-flex items-center gap-1" onClick={() => { navigator.clipboard.writeText(text); toast.success("Copied"); }}>
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {loading && <div className="text-xs text-muted-foreground animate-pulse">Chambers OS is thinking…</div>}
          <div ref={endRef} />
        </CardContent>
        <div className="border-t border-border p-3 space-y-2">
          {attachments.length > 0 && <AttachmentPicker attachments={attachments} onChange={setAttachments} compact />}
          <div className="flex items-end gap-2">
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer p-2 rounded-lg border border-border hover:border-[--gold]/60 transition" title="Attach">
                <Plus className="h-4 w-4" />
                <input type="file" multiple hidden onChange={async (e) => {
                  const files = e.target.files; if (!files) return;
                  const next = [...attachments];
                  for (const f of Array.from(files)) {
                    const buf = await f.arrayBuffer();
                    let bin = ""; const b = new Uint8Array(buf);
                    for (let i = 0; i < b.byteLength; i++) bin += String.fromCharCode(b[i]);
                    next.push({ name: f.name, mime: f.type || "application/octet-stream", dataBase64: btoa(bin), size: f.size });
                  }
                  setAttachments(next);
                }} />
              </label>
            </div>
            <Textarea
              rows={2}
              placeholder="Message Chambers OS… (unlimited length)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              className="flex-1 resize-none"
            />
            <Button onClick={() => submit()} disabled={loading} className="bg-[--gold] text-[--navy-deep] hover:bg-[--gold]/90">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <LengthSelector length={length} onLength={setLength} customWords={customWords} onCustomWords={setCustomWords} />
            {messages.length > 0 && (
              <Button size="sm" variant="ghost" onClick={() => setMessages([])}><Trash2 className="h-4 w-4 mr-1" /> Clear</Button>
            )}
          </div>
        </div>
      </Card>
      <div className="mt-3"><ResponsibleAiNotice /></div>
    </div>
  );
}
