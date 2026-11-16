import React from 'react';
import type { KeywordDefinitionQuestion as KDQType, UserAnswer, MarkResult } from '../../types';

interface Props {
  question: KDQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const KeywordDefinitionQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const text = userAnswer?.textAnswer || '';

  const handleChange = (val: string) => {
    if (isSubmitted) return;
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: val,
      textAnswer: val,
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-600 dark:text-indigo-400">Target Term</span>
          <h4 className="text-xl font-bold text-slate-900 dark:text-white capitalize">{question.keyword}</h4>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
          Definition Question
        </span>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
          Write a precise scientific definition:
        </label>
        <textarea
          rows={3}
          disabled={isSubmitted}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={`Define "${question.keyword}" scientifically...`}
          className="w-full p-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm"
        />
      </div>

      {isSubmitted && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <div className="font-bold text-slate-800 dark:text-slate-200">Key terms required in marking:</div>
          <div className="flex flex-wrap gap-1.5">
            {question.keyTerms.map((term, i) => {
              const matched = text.toLowerCase().includes(term.toLowerCase());
              return (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-md font-medium ${
                    matched
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300'
                  }`}
                >
                  {matched ? '✓' : '✗'} {term}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
