// Server-only attachment text extraction.
export async function extractAttachmentText(a: {
  name: string;
  mime: string;
  dataBase64?: string;
  url?: string;
}): Promise<string> {
  try {
    if (a.url) {
      const res = await fetch(a.url);
      if (!res.ok) return `[Could not fetch ${a.url}: ${res.status}]`;
      const ct = res.headers.get("content-type") || "";
      if (ct.includes("text/") || ct.includes("json") || ct.includes("xml")) {
        return `\n--- ${a.url} ---\n${(await res.text()).slice(0, 30000)}`;
      }
      return `[Non-text URL fetched: ${a.url} (${ct})]`;
    }
    if (!a.dataBase64) return "";
    const buf = Buffer.from(a.dataBase64, "base64");
    const mime = a.mime.toLowerCase();
    if (mime.includes("text/") || mime.includes("markdown") || mime.includes("json") || a.name.match(/\.(txt|md|csv|log)$/i)) {
      return `\n--- ${a.name} ---\n${buf.toString("utf-8").slice(0, 60000)}`;
    }
    if (mime.includes("wordprocessingml") || a.name.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const { value } = await mammoth.extractRawText({ buffer: buf });
      return `\n--- ${a.name} ---\n${value.slice(0, 60000)}`;
    }
    if (mime.includes("pdf") || a.name.endsWith(".pdf")) {
      // PDF text extraction is heavy; return a marker so the model knows it's attached.
      return `\n--- ${a.name} (PDF, ${(buf.length / 1024).toFixed(0)}KB attached) ---\n[PDF content submitted directly to the model as a file part.]`;
    }
    return `[Attachment ${a.name} (${mime}) received, ${buf.length} bytes]`;
  } catch (e) {
    return `[Failed to read ${a.name}: ${(e as Error).message}]`;
  }
}
