import { useEffect, useRef } from "react";
import type { Driver, DriveStep } from "driver.js";

// The header help button dispatches `onboarding:open` on window;
// this component listens for it so the header doesn't need route-specific state.
export const ONBOARDING_OPEN_EVENT = "onboarding:open";

interface OnboardingTourProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const STEPS: DriveStep[] = [
  {
    element: undefined,
    popover: {
      title: "INC Lab 진행 상황 보드",
      description:
        "INC Lab 학부연구생들의 학습 단계와 체크리스트를 함께 기록하고 공유하는 공간입니다. 빠르게 둘러보겠습니다.",
    },
  },
  {
    element: '[data-tour="stage-reference"]',
    popover: {
      title: "Progress 기준",
      description:
        "S1부터 S6까지 단계별 학습 목표가 정리되어 있습니다. 각 단계를 펼치면 세부 체크리스트와 달성 기준을 확인할 수 있습니다.",
    },
  },
  {
    element: '[data-tour="student-list"]',
    popover: {
      title: "다른 연구생의 진행 상황",
      description:
        "등록된 연구생의 단계와 진행률이 표시됩니다. 학생을 클릭하면 단계별 메모와 체크 항목까지 자세히 볼 수 있습니다.",
    },
  },
  {
    element: '[data-tour="add-student"]',
    popover: {
      title: "본인 등록 또는 새 연구생 추가",
      description:
        "본인이나 다른 연구생을 처음 등록할 때 사용합니다. 등록 시 설정한 PIN으로 본인의 진행 상황만 수정할 수 있습니다.",
    },
  },
  {
    element: '[data-tour="help"]',
    popover: {
      title: "다시 보고 싶을 때",
      description:
        "안내가 다시 필요하면 헤더의 ? 버튼을 누르세요. 언제든 처음부터 다시 볼 수 있습니다.",
    },
  },
];

export default function OnboardingTour({ open, onOpen, onClose }: OnboardingTourProps) {
  const driverRef = useRef<Driver | null>(null);
  const onCloseRef = useRef(onClose);
  const onOpenRef = useRef(onOpen);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    onOpenRef.current = onOpen;
  }, [onOpen]);

  useEffect(() => {
    const handler = () => onOpenRef.current();
    window.addEventListener(ONBOARDING_OPEN_EVENT, handler);
    return () => window.removeEventListener(ONBOARDING_OPEN_EVENT, handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    // driver.js is a client-only library; loading it dynamically keeps it out
    // of the SSR bundle so the server doesn't try to import it at runtime.
    (async () => {
      const [{ driver }] = await Promise.all([
        import("driver.js"),
        import("driver.js/dist/driver.css"),
      ]);
      if (cancelled) return;

      const d = driver({
        showProgress: true,
        progressText: "{{current}} / {{total}}",
        nextBtnText: "다음",
        prevBtnText: "이전",
        doneBtnText: "완료",
        allowClose: true,
        steps: STEPS,
        onDestroyed: () => {
          onCloseRef.current();
        },
        onCloseClick: () => {
          d.destroy();
        },
      });

      driverRef.current = d;
      d.drive();
    })();

    return () => {
      cancelled = true;
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    };
  }, [open]);

  return null;
}
