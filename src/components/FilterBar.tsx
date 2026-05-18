import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STAGE_KEYS } from "@/lib/stages";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;
  year: string;
  onYearChange: (v: string) => void;
  stage: string;
  onStageChange: (v: string) => void;
  years: string[];
  paperFilter: string;
  onPaperFilterChange: (v: string) => void;
  algoFilter: string;
  onAlgoFilterChange: (v: string) => void;
}

const ALL = "__all__";
const YES = "yes";
const NO = "no";

export function FilterBar({
  search,
  onSearchChange,
  year,
  onYearChange,
  stage,
  onStageChange,
  years,
  paperFilter,
  onPaperFilterChange,
  algoFilter,
  onAlgoFilterChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <div className="relative w-full sm:flex-1 sm:min-w-[160px]">
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="이름 또는 학과 검색"
          className="h-9 text-sm"
        />
      </div>
      <Select value={year || ALL} onValueChange={(v) => onYearChange(v === ALL ? "" : v)}>
        <SelectTrigger className="h-9 flex-1 text-sm sm:flex-none sm:w-28">
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
        <SelectTrigger className="h-9 flex-1 text-sm sm:flex-none sm:w-28">
          <SelectValue placeholder="대표 단계" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>대표 단계 전체</SelectItem>
          {STAGE_KEYS.map((k) => (
            <SelectItem key={k} value={k}>
              Stage {k}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={paperFilter} onValueChange={onPaperFilterChange}>
        <SelectTrigger className="h-9 flex-1 text-sm sm:flex-none sm:w-32">
          <SelectValue placeholder="논문 경험" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>논문 전체</SelectItem>
          <SelectItem value={YES}>논문 경험 있음</SelectItem>
          <SelectItem value={NO}>논문 경험 없음</SelectItem>
        </SelectContent>
      </Select>
      <Select value={algoFilter} onValueChange={onAlgoFilterChange}>
        <SelectTrigger className="h-9 flex-1 text-sm sm:flex-none sm:w-36">
          <SelectValue placeholder="알고리즘 100문제" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>알고리즘 전체</SelectItem>
          <SelectItem value={YES}>100문제 이상</SelectItem>
          <SelectItem value={NO}>100문제 미만</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
