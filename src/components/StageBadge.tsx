import type { StageKey } from "@/lib/stages";

const STYLES: Record<StageKey, { bg: string; fg: string }> = {
  "1":   { bg: "var(--stage-1-bg)",   fg: "var(--stage-1-fg)" },
  "1.5": { bg: "var(--stage-1_5-bg)", fg: "var(--stage-1_5-fg)" },
  "2":   { bg: "var(--stage-2-bg)",   fg: "var(--stage-2-fg)" },
  "2.5": { bg: "var(--stage-2_5-bg)", fg: "var(--stage-2_5-fg)" },
  "3":   { bg: "var(--stage-3-bg)",   fg: "var(--stage-3-fg)" },
  "3.5": { bg: "var(--stage-3_5-bg)", fg: "var(--stage-3_5-fg)" },
  "4":   { bg: "var(--stage-4-bg)",   fg: "var(--stage-4-fg)" },
};

export function StageBadge({ stage, size = "sm" }: { stage: StageKey; size?: "sm" | "md" }) {
  const s = STYLES[stage];
  return (
    <span
      className={
        "inline-flex items-center rounded-md font-medium tabular-nums " +
        (size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm")
      }
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      Stage {stage}
    </span>
  );
}
