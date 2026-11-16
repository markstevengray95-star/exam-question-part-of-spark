import React from 'react';
import type { TrueFalseQuestion as TFQType, UserAnswer, MarkResult } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: TFQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const TrueFalseQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const currentVal = userAnswer?.booleanAnswer;

  const handleSelect = (val: boolean) => {
    if (isSubmitted) return;
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: val,
      booleanAnswer: val,
    });
  };

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto my-4">
      {/* True Button */}
      <button
        type="button"
        disabled={isSubmitted}
        onClick={() => handleSelect(true)}
        className={`p-6 rounded-2xl border-2 font-bold text-lg text-center transition-all ${
          currentVal === true && !isSubmitted
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
            : isSubmitted && question.correctAnswer === true
            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
            : isSubmitted && currentVal === true && question.correctAnswer === false
            ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <span>True</span>
          {isSubmitted && question.correctAnswer === true && (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          )}
          {isSubmitted && currentVal === true && question.correctAnswer === false && (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
      </button>

      {/* False Button */}
      <button
        type="button"
        disabled={isSubmitted}
        onClick={() => handleSelect(false)}
        className={`p-6 rounded-2xl border-2 font-bold text-lg text-center transition-all ${
          currentVal === false && !isSubmitted
            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-500/20'
            : isSubmitted && question.correctAnswer === false
            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
            : isSubmitted && currentVal === false && question.correctAnswer === true
            ? 'border-red-500 bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-indigo-400'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <span>False</span>
          {isSubmitted && question.correctAnswer === false && (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          )}
          {isSubmitted && currentVal === false && question.correctAnswer === true && (
            <XCircle className="w-6 h-6 text-red-600" />
          )}
        </div>
      </button>
    </div>
  );
};
