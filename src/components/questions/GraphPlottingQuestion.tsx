import React, { useState } from 'react';
import type { GraphPlottingQuestion as GPQType, UserAnswer, MarkResult, DataPoint } from '../../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
} from 'recharts';
import { CheckCircle2, RotateCcw } from 'lucide-react';

interface Props {
  question: GPQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const GraphPlottingQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const [plottedPoints, setPlottedPoints] = useState<DataPoint[]>(
    userAnswer?.plotPoints || []
  );

  const handleAddPoint = (x: number, y: number) => {
    if (isSubmitted) return;
    const next = [...plottedPoints.filter((p) => p.x !== x), { x, y }].sort((a, b) => a.x - b.x);
    setPlottedPoints(next);
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: next,
      plotPoints: next,
    });
  };

  const handleReset = () => {
    if (isSubmitted) return;
    setPlottedPoints([]);
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: [],
      plotPoints: [],
    });
  };

  // Combine plotted points and expected line for graph display
  const chartData = question.dataPoints.map((dp) => {
    const userPt = plottedPoints.find((p) => Math.abs(p.x - dp.x) < 0.1);
    return {
      x: dp.x,
      expectedY: dp.y,
      userY: userPt ? userPt.y : null,
    };
  });

  return (
    <div className="space-y-4">
      <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            Plot Points Table (click buttons below to plot or match points):
          </span>
          {!isSubmitted && plottedPoints.length > 0 && (
            <button
              onClick={handleReset}
              className="text-xs text-rose-600 flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Points
            </button>
          )}
        </div>

        {/* Quick Plot Buttons */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-4">
          {question.dataPoints.map((pt, i) => {
            const isPlotted = plottedPoints.some((p) => Math.abs(p.x - pt.x) < 0.1 && Math.abs(p.y - pt.y) < 0.1);
            return (
              <button
                key={i}
                type="button"
                disabled={isSubmitted}
                onClick={() => handleAddPoint(pt.x, pt.y)}
                className={`px-2 py-1.5 rounded text-xs font-mono font-medium border text-center transition-all ${
                  isPlotted
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                    : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:border-indigo-400'
                }`}
              >
                ({pt.x}, {pt.y})
              </button>
            );
          })}
        </div>

        {/* Recharts Graphical View */}
        <div className="h-64 w-full bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="x"
                label={{ value: `${question.xAxisLabel} (${question.xUnit})`, position: 'insideBottom', offset: -10, fontSize: 11 }}
              />
              <YAxis
                label={{ value: `${question.yAxisLabel} (${question.yUnit})`, angle: -90, position: 'insideLeft', fontSize: 11 }}
              />
              <Tooltip />
              {/* Plotted line */}
              <Line
                type="monotone"
                dataKey="userY"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 5, fill: '#4f46e5' }}
                name="Plotted Points"
                connectNulls
              />
              {isSubmitted && (
                <Line
                  type="monotone"
                  dataKey="expectedY"
                  stroke="#10b981"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  name="Best Fit Line"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {isSubmitted && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
          <div className="font-bold mb-1">Graph Plotting Assessment:</div>
          <ul className="list-disc list-inside space-y-0.5">
            {question.markScheme.map((mp) => (
              <li key={mp.id}>{mp.point} [{mp.marks}m]</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
