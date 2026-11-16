import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { formatTime } from '../../utils/formatUtils';

interface TimerProps {
  totalSeconds: number;
  startTime: number;
  isPaused?: boolean;
  onTimeUp?: () => void;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  totalSeconds,
  startTime,
  isPaused = false,
  onTimeUp,
  className = '',
}) => {
  const [remaining, setRemaining] = useState<number>(totalSeconds);

  useEffect(() => {
    if (isPaused) return;

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const rem = Math.max(0, totalSeconds - elapsed);
      setRemaining(rem);
      if (rem <= 0) {
        onTimeUp?.();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [totalSeconds, startTime, isPaused, onTimeUp]);

  const isLow = remaining < 60; // less than 1 minute

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono font-medium text-sm transition-colors ${
        isLow
          ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-400 animate-pulse'
          : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
      } ${className}`}
    >
      <Clock className="w-4 h-4" />
      <span>{formatTime(remaining)}</span>
    </div>
  );
};
