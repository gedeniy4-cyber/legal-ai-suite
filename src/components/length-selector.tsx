import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function LengthSelector({
  length,
  onLength,
  customWords,
  onCustomWords,
}: {
  length: string;
  onLength: (v: string) => void;
  customWords: number | undefined;
  onCustomWords: (n: number | undefined) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={length} onValueChange={onLength}>
        <SelectTrigger className="w-40 h-9"><SelectValue placeholder="Length" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="short">Short (~200w)</SelectItem>
          <SelectItem value="medium">Medium (~500w)</SelectItem>
          <SelectItem value="long">Long (~1200w)</SelectItem>
          <SelectItem value="essay">Essay (~3000w)</SelectItem>
          <SelectItem value="custom">Custom word count</SelectItem>
        </SelectContent>
      </Select>
      {length === "custom" && (
        <Input
          type="number"
          className="w-32 h-9"
          placeholder="Words"
          min={50}
          value={customWords ?? ""}
          onChange={(e) => onCustomWords(e.target.value ? Number(e.target.value) : undefined)}
        />
      )}
    </div>
  );
}
