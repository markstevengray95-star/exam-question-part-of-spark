import React, { useState } from 'react';
import type { MatchingQuestion as MQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: MQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const MatchingQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const pairs: [string, string][] = (userAnswer?.pairs as [string, string][]) || [];
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const getMatchedRight = (leftId: string) => {
    const pair = pairs.find(([l]) => l === leftId);
    return pair ? pair[1] : null;
  };

  const handlePair = (leftId: string, rightId: string) => {
    if (isSubmitted) return;
    // Remove any existing pair with either of these IDs
    const filtered = pairs.filter(([l, r]) => l !== leftId && r !== rightId);
    const updated: [string, string][] = [...filtered, [leftId, rightId]];

    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: updated,
      pairs: updated,
    });
    setSelectedLeft(null);
  };

  const handleRemovePair = (leftId: string) => {
    if (isSubmitted) return;
    const updated = pairs.filter(([l]) => l !== leftId);
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: updated,
      pairs: updated,
    });
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Click an item on the left, then click its corresponding match on the right:
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Items:</div>
          {question.leftItems.map((left) => {
            const matchedRightId = getMatchedRight(left.id);
            const isSelected = selectedLeft === left.id;
            const isCorrectPair =
              isSubmitted &&
              question.correctPairs.some(([l, r]) => l === left.id && r === matchedRightId);

            return (
              <button
                key={left.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => setSelectedLeft(isSelected ? null : left.id)}
                className={`w-full text-left p-3.5 rounded-xl border-2 text-xs font-semibold transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 ring-2 ring-indigo-400'
                    : matchedRightId
                    ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/20'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
                }`}
              >
                <div>
                  <LatexRenderer content={left.text} />
                  {matchedRightId && (
                    <span className="block text-[11px] font-normal text-indigo-600 dark:text-indigo-400 mt-1">
                      → {question.rightItems.find((r) => r.id === matchedRightId)?.text}
                    </span>
                  )}
                </div>
                {isSubmitted && matchedRightId && (
                  isCorrectPair ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )
                )}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">Matches:</div>
          {question.rightItems.map((right) => {
            const isMatched = pairs.some(([, r]) => r === right.id);

            return (
              <button
                key={right.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => {
                  if (selectedLeft) {
                    handlePair(selectedLeft, right.id);
                  }
                }}
                className={`w-full text-left p-3.5 rounded-xl border-2 text-xs font-semibold transition-all ${
                  selectedLeft
                    ? 'border-indigo-400 hover:border-indigo-600 bg-indigo-50/30 dark:bg-indigo-950/20'
                    : isMatched
                    ? 'border-indigo-300 dark:border-indigo-800 bg-slate-50 dark:bg-slate-800/80 opacity-80'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300'
                }`}
              >
                <LatexRenderer content={right.text} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
