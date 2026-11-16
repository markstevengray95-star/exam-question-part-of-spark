import React from 'react';
import type { ExtendedResponseQuestion as ERQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';

interface Props {
  question: ERQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const ExtendedResponseQuestion: React.FC<Props> = ({
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
      {question.qualityOfWrittenCommunication && (
        <div className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 font-medium">
          ✍️ <strong>Quality of Written Communication:</strong> You will be assessed on your ability to organise information clearly, use specialist terminology appropriately, and formulate a coherent logical sequence.
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Extended response (6-mark question format):</span>
          <span>{wordCount} words</span>
        </div>
        <textarea
          rows={7}
          disabled={isSubmitted}
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Develop your full structured argument / explanation here..."
          className="w-full p-4 text-sm rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 outline-none transition-all shadow-sm leading-relaxed"
        />
      </div>

      {isSubmitted && (
        <div className="p-5 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 text-xs">
          <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center justify-between">
            <span className="text-sm">Model Answer & Level Descriptors</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{question.marks} marks available</span>
          </div>

          <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200 whitespace-pre-line leading-relaxed">
            <span className="font-bold block mb-1">Model Answer:</span>
            <LatexRenderer content={question.modelAnswer} />
          </div>

          {question.levelDescriptors && question.levelDescriptors.length > 0 && (
            <div className="space-y-2">
              <span className="font-bold text-slate-700 dark:text-slate-300 block">Level Descriptors:</span>
              <div className="grid gap-2">
                {question.levelDescriptors.map((ld) => (
                  <div key={ld.level} className="p-2.5 bg-white dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-700">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      Level {ld.level} ({ld.marksRange[0]}-{ld.marksRange[1]} marks):
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 mt-0.5">{ld.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">Indicative Content & Key Points:</span>
            {question.markScheme.map((mp) => (
              <div key={mp.id} className="flex items-start gap-2 p-2 bg-white dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                <span className="text-emerald-600 font-bold">•</span>
                <span className="text-slate-700 dark:text-slate-200">{mp.point}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
