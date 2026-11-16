import React from 'react';
import type { EquationRearrangementQuestion as ERType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  question: ERType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const EquationRearrangementQuestion: React.FC<Props> = ({
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
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-2">
        <span className="text-xs font-semibold text-slate-500">Original Equation:</span>
        <div className="text-xl font-bold font-mono">
          <LatexRenderer content={`$$${question.originalEquation}$$`} />
        </div>
        <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400">
          Target variable to make the subject: <strong>{question.targetVariable}</strong>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          Rearranged formula:
        </label>
        <div className="flex items-center gap-2">
          <span className="text-lg font-mono font-bold text-slate-700 dark:text-slate-300">
            {question.targetVariable} =
          </span>
          <input
            type="text"
            disabled={isSubmitted}
            value={text.replace(new RegExp(`^${question.targetVariable}\\s*=\\s*`), '')}
            onChange={(e) => handleChange(`${question.targetVariable} = ${e.target.value}`)}
            placeholder="e.g. n / c"
            className="flex-1 px-4 py-2 text-base font-mono font-semibold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {isSubmitted && (
        <div className="p-3.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs space-y-1">
          <div className="font-bold text-slate-700 dark:text-slate-300">Expected Rearrangement:</div>
          <div className="font-mono text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
            {question.correctRearrangement}
          </div>
        </div>
      )}
    </div>
  );
};
