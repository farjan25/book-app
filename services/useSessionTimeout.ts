import { useEffect, useRef } from "react";

export function useSessionTimeout(timeoutMs: number, onTimeout: () => void) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(onTimeout, timeoutMs);
  };

  useEffect(() => {
    const activityEvents = ["mousemove", "keydown", "click", "scroll"];

    activityEvents.forEach(event =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer(); // Start timer on mount

    return () => {
      activityEvents.forEach(event =>
        window.removeEventListener(event, resetTimer)
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeoutMs, onTimeout]);
}