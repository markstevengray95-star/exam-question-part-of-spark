import React from 'react';
import type { GraphInterpretationQuestion as GIQType, UserAnswer, MarkResult } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { LatexRenderer } from '../common/LatexRenderer';

interface Props {
  question: GIQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const GraphInterpretationQuestion: React.FC<Props> = ({
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

  // Prepare recharts data
  const datasets = question.graphData.datasets;
  const allX = Array.from(
    new Set(datasets.flatMap((ds) => ds.data.map((d) => d.x)))
  ).sort((a, b) => a - b);

  const chartData = allX.map((xVal) => {
    const row: Record<string, number | null> = { x: xVal };
    datasets.forEach((ds) => {
      const pt = ds.data.find((d) => d.x === xVal);
      row[ds.label] = pt ? pt.y : null;
    });
    return row;
  });

  return (
    <div className="space-y-6">
      {/* Recharts Rendered Graph */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {question.graphData.title && (
          <h4 className="text-center font-bold text-sm text-slate-800 dark:text-slate-200 mb-2">
            {question.graphData.title}
          </h4>
        )}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="x"
                label={{
                  value: `${question.graphData.xAxisLabel} (${question.graphData.xUnit})`,
                  position: 'insideBottom',
                  offset: -10,
                  fontSize: 11,
                }}
              />
              <YAxis
                label={{
                  value: `${question.graphData.yAxisLabel} (${question.graphData.yUnit})`,
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 11,
                }}
              />
              <Tooltip />
              {datasets.length > 1 && <Legend />}
              {datasets.map((ds, idx) => (
                <Line
                  key={idx}
                  type="monotone"
                  dataKey={ds.label}
                  stroke={ds.colour || '#6366f1'}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
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

              {/* Sub-question input based on type */}
              {sq.type === 'multiple-choice' && sq.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sq.options.map((opt) => {
                    const isSelected = subAns?.selectedOptionId === opt.id;
                    const isCorrect = isSubmitted && opt.id === sq.correctOptionId;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        disabled={isSubmitted}
                        onClick={() =>
                          handleSubAnswer(sq.id, opt.id, { selectedOptionId: opt.id })
                        }
                        className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                        } ${isSubmitted && isCorrect ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' : ''}`}
                      >
                        <LatexRenderer content={opt.text} />
                      </button>
                    );
                  })}
                </div>
              )}

              {sq.type === 'short-response' && (
                <div>
                  <textarea
                    rows={3}
                    disabled={isSubmitted}
                    value={subAns?.textAnswer || ''}
                    onChange={(e) =>
                      handleSubAnswer(sq.id, e.target.value, { textAnswer: e.target.value })
                    }
                    placeholder="Enter explanation based on the graph..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                  {isSubmitted && sq.modelAnswer && (
                    <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-200">
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
