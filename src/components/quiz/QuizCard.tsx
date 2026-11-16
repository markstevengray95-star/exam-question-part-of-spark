import React from 'react';
import type { QuizMode } from '../../types';
import { Zap, Target, Flame, Timer as TimerIcon } from 'lucide-react';

interface QuizCardProps {
  mode: QuizMode;
  title: string;
  description: string;
  badgeText: string;
  selected?: boolean;
  onClick: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  mode,
  title,
  description,
  badgeText,
  selected = false,
  onClick,
}) => {
  const getIcon = () => {
    switch (mode) {
      case 'quick-fire':
        return <Zap className="w-6 h-6 text-amber-500" />;
      case 'topic-test':
        return <Target className="w-6 h-6 text-indigo-500" />;
      case 'timed-exam':
        return <TimerIcon className="w-6 h-6 text-rose-500" />;
      default:
        return <Flame className="w-6 h-6 text-teal-500" />;
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 text-left flex flex-col justify-between ${
        selected
          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-md ring-2 ring-indigo-500/20'
          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-600 shadow-sm'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700/60">
            {getIcon()}
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            {badgeText}
          </span>
        </div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
        <span>{selected ? 'Selected Mode' : 'Select'}</span>
        <span>→</span>
      </div>
    </div>
  );
};
