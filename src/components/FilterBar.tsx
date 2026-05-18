import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STAGE_KEYS } from "@/lib/stages";
import { Search } from "lucide-react";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  year: string;
  onYearChange: (v: string) => void;
  stage: string;
  onStageChange: (v: string) => void;
  years: string[];
}

const ALL = "__all__";

export function FilterBar({
  search,
  onSearchChange,
  year,
  onYearChange,
  stage,
  onStageChange,
  years,
}: Props) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="이름 또는 학과 검색"
          className="pl-9"
        />
      </div>
      <Select value={year || ALL} onValueChange={(v) => onYearChange(v === ALL ? "" : v)}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="학년도" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>학년도 전체</SelectItem>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={stage || ALL} onValueChange={(v) => onStageChange(v === ALL ? "" : v)}>
        <SelectTrigger className="w-full sm:w-36">
          <SelectValue placeholder="현재 단계" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>단계 전체</SelectItem>
          {STAGE_KEYS.map((k) => (
            <SelectItem key={k} value={k}>
              Stage {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
