import { STAGES, stageCompletion, type ChecklistState, type StageKey } from "@/lib/stages";
import { StageBadge } from "./StageBadge";
import { Check } from "lucide-react";

interface Props {
  currentStage: StageKey;
  completedStages: StageKey[];
  checklist: ChecklistState;
}

export function StageTimeline({ currentStage, completedStages, checklist }: Props) {
  return (
    <ol className="relative space-y-5 border-l pl-6">
      {STAGES.map((stage) => {
        const { done, total } = stageCompletion(checklist, stage.key);
        const isComplete = completedStages.includes(stage.key) || (total > 0 && done === total);
        const isCurrent = stage.key === currentStage;
        return (
          <li key={stage.key} className="relative">
            <span
              className={
                "absolute -left-[31px] mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2 " +
                (isComplete
                  ? "border-primary bg-primary text-primary-foreground"
                  : isCurrent
                    ? "border-primary bg-background"
                    : "border-border bg-background")
              }
            >
              {isComplete ? <Check className="h-3 w-3" /> : null}
            </span>
            <div className="flex items-baseline gap-2">
              <StageBadge stage={stage.key} />
              {isCurrent && (
                <span className="text-xs font-medium text-primary">현재 단계</span>
              )}
              <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                {done} / {total}
              </span>
            </div>
            <h4 className="mt-1.5 text-sm font-semibold text-foreground">{stage.title}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">{stage.description}</p>
          </li>
        );
      })}
    </ol>
  );
}
