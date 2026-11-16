import { useEffect } from 'react';

interface KeyboardNavOptions {
  onNext?: () => void;
  onPrev?: () => void;
  onSubmit?: () => void;
  onOptionSelect?: (index: number) => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  onNext,
  onPrev,
  onSubmit,
  onOptionSelect,
  enabled = true,
}: KeyboardNavOptions) {
  useEffect(() => {
    if (!enabled) return;

    function handleKeyDown(e: KeyboardEvent) {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'ArrowRight' && onNext) {
        e.preventDefault();
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev) {
        e.preventDefault();
        onPrev();
      } else if ((e.key === 'Enter' || (e.ctrlKey && e.key === 'Enter')) && onSubmit) {
        e.preventDefault();
        onSubmit();
      } else if (onOptionSelect && ['1', '2', '3', '4', 'a', 'b', 'c', 'd'].includes(e.key.toLowerCase())) {
        const key = e.key.toLowerCase();
        let idx = -1;
        if (key === '1' || key === 'a') idx = 0;
        if (key === '2' || key === 'b') idx = 1;
        if (key === '3' || key === 'c') idx = 2;
        if (key === '4' || key === 'd') idx = 3;
        if (idx !== -1) {
          onOptionSelect(idx);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev, onSubmit, onOptionSelect, enabled]);
}
