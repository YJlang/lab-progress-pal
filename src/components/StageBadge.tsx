import type { StageKey, StageStatus } from "@/lib/stages";

const STAGE_COLORS: Record<StageKey, { bg: string; fg: string }> = {
  "1": { bg: "var(--stage-1-bg)", fg: "var(--stage-1-fg)" },
  "1.5": { bg: "var(--stage-1_5-bg)", fg: "var(--stage-1_5-fg)" },
  "2": { bg: "var(--stage-2-bg)", fg: "var(--stage-2-fg)" },
  "2.5": { bg: "var(--stage-2_5-bg)", fg: "var(--stage-2_5-fg)" },
  "3": { bg: "var(--stage-3-bg)", fg: "var(--stage-3-fg)" },
  "3.5": { bg: "var(--stage-3_5-bg)", fg: "var(--stage-3_5-fg)" },
  "4": { bg: "var(--stage-4-bg)", fg: "var(--stage-4-fg)" },
};

const STATUS_STYLE: Record<StageStatus, string> = {
  미시작: "text-muted-foreground/50",
  "진행 중": "text-amber-600",
  "부분 달성": "text-blue-600",
  달성: "text-emerald-600",
};

export function StageBadge({
  stage,
  size = "sm",
}: {
  stage: StageKey;
  status?: StageStatus;
  size?: "sm" | "md" | "xs";
}) {
  const c = STAGE_COLORS[stage];
  const sizeCls =
    size === "xs"
      ? "px-1.5 py-px text-xs"
      : size === "sm"
        ? "px-2 py-0.5 text-xs"
        : "px-2.5 py-1 text-sm";

  return (
    <span
      className={`inline-flex items-center rounded font-medium tabular-nums shrink-0 ${sizeCls}`}
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      S{stage}
    </span>
  );
}

export function StageStatusIndicator({ stage, status }: { stage: StageKey; status: StageStatus }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-xs tabular-nums shrink-0"
      title={`Stage ${stage}: ${status}`}
    >
      <span className={STATUS_STYLE[status]}>{status}</span>
    </span>
  );
}
