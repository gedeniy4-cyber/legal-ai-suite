// Reusable actions row for any AI output.
import { Button } from "@/components/ui/button";
import { Copy, Download, RefreshCcw, Printer, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

export function OutputActions({
  text,
  onRegenerate,
  onImprove,
  onExpand,
  filename = "chambers-os-output",
}: {
  text: string;
  onRegenerate?: () => void;
  onImprove?: () => void;
  onExpand?: () => void;
  filename?: string;
}) {
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  const downloadTxt = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const lines = doc.splitTextToSize(text, 500);
    doc.setFontSize(11);
    doc.text(lines, 40, 60);
    doc.save(`${filename}.pdf`);
  };
  const print = () => window.print();

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
      <Button size="sm" variant="outline" onClick={copy}><Copy className="h-4 w-4 mr-1" /> Copy</Button>
      <Button size="sm" variant="outline" onClick={downloadTxt}><Download className="h-4 w-4 mr-1" /> TXT</Button>
      <Button size="sm" variant="outline" onClick={downloadPdf}><FileText className="h-4 w-4 mr-1" /> PDF</Button>
      <Button size="sm" variant="outline" onClick={print}><Printer className="h-4 w-4 mr-1" /> Print</Button>
      {onRegenerate && <Button size="sm" variant="outline" onClick={onRegenerate}><RefreshCcw className="h-4 w-4 mr-1" /> Regenerate</Button>}
      {onImprove && <Button size="sm" variant="outline" onClick={onImprove}>Improve</Button>}
      {onExpand && <Button size="sm" variant="outline" onClick={onExpand}>Expand</Button>}
    </div>
  );
}
