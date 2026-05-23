import { STAGES, type ChecklistState, type StageKey } from "@/lib/stages";
import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  state: ChecklistState;
  onChange?: (next: ChecklistState) => void;
  readOnly?: boolean;
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
    <div className="space-y-3">
      {stages.map((stage) => {
        const stageState = state[stage.key] ?? {};
        const done = stage.checklist.filter((i) => stageState[i.key]).length;
        return (
          <div key={stage.key} className="rounded-md border bg-card">
            <div className="flex items-baseline justify-between border-b px-3 py-2">
              <h3 className="text-sm font-semibold text-foreground">{stage.title}</h3>
              <span className="shrink-0 pl-2 text-xs tabular-nums text-muted-foreground">
                {done}/{stage.checklist.length}
              </span>
            </div>
            <ul className="divide-y">
              {stage.checklist.map((item) => {
                const checked = !!stageState[item.key];
                const id = `cl-${stage.key}-${item.key}`;
                return (
                  <li key={item.key} className="flex items-center gap-2.5 px-3 py-2">
                    <Checkbox
                      id={id}
                      checked={checked}
                      disabled={readOnly}
                      onCheckedChange={(v) => toggle(stage.key, item.key, !!v)}
                    />
                    <label
                      htmlFor={id}
                      className={`text-sm ${
                        checked ? "text-muted-foreground/50 line-through" : "text-foreground"
                      } ${readOnly ? "" : "cursor-pointer"}`}
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
