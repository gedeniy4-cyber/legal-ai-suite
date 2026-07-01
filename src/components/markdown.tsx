// Renders markdown-lite output: headings, bold, italics, lists, code, paragraphs. No external deps.
import { useMemo } from "react";

function inline(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-muted text-xs">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="underline text-[--gold]" target="_blank" rel="noreferrer">$1</a>');
}

export function Markdown({ text }: { text: string }) {
  const html = useMemo(() => {
    const lines = text.split("\n");
    const out: string[] = [];
    let inList: "ul" | "ol" | null = null;
    const closeList = () => { if (inList) { out.push(`</${inList}>`); inList = null; } };
    for (const raw of lines) {
      const line = raw.trimEnd();
      if (!line.trim()) { closeList(); out.push(""); continue; }
      const h = line.match(/^(#{1,4})\s+(.*)$/);
      if (h) {
        closeList();
        const lvl = h[1].length;
        const size = ["text-2xl", "text-xl", "text-lg", "text-base"][lvl - 1];
        out.push(`<h${lvl} class="${size} font-bold mt-6 mb-2">${inline(h[2])}</h${lvl}>`);
        continue;
      }
      const ol = line.match(/^\s*(\d+)\.\s+(.*)$/);
      const ul = line.match(/^\s*[-*]\s+(.*)$/);
      if (ol) {
        if (inList !== "ol") { closeList(); out.push('<ol class="list-decimal ml-6 space-y-1">'); inList = "ol"; }
        out.push(`<li>${inline(ol[2])}</li>`);
        continue;
      }
      if (ul) {
        if (inList !== "ul") { closeList(); out.push('<ul class="list-disc ml-6 space-y-1">'); inList = "ul"; }
        out.push(`<li>${inline(ul[1])}</li>`);
        continue;
      }
      closeList();
      out.push(`<p class="my-2 leading-relaxed">${inline(line)}</p>`);
    }
    closeList();
    return out.join("\n");
  }, [text]);
  return <div className="prose-invert text-sm" dangerouslySetInnerHTML={{ __html: html }} />;
}
