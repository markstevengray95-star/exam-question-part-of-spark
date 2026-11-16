import { useEffect, useRef } from 'react';
import { useQuizStore } from '../store/quizStore';

export function useTimer(onTimeUp?: () => void) {
  const isComplete = useQuizStore((s) => s.isComplete);
  const isPaused = useQuizStore((s) => s.isPaused);
  const config = useQuizStore((s) => s.config);
  const startTime = useQuizStore((s) => s.startTime);
  const timeLimit = config?.timeLimit; // in seconds

  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (!timeLimit || isComplete || isPaused) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, timeLimit - elapsed);
      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUpRef.current?.();
      }
    }, 500);

    return () => clearInterval(interval);
  }, [timeLimit, isComplete, isPaused, startTime]);
}
