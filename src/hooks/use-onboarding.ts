import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lab-progress-pal:onboarding-v1";

export type OnboardingStatus = "unseen" | "dismissed" | "completed";

function isOnboardingStatus(v: string | null): v is OnboardingStatus {
  return v === "unseen" || v === "dismissed" || v === "completed";
}

export function useOnboarding() {
  const [status, setStatus] = useState<OnboardingStatus>("unseen");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (isOnboardingStatus(stored)) {
        setStatus(stored);
      }
    } catch {
      // localStorage unavailable; keep default
    }
  }, []);

  const persist = useCallback((next: OnboardingStatus) => {
    setStatus(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const markDismissed = useCallback(() => persist("dismissed"), [persist]);
  const markCompleted = useCallback(() => persist("completed"), [persist]);
  const reset = useCallback(() => persist("unseen"), [persist]);

  return { status, markDismissed, markCompleted, reset };
}
