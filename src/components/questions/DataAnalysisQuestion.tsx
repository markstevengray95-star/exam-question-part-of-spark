import React from 'react';
import type { DataAnalysisQuestion as DAQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';

interface Props {
  question: DAQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const DataAnalysisQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const subAnswers = (userAnswer?.subAnswers as Record<string, UserAnswer>) || {};

  const handleSubAnswer = (subId: string, val: unknown, answerObj: Partial<UserAnswer>) => {
    if (isSubmitted) return;
    const next = {
      ...subAnswers,
      [subId]: {
        questionId: subId,
        timestamp: Date.now(),
        value: val,
        ...answerObj,
      },
    };
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: next,
      subAnswers: next,
    });
  };

  return (
    <div className="space-y-6">
      {/* Scientific Results Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
              {question.tableData.headers.map((h, i) => (
                <th key={i} className="p-3 border-r border-slate-200 dark:border-slate-700 last:border-r-0">
                  <LatexRenderer content={h} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-900 font-mono">
            {question.tableData.rows.map((row, rIdx) => (
              <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-3 border-r border-slate-100 dark:border-slate-800 last:border-r-0 text-slate-800 dark:text-slate-200">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Sub questions */}
      <div className="space-y-4">
        {question.subQuestions.map((sq, idx) => {
          const subAns = subAnswers[sq.id];

          return (
            <div
              key={sq.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
            >
              <div className="flex justify-between items-start text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  Part ({String.fromCharCode(97 + idx)}): <LatexRenderer content={sq.stem} />
                </span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400 shrink-0 ml-2">
                  [{sq.marks} {sq.marks === 1 ? 'mark' : 'marks'}]
                </span>
              </div>

              {sq.type === 'short-response' && (
                <div>
                  <textarea
                    rows={2}
                    disabled={isSubmitted}
                    value={subAns?.textAnswer || ''}
                    onChange={(e) =>
                      handleSubAnswer(sq.id, e.target.value, { textAnswer: e.target.value })
                    }
                    placeholder="Enter analytical conclusion..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                  {isSubmitted && sq.modelAnswer && (
                    <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-[11px] text-emerald-900 dark:text-emerald-200">
                      <strong>Model Answer:</strong> <LatexRenderer content={sq.modelAnswer} />
                    </div>
                  )}
                </div>
              )}

              {sq.type === 'calculation-single' && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="any"
                    disabled={isSubmitted}
                    value={subAns?.numericAnswer !== undefined ? String(subAns.numericAnswer) : ''}
                    onChange={(e) => {
                      const num = parseFloat(e.target.value);
                      handleSubAnswer(sq.id, isNaN(num) ? e.target.value : num, {
                        numericAnswer: isNaN(num) ? undefined : num,
                      });
                    }}
                    placeholder="Value..."
                    className="w-32 px-3 py-1.5 text-xs font-mono font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none"
                  />
                  <span className="text-xs font-medium text-slate-500">{sq.unit}</span>
                  {isSubmitted && (
                    <span className="text-xs font-bold text-emerald-600">
                      (Ans: {sq.expectedAnswer} {sq.unit})
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
