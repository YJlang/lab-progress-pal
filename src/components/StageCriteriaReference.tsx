import { useState } from "react";
import { STAGES, STAGE_KEYS, type StageKey } from "@/lib/stages";
import { ChevronDown } from "lucide-react";

export function StageCriteriaReference() {
  const [expanded, setExpanded] = useState<Set<StageKey>>(new Set());

  function toggle(k: StageKey) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  function expandAll() {
    setExpanded((prev) => {
      if (prev.size === STAGE_KEYS.length) return new Set();
      return new Set(STAGE_KEYS);
    });
  }

  const allExpanded = expanded.size === STAGE_KEYS.length;

  return (
    <section className="rounded-lg border bg-card">
      <div className="flex items-center justify-between border-b px-4 py-2.5">
        <h2 className="text-base font-semibold text-foreground">Progress 기준</h2>
        <button
          type="button"
          onClick={expandAll}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          {allExpanded ? "모두 접기" : "모두 펼치기"}
        </button>
      </div>
      <div className="divide-y">
        {STAGES.map((stage) => {
          const open = expanded.has(stage.key);
          return (
            <div key={stage.key}>
              <button
                type="button"
                className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left hover:bg-muted/30"
                onClick={() => toggle(stage.key)}
              >
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-150 ${
                    open ? "rotate-180" : ""
                  }`}
                />
                <span className="text-sm font-mono font-medium text-muted-foreground tabular-nums shrink-0">
                  S{stage.key}
                </span>
                <span className="text-sm font-medium text-foreground">{stage.title}</span>
                <span className="text-sm text-muted-foreground truncate hidden sm:inline">
                  — {stage.shortDescription}
                </span>
              </button>
              {open && (
                <div className="px-4 pb-3 pl-11">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {stage.fullDescription}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground/70">
                    기준: {stage.criteria}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t px-4 py-2">
        <p className="text-xs text-muted-foreground/60">
          단계는 순서와 무관하게 독립적으로 기록됩니다.
        </p>
      </div>
    </section>
  );
}
