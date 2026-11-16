import React from 'react';
import type { FillBlanksQuestion as FBQType, UserAnswer, MarkResult } from '../../types';

interface Props {
  question: FBQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const FillBlanksQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const blanksAnswers = (userAnswer?.blanksAnswers as Record<string, string>) || {};

  const handleChange = (blankId: string, val: string) => {
    if (isSubmitted) return;
    const updated = { ...blanksAnswers, [blankId]: val };
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: updated,
      blanksAnswers: updated,
    });
  };

  // Render the template with input boxes
  const renderTemplate = () => {
    const parts = question.template.split(/\{\{([^}]+)\}\}/g);

    return parts.map((part, index) => {
      // Odd indices are the blank IDs
      if (index % 2 === 1) {
        const blankId = part.trim();
        const blankDef = question.blanks.find((b) => b.id === blankId);
        const userVal = blanksAnswers[blankId] || '';
        const isBlankCorrect =
          isSubmitted &&
          blankDef?.acceptableAnswers.some(
            (ans) => ans.trim().toLowerCase() === userVal.trim().toLowerCase()
          );

        let borderClass = 'border-slate-300 dark:border-slate-600 focus:border-indigo-500';
        if (isSubmitted) {
          borderClass = isBlankCorrect
            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
            : 'border-red-500 bg-red-50 text-red-900 dark:bg-red-950/40 dark:text-red-200';
        }

        return (
          <span key={index} className="inline-block mx-1.5 align-middle">
            <input
              type="text"
              disabled={isSubmitted}
              value={userVal}
              onChange={(e) => handleChange(blankId, e.target.value)}
              placeholder="type answer..."
              className={`px-3 py-1 text-sm font-semibold rounded-lg border-2 outline-none transition-all shadow-sm ${borderClass}`}
              size={Math.max(12, (blankDef?.acceptableAnswers[0]?.length || 10) + 2)}
            />
            {isSubmitted && !isBlankCorrect && blankDef && (
              <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                ({blankDef.acceptableAnswers[0]})
              </span>
            )}
          </span>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="p-6 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 text-base leading-loose text-slate-800 dark:text-slate-200">
      {renderTemplate()}
    </div>
  );
};
