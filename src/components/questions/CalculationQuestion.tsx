import React, { useState } from 'react';
import type {
  SingleCalculationQuestion,
  MultiStepCalculationQuestion,
  UserAnswer,
  MarkResult,
} from '../../types';
import { LatexRenderer } from '../common/LatexRenderer';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  question: SingleCalculationQuestion | MultiStepCalculationQuestion;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const CalculationQuestion: React.FC<Props> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  const isMulti = question.type === 'calculation-multi';
  const [workingOut, setWorkingOut] = useState<string>(userAnswer?.workingOut || '');
  const [showFormula, setShowFormula] = useState(false);

  // Single step calculation value
  const numericVal = userAnswer?.numericAnswer !== undefined ? String(userAnswer.numericAnswer) : '';

  // Multi-step answers map
  const subAnswers = (userAnswer?.subAnswers as Record<string, UserAnswer>) || {};

  const handleSingleChange = (valStr: string) => {
    if (isSubmitted) return;
    const num = parseFloat(valStr);
    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: isNaN(num) ? valStr : num,
      numericAnswer: isNaN(num) ? undefined : num,
      workingOut,
    });
  };

  const handleStepChange = (stepId: string, valStr: string) => {
    if (isSubmitted) return;
    const num = parseFloat(valStr);
    const updatedSubAnswers = {
      ...subAnswers,
      [stepId]: {
        questionId: stepId,
        timestamp: Date.now(),
        value: isNaN(num) ? valStr : num,
        numericAnswer: isNaN(num) ? undefined : num,
      },
    };

    onAnswer({
      questionId: question.id,
      timestamp: Date.now(),
      value: updatedSubAnswers,
      subAnswers: updatedSubAnswers,
      workingOut,
    });
  };

  const handleWorkingChange = (text: string) => {
    setWorkingOut(text);
    if (!isSubmitted) {
      onAnswer({
        ...(userAnswer || {
          questionId: question.id,
          timestamp: Date.now(),
          value: null,
        }),
        workingOut: text,
      });
    }
  };

  return (
    <div className="space-y-5">
      {/* Formula Reference (Collapsible or visible) */}
      {!isMulti && (question as SingleCalculationQuestion).equation && (
        <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] text-indigo-600 dark:text-indigo-400">Equation:</span>
            <LatexRenderer content={`$${(question as SingleCalculationQuestion).equation}$`} />
          </div>
          {question.significantFigures && (
            <span className="text-slate-500 font-medium">
              Give answer to {question.significantFigures} sig figs
            </span>
          )}
        </div>
      )}

      {/* Answer Inputs */}
      {!isMulti ? (
        // Single Step
        <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border-2 border-slate-200 dark:border-slate-700 space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            Final Answer:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              step="any"
              disabled={isSubmitted}
              value={numericVal}
              onChange={(e) => handleSingleChange(e.target.value)}
              placeholder="0.00"
              className="px-4 py-2 text-lg font-mono font-bold rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 w-48 shadow-inner"
            />
            <span className="font-semibold text-slate-600 dark:text-slate-300">
              {question.unit}
            </span>
            {isSubmitted && result && (
              <span className="flex items-center gap-1 font-semibold text-sm">
                {result.isCorrect ? (
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-5 h-5" /> Correct (+{result.marksAwarded}m)
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center gap-1">
                    <XCircle className="w-5 h-5" /> Expected {question.expectedAnswer} {question.unit}
                  </span>
                )}
              </span>
            )}
          </div>
        </div>
      ) : (
        // Multi-Step Calculation
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Multi-step calculation (partial marks awarded for intermediate steps):
          </div>
          {(question as MultiStepCalculationQuestion).steps.map((step, idx) => {
            const stepVal = subAnswers[step.id]?.numericAnswer !== undefined
              ? String(subAnswers[step.id]?.numericAnswer)
              : '';
            const stepFeedback = result?.detailedFeedback?.find((f) => f.stepId === step.id);

            return (
              <div
                key={step.id}
                className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    Step {idx + 1}: {step.description}
                  </span>
                  <span className="text-slate-500 font-medium">[{step.marks} mark]</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="any"
                    disabled={isSubmitted}
                    value={stepVal}
                    onChange={(e) => handleStepChange(step.id, e.target.value)}
                    placeholder="Enter step result"
                    className="px-3 py-1.5 text-sm font-mono font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:border-indigo-500 w-44"
                  />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                    {step.unit}
                  </span>

                  {isSubmitted && stepFeedback && (
                    <span className="text-xs font-semibold">
                      {stepFeedback.correct ? (
                        <span className="text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> (+{stepFeedback.marksAwarded}m)
                        </span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> (Ans: {step.expectedAnswer})
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Working Out scratchpad area */}
      <div>
        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
          Working out / rough calculations (optional notes):
        </label>
        <textarea
          rows={2}
          value={workingOut}
          onChange={(e) => handleWorkingChange(e.target.value)}
          placeholder="Show intermediate values or formulae used..."
          className="w-full p-2.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-slate-200 outline-none"
        />
      </div>

      {/* Worked Solution on submission */}
      {isSubmitted && question.workedSolution && (
        <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
          <div className="font-bold flex items-center gap-2">
            <span>Detailed Worked Solution:</span>
          </div>
          <div className="whitespace-pre-line leading-relaxed font-mono">
            <LatexRenderer content={question.workedSolution} />
          </div>
        </div>
      )}
    </div>
  );
};
