import React, { useState, useEffect } from 'react';
import type { SequencingQuestion as SQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { ArrowUp, ArrowDown, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: SQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const SequencingQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  // Current order of item IDs
  const [order, setOrder] = useState<string[]>(() => {
    if (userAnswer?.ordering && userAnswer.ordering.length === question.items.length) {
      return userAnswer.ordering;
    }
    // Default initial shuffle or order
    return question.items.map((i) => i.id);
  });

  useEffect(() => {
    if (userAnswer?.ordering) {
      setOrder(userAnswer.ordering);
    }
  }, [userAnswer?.ordering]);

  const move = (fromIdx: number, toIdx: number) => {
    if (isSubmitted || toIdx < 0 || toIdx >= order.length) return;
    const next = [...order];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    setOrder(next);

    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: next,
      ordering: next,
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Arrange the steps in the correct chronological order using the up/down arrows:
      </div>

      <div className="space-y-2">
        {order.map((itemId, idx) => {
          const item = question.items.find((i) => i.id === itemId);
          if (!item) return null;

          const isCorrectPosition = isSubmitted && question.correctOrder[idx] === itemId;

          return (
            <div
              key={itemId}
              className={`p-3 rounded-xl border-2 flex items-center justify-between gap-3 transition-all ${
                isSubmitted
                  ? isCorrectPosition
                    ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30'
                    : 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                  <LatexRenderer content={item.text} />
                </span>
              </div>

              {!isSubmitted ? (
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => move(idx, idx - 1)}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === order.length - 1}
                    onClick={() => move(idx, idx + 1)}
                    className="p-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="shrink-0">
                  {isCorrectPosition ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
