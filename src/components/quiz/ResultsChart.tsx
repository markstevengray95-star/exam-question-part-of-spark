import React from 'react';
import type { TopicPerformance, DifficultyPerformance, TypePerformance } from '../../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getDifficultyLabel, getQuestionTypeLabel } from '../../utils/formatUtils';

interface ResultsChartProps {
  topicBreakdown: TopicPerformance[];
  difficultyBreakdown: DifficultyPerformance[];
  typeBreakdown: TypePerformance[];
}

const COLOURS = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'];

export const ResultsChart: React.FC<ResultsChartProps> = ({
  topicBreakdown,
  difficultyBreakdown,
  typeBreakdown,
}) => {
  const topicData = topicBreakdown.map((t) => ({
    name: t.topicName.length > 18 ? `${t.topicName.slice(0, 16)}...` : t.topicName,
    percentage: Math.round(t.percentage * 100),
    marks: `${t.marks}/${t.maxMarks}`,
  }));

  const diffData = difficultyBreakdown.map((d) => ({
    name: `Lvl ${d.difficulty}`,
    label: getDifficultyLabel(d.difficulty),
    percentage: Math.round(d.percentage * 100),
  }));

  const typeData = typeBreakdown
    .filter((t) => t.maxMarks > 0)
    .map((t) => ({
      name: getQuestionTypeLabel(t.type),
      value: t.maxMarks,
      percentage: Math.round(t.percentage * 100),
    }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Topic Performance Bar Chart */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">
          Topic Breakdown (% Score)
        </h4>
        <div className="h-56 w-full">
          {topicData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topicData} margin={{ top: 10, right: 10, bottom: 20, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={10} interval={0} angle={-15} textAnchor="end" />
                <YAxis domain={[0, 100]} fontSize={11} unit="%" />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Score']} />
                <Bar dataKey="percentage" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No topic data available
            </div>
          )}
        </div>
      </div>

      {/* Difficulty Performance Bar Chart */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-4">
          Performance by Difficulty Level
        </h4>
        <div className="h-56 w-full">
          {diffData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diffData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis domain={[0, 100]} fontSize={11} unit="%" />
                <Tooltip formatter={(val: any) => [`${val}%`, 'Score']} />
                <Bar dataKey="percentage" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-400">
              No difficulty data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
