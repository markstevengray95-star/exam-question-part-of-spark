import React from 'react';
import type { RequiredPracticalQuestion as RPQType, UserAnswer, MarkResult } from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { Beaker, ShieldAlert } from 'lucide-react';

interface Props {
  question: RPQType;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const RequiredPracticalQuestion: React.FC<Props> = ({
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
      {/* Required Practical Banner */}
      <div className="p-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 rounded-2xl border border-teal-200 dark:border-teal-900 flex items-start gap-3">
        <div className="p-2 bg-teal-500 text-white rounded-xl shrink-0">
          <Beaker className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            AQA Required Practical #{question.practicalNumber}
          </div>
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            {question.practicalTitle}
          </h4>
          {question.apparatus && question.apparatus.length > 0 && (
            <div className="mt-2 text-xs text-slate-600 dark:text-slate-300">
              <strong className="text-slate-700 dark:text-slate-200">Key Apparatus: </strong>
              {question.apparatus.join(', ')}
            </div>
          )}
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

              {sq.type === 'multiple-choice' && sq.options && (
                <div className="space-y-2">
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
                        className={`w-full p-2.5 rounded-lg border text-left text-xs font-medium transition-all ${
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
                    placeholder="Write your practical procedure or analysis here..."
                    className="w-full p-2.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                  {isSubmitted && sq.modelAnswer && (
                    <div className="mt-2 p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg text-[11px] text-emerald-900 dark:text-emerald-200">
                      <strong>Model Answer:</strong> <LatexRenderer content={sq.modelAnswer} />
                    </div>
                  )}
                </div>
              )}

              {sq.type === 'fill-blanks' && sq.blanks && (
                <div>
                  <input
                    type="text"
                    disabled={isSubmitted}
                    value={subAns?.textAnswer || ''}
                    onChange={(e) =>
                      handleSubAnswer(sq.id, e.target.value, { textAnswer: e.target.value })
                    }
                    placeholder="Enter answer..."
                    className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                  />
                  {isSubmitted && sq.blanks[0] && (
                    <span className="ml-2 text-xs font-semibold text-emerald-600">
                      (Expected: {sq.blanks[0].acceptableAnswers[0]})
                    </span>
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
