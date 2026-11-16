import React from 'react';
import type { MultipleChoiceQuestion as MCQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: MCQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const MultipleChoiceQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const selectedId = userAnswer?.selectedOptionId;

  const handleSelect = (id: string) => {
    if (isSubmitted) return;
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: id,
      selectedOptionId: id,
    });
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="space-y-3">
      {question.options.map((opt, idx) => {
        const isSelected = selectedId === opt.id;
        const isCorrect = isSubmitted && opt.id === question.correctOptionId;
        const isWrong = isSubmitted && isSelected && !isCorrect;

        let borderClass = 'border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500';
        let bgClass = 'bg-white dark:bg-slate-800/80';

        if (isSelected && !isSubmitted) {
          borderClass = 'border-indigo-600 dark:border-indigo-500 ring-2 ring-indigo-500/20';
          bgClass = 'bg-indigo-50/50 dark:bg-indigo-950/30';
        }

        if (isSubmitted) {
          if (isCorrect) {
            borderClass = 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
          } else if (isWrong) {
            borderClass = 'border-red-500 bg-red-50/60 dark:bg-red-950/30 text-red-900 dark:text-red-200';
          }
        }

        return (
          <button
            key={opt.id}
            type="button"
            disabled={isSubmitted}
            onClick={() => handleSelect(opt.id)}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-150 flex items-start gap-3 ${borderClass} ${bgClass}`}
          >
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                isSelected
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {optionLetters[idx] || idx + 1}
            </span>

            <div className="flex-1 pt-0.5">
              <LatexRenderer content={opt.text} />
              {isSubmitted && opt.explanation && (
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-100/50 dark:bg-slate-900/40 p-2 rounded-lg">
                  {opt.explanation}
                </p>
              )}
            </div>

            {isSubmitted && isCorrect && (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-1" />
            )}
            {isSubmitted && isWrong && (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
            )}
          </button>
        );
      })}
    </div>
  );
};
