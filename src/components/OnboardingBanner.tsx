import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OnboardingBannerProps {
  onStart: () => void;
  onDismiss: () => void;
}

export function OnboardingBanner({ onStart, onDismiss }: OnboardingBannerProps) {
  return (
    <div className="relative rounded-lg border bg-card px-4 py-3">
      <div className="flex flex-col gap-2 pr-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-foreground">처음 사용하시나요? 1분 안내를 보시겠어요?</p>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onStart} className="h-8">
            둘러보기
          </Button>
          <Button size="sm" variant="ghost" onClick={onDismiss} className="h-8">
            닫기
          </Button>
        </div>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="안내 닫기"
        className="absolute right-2 top-2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
