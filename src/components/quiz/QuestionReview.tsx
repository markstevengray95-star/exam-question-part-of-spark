import React, { useState } from 'react';
import type { Question, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { Badge } from '../common/Badge';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';
import { QuestionRenderer } from '../questions/QuestionRenderer';

interface QuestionReviewProps {
  question: Question;
  answer?: UserAnswer;
  result?: MarkResult;
  index: number;
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({
  question,
  answer,
  result,
  index,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const marksAwarded = result?.marksAwarded ?? 0;
  const marksAvailable = question.marks;
  const isFull = marksAwarded === marksAvailable && marksAvailable > 0;
  const isPartial = marksAwarded > 0 && marksAwarded < marksAvailable;
  const isZero = marksAwarded === 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all">
      {/* Header Summary Row */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors select-none"
      >
        <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
          {/* Status Icon */}
          <div className="shrink-0">
            {isFull ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            ) : isPartial ? (
              <AlertCircle className="w-6 h-6 text-amber-500" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-500" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-bold text-xs text-slate-500 dark:text-slate-400">
                Question {index + 1}
              </span>
              <Badge variant="qualification" qualification={question.qualification} />
              <Badge variant="difficulty" difficulty={question.difficulty} />
              <Badge variant="ao" ao={question.assessmentObjective} />
            </div>

            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
              <LatexRenderer content={question.stem} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span
              className={`font-mono font-bold text-sm ${
                isFull
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isPartial
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {marksAwarded} / {marksAvailable}
            </span>
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">
              Marks
            </span>
          </div>

          <button className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expanded Details Body */}
      {isExpanded && (
        <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-700/60 space-y-5 animate-fade-in">
          {/* Render Full Question Interface in Read-Only Submitted state */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-4 leading-relaxed">
              <LatexRenderer content={question.stem} />
            </div>

            <QuestionRenderer
              question={question}
              userAnswer={answer}
              result={result}
              onAnswer={() => {}}
              isSubmitted={true}
            />
          </div>

          {/* Feedback & Explanation */}
          <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 space-y-2">
            <div className="font-bold flex items-center gap-1.5 text-indigo-700 dark:text-indigo-400">
              <Lightbulb className="w-4 h-4" />
              <span>Scientific Explanation:</span>
            </div>
            <div className="leading-relaxed">
              <LatexRenderer content={question.explanation} />
            </div>
          </div>

          {/* Common Misconceptions */}
          {question.commonMisconceptions && question.commonMisconceptions.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-xs text-amber-950 dark:text-amber-200 space-y-1.5">
              <div className="font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Common Examiner Misconceptions to Avoid:</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                {question.commonMisconceptions.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
