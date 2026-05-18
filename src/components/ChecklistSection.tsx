import { STAGES, type ChecklistState, type StageKey } from "@/lib/stages";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  state: ChecklistState;
  onChange?: (next: ChecklistState) => void;
  readOnly?: boolean;
  /** Optionally restrict to a single stage. */
  stageKey?: StageKey;
}

export function ChecklistSection({ state, onChange, readOnly, stageKey }: Props) {
  const stages = stageKey ? STAGES.filter((s) => s.key === stageKey) : STAGES;

  const toggle = (stage: StageKey, item: string, checked: boolean) => {
    if (!onChange) return;
    const next: ChecklistState = { ...state, [stage]: { ...(state[stage] ?? {}) } };
    next[stage]![item] = checked;
    onChange(next);
  };

  return (
    <div className="space-y-6">
      {stages.map((stage) => {
        const stageState = state[stage.key] ?? {};
        const done = stage.checklist.filter((i) => stageState[i.key]).length;
        return (
          <div key={stage.key} className="rounded-lg border bg-card">
            <div className="flex items-baseline justify-between border-b px-4 py-3">
              <div>
                <h3 className="text-sm font-semibold text-foreground">{stage.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{stage.description}</p>
              </div>
              <span className="shrink-0 pl-3 text-xs tabular-nums text-muted-foreground">
                {done} / {stage.checklist.length}
              </span>
            </div>
            <ul className="divide-y">
              {stage.checklist.map((item) => {
                const checked = !!stageState[item.key];
                const id = `${stage.key}-${item.key}`;
                return (
                  <li key={item.key} className="flex items-center gap-3 px-4 py-2.5">
                    <Checkbox
                      id={id}
                      checked={checked}
                      disabled={readOnly}
                      onCheckedChange={(v) => toggle(stage.key, item.key, !!v)}
                    />
                    <label
                      htmlFor={id}
                      className={
                        "text-sm " +
                        (checked
                          ? "text-muted-foreground line-through"
                          : "text-foreground") +
                        (readOnly ? "" : " cursor-pointer")
                      }
                    >
                      {item.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
