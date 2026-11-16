import React from 'react';
import type { MultipleAnswerQuestion as MAQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { Check, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: MAQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const MultipleAnswerQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const selectedIds = userAnswer?.selectedOptionIds || [];

  const handleToggle = (id: string) => {
    if (isSubmitted) return;
    const newSelected = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];

    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: newSelected,
      selectedOptionIds: newSelected,
    });
  };

  return (
    <div className="space-y-3">
      <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
        Select all that apply ({question.correctOptionIds.length} correct options):
      </div>

      {question.options.map((opt) => {
        const isSelected = selectedIds.includes(opt.id);
        const isCorrect = isSubmitted && question.correctOptionIds.includes(opt.id);
        const isWrong = isSubmitted && isSelected && !isCorrect;

        let borderClass = 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500';
        let bgClass = 'bg-white dark:bg-slate-800/80';

        if (isSelected && !isSubmitted) {
          borderClass = 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20';
          bgClass = 'bg-indigo-50/50 dark:bg-indigo-950/30';
        }

        if (isSubmitted) {
          if (isCorrect && isSelected) {
            borderClass = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30';
          } else if (isCorrect && !isSelected) {
            borderClass = 'border-emerald-500/60 border-dashed bg-emerald-50/20';
          } else if (isWrong) {
            borderClass = 'border-red-500 bg-red-50/60 dark:bg-red-950/30';
          }
        }

        return (
          <button
            key={opt.id}
            type="button"
            disabled={isSubmitted}
            onClick={() => handleToggle(opt.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 ${borderClass} ${bgClass}`}
          >
            <div
              className={`flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center mt-0.5 ${
                isSelected
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
              }`}
            >
              {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
            </div>

            <div className="flex-1">
              <LatexRenderer content={opt.text} />
              {isSubmitted && opt.explanation && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/40 p-2 rounded-lg">
                  {opt.explanation}
                </p>
              )}
            </div>

            {isSubmitted && isCorrect && isSelected && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            )}
            {isSubmitted && isWrong && (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
};
