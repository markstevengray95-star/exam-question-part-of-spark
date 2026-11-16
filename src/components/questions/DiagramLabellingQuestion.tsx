import React from 'react';
import type { DiagramLabellingQuestion as DLQType, UserAnswer, MarkResult } from '../../types';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: DLQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const DiagramLabellingQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const labelAnswers = (userAnswer?.labelAnswers as Record<string, string>) || {};

  const handleSelectLabel = (labelId: string, val: string) => {
    if (isSubmitted) return;
    const next = { ...labelAnswers, [labelId]: val };
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: next,
      labelAnswers: next,
    });
  };

  return (
    <div className="space-y-6">
      {/* SVG Diagram Canvas */}
      <div className="relative border rounded-2xl overflow-hidden bg-slate-950 p-2 flex justify-center shadow-inner">
        <div
          className="w-full max-w-lg"
          dangerouslySetInnerHTML={{ __html: question.diagramSvg }}
        />
      </div>

      {/* Label Selectors */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
          Match each numbered label on the diagram with its correct scientific name:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {question.labels.map((lbl) => {
            const currentSelected = labelAnswers[lbl.id] || '';
            const isCorrect = isSubmitted && currentSelected.trim().toLowerCase() === lbl.correctLabel.trim().toLowerCase();

            return (
              <div
                key={lbl.id}
                className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-3 shadow-sm"
              >
                <span className="w-7 h-7 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {lbl.id}
                </span>

                <select
                  disabled={isSubmitted}
                  value={currentSelected}
                  onChange={(e) => handleSelectLabel(lbl.id, e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose label --</option>
                  {question.labelOptions.map((opt, i) => (
                    <option key={i} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>

                {isSubmitted && (
                  isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <div className="shrink-0 text-[10px] text-rose-600 font-bold">
                      ({lbl.correctLabel})
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
