import React from 'react';
import type { ShortResponseQuestion as SRQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';

interface Props {
  question: SRQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const ShortResponseQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const text = userAnswer?.textAnswer || '';
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

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
      <div>
        <div className="flex justify-between items-center mb-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Type your exam response:</span>
          <span>{wordCount} words {question.maxWords ? `/ max ${question.maxWords}` : ''}</span>
        </div>
        <textarea
          rows={4}
          disabled={isSubmitted}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Write your explanation or answer clearly..."
          className="w-full p-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm leading-relaxed"
        />
      </div>

      {isSubmitted && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span>Model Answer & Mark Scheme</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{question.marks} marks available</span>
          </div>

          <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200">
            <span className="font-bold block mb-1">Model Answer:</span>
            <LatexRenderer content={question.modelAnswer} />
          </div>

          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Mark Scheme Criteria:</span>
            {question.markScheme.map((mp) => (
              <div key={mp.id} className="flex items-start gap-2 p-2 bg-white dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 shrink-0">[{mp.marks}m]</span>
                <span className="text-slate-700 dark:text-slate-200">{mp.point}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
