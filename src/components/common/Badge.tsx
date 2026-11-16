import React from 'react';
import type { Difficulty, Qualification, AssessmentObjective } from '../../types';
import { getDifficultyLabel } from '../../utils/formatUtils';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'difficulty' | 'qualification' | 'marks' | 'ao' | 'type' | 'default';
  difficulty?: Difficulty;
  qualification?: Qualification;
  ao?: AssessmentObjective;
  marks?: number;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  difficulty,
  qualification,
  ao,
  marks,
  className = '',
}) => {
  if (variant === 'difficulty' && difficulty) {
    const colours: Record<Difficulty, string> = {
      1: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
      2: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800',
      3: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
      4: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
      5: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colours[difficulty]} ${className}`}>
        Level {difficulty} ({getDifficultyLabel(difficulty)})
      </span>
    );
  }

  if (variant === 'qualification' && qualification) {
    const isGCSE = qualification === 'gcse';
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider ${
        isGCSE
          ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300'
          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-300'
      } ${className}`}>
        {isGCSE ? 'GCSE' : 'A-Level'}
      </span>
    );
  }

  if (variant === 'marks' && marks !== undefined) {
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${className}`}>
        {marks} {marks === 1 ? 'mark' : 'marks'}
      </span>
    );
  }

  if (variant === 'ao' && ao) {
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-medium bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 ${className}`}>
        {ao}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ${className}`}>
      {children}
    </span>
  );
};
