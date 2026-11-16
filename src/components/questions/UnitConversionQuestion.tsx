import React from 'react';
import type { UnitConversionQuestion as UCQType, UserAnswer, MarkResult } from '../../types';
import { ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: UCQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const UnitConversionQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const numericVal = userAnswer?.numericAnswer !== undefined ? String(userAnswer.numericAnswer) : '';

  const handleChange = (valStr: string) => {
    if (isSubmitted) return;
    const num = parseFloat(valStr);
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: isNaN(num) ? valStr : num,
      numericAnswer: isNaN(num) ? undefined : num,
    });
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
            {question.value}
          </div>
          <div className="text-xs font-semibold text-slate-500 uppercase">{question.fromUnit}</div>
        </div>

        <ArrowRight className="w-6 h-6 text-indigo-500" />

        <div className="flex items-center gap-2">
          <input
            type="number"
            step="any"
            disabled={isSubmitted}
            value={numericVal}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="convert value..."
            className="w-40 px-3 py-2 text-xl font-bold font-mono rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 text-center"
          />
          <span className="font-bold text-slate-700 dark:text-slate-300 text-base">
            {question.toUnit}
          </span>
        </div>
      </div>

      {isSubmitted && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <div className="font-bold text-slate-800 dark:text-slate-200">
            Conversion Steps:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
            {question.conversionSteps.map((step, idx) => (
              <li key={idx}>{step}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
