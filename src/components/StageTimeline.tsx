import { STAGES, type StageKey, type StageStatuses, type ChecklistState } from "@/lib/stages";
import { StageBadge, StageStatusIndicator } from "./StageBadge";
import { ProgressBar } from "./ProgressBar";

interface Props {
  stageStatuses: StageStatuses;
  checklist: ChecklistState;
  notesByStage: Partial<Record<StageKey, string>>;
}

export function ProgressMap({ stageStatuses, checklist, notesByStage }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {STAGES.map((stage) => {
        const status = stageStatuses[stage.key] ?? "미시작";
        const stageChecklist = checklist[stage.key] ?? {};
        const done = stage.checklist.filter((i) => stageChecklist[i.key]).length;
        const total = stage.checklist.length;
        const note = notesByStage[stage.key];

        const borderColor =
          status === "달성"
            ? "border-l-emerald-400"
            : status === "부분 달성"
              ? "border-l-blue-400"
              : status === "진행 중"
                ? "border-l-amber-400"
                : "border-l-muted";

        return (
          <div
            key={stage.key}
            className={`rounded-md border bg-card p-3 border-l-2 ${borderColor}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <StageBadge stage={stage.key} size="xs" />
                <span className="text-sm font-medium text-foreground truncate">
                  {stage.title}
                </span>
              </div>
              <StageStatusIndicator stage={stage.key} status={status} />
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {stage.fullDescription}
            </p>
            {total > 0 && (
              <div className="mt-2.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>체크리스트</span>
                  <span className="tabular-nums">
                    {done}/{total}
                  </span>
                </div>
                <ProgressBar
                  value={total > 0 ? Math.round((done / total) * 100) : 0}
                  className="mt-1"
                />
                <ul className="mt-1.5 space-y-0.5">
                  {stage.checklist.map((item) => {
                    const checked = !!stageChecklist[item.key];
                    return (
                      <li
                        key={item.key}
                        className={`text-xs flex items-center gap-1.5 ${
                          checked
                            ? "text-muted-foreground/50 line-through"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span
                          className={`shrink-0 text-xs ${
                            checked ? "text-emerald-500" : "text-muted-foreground/30"
                          }`}
                        >
                          {checked ? "●" : "○"}
                        </span>
                        {item.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {note && (
              <p className="mt-2 text-xs text-muted-foreground/70 border-t pt-2">{note}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
