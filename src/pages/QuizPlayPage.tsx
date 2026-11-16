import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useQuizStore } from '../store/quizStore';
import { QuestionRenderer } from '../components/questions/QuestionRenderer';
import { ProgressBar } from '../components/common/ProgressBar';
import { Timer } from '../components/common/Timer';
import { Badge } from '../components/common/Badge';
import { LatexRenderer } from '../components/common/LatexRenderer';
import { Modal } from '../components/common/Modal';
import {
  ArrowLeft,
  ArrowRight,
  Send,
  Lightbulb,
  Grid,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export const QuizPlayPage: React.FC = () => {
  const navigate = useNavigate();

  const questions = useQuizStore((s) => s.questions);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const answers = useQuizStore((s) => s.answers);
  const config = useQuizStore((s) => s.config);
  const startTime = useQuizStore((s) => s.startTime);
  const isPaused = useQuizStore((s) => s.isPaused);
  const hintsUsed = useQuizStore((s) => s.hintsUsed);

  const answerQuestion = useQuizStore((s) => s.answerQuestion);
  const nextQuestion = useQuizStore((s) => s.nextQuestion);
  const prevQuestion = useQuizStore((s) => s.prevQuestion);
  const useHint = useQuizStore((s) => s.useHint);
  const submitQuiz = useQuizStore((s) => s.submitQuiz);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);

  // If no quiz active, redirect to setup
  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">No active quiz session found.</h2>
          <button
            onClick={() => navigate('/quiz/setup')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold shadow-md"
          >
            Go to Quiz Setup
          </button>
        </div>
      </Layout>
    );
  }

  const currentQ = questions[currentIndex];
  const currentAnswer = answers[currentQ.id];
  const totalCount = questions.length;
  const progressPercent = ((currentIndex + 1) / totalCount) * 100;
  const hintsCount = hintsUsed[currentQ.id] || 0;
  const availableHints = currentQ.hints || [];

  const handleTimeUp = () => {
    submitQuiz();
    navigate('/quiz/results');
  };

  const handleSubmit = () => {
    submitQuiz();
    navigate('/quiz/results');
  };

  // Check how many questions are answered
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalCount - answeredCount;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Bar: Progress, Timer, Grid */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Question {currentIndex + 1} of {totalCount}
              </span>
              <Badge variant="qualification" qualification={currentQ.qualification} />
              <Badge variant="difficulty" difficulty={currentQ.difficulty} />
              <Badge variant="marks" marks={currentQ.marks} />
            </div>

            <div className="flex items-center gap-3">
              {config?.timeLimit && (
                <Timer
                  totalSeconds={config.timeLimit}
                  startTime={startTime}
                  isPaused={isPaused}
                  onTimeUp={handleTimeUp}
                />
              )}

              <button
                type="button"
                onClick={() => setIsReviewModalOpen(true)}
                title="Question Navigator Grid"
                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1.5"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Overview ({answeredCount}/{totalCount})</span>
              </button>
            </div>
          </div>

          <ProgressBar progress={progressPercent} showPercentage={false} />
        </div>

        {/* Question Card */}
        <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          {/* Question Stem */}
          <div className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            <LatexRenderer content={currentQ.stem} />
          </div>

          {/* Interactive Question Component */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <QuestionRenderer
              question={currentQ}
              userAnswer={currentAnswer}
              onAnswer={(ans) => answerQuestion(currentQ.id, ans)}
              isSubmitted={false}
            />
          </div>

          {/* Progressive Hints Section */}
          {config?.showHints && availableHints.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  disabled={hintsCount >= availableHints.length}
                  onClick={() => useHint(currentQ.id)}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 disabled:opacity-40"
                >
                  <Lightbulb className="w-4 h-4" />
                  <span>
                    {hintsCount < availableHints.length
                      ? `Reveal Hint (${hintsCount + 1}/${availableHints.length})`
                      : 'All Hints Revealed'}
                  </span>
                </button>
              </div>

              {hintsCount > 0 && (
                <div className="space-y-2">
                  {availableHints.slice(0, hintsCount).map((hint, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200/80 dark:border-amber-900 text-xs text-amber-900 dark:text-amber-200 leading-relaxed"
                    >
                      <strong className="block mb-0.5">Hint {idx + 1}:</strong>
                      <LatexRenderer content={hint} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={prevQuestion}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIndex < totalCount - 1 ? (
              <button
                type="button"
                onClick={nextQuestion}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmSubmitOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>Submit & View Results</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal: Overview Grid */}
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="Quiz Questions Overview"
        >
          <div className="space-y-4">
            <div className="text-xs text-slate-500">
              Click any question number to jump directly to it:
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
              {questions.map((q, idx) => {
                const isAnswered = !!answers[q.id];
                const isCurrent = idx === currentIndex;

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      useQuizStore.setState({ currentIndex: idx });
                      setIsReviewModalOpen(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-bold border-2 transition-all flex flex-col items-center justify-center ${
                      isCurrent
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-400'
                        : isAnswered
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    <span className="text-[9px] font-normal">{q.marks}m</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Modal>

        {/* Modal: Confirm Submit */}
        <Modal
          isOpen={isConfirmSubmitOpen}
          onClose={() => setIsConfirmSubmitOpen(false)}
          title="Submit Quiz & Grade Answers"
        >
          <div className="space-y-5 text-sm">
            {unansweredCount > 0 ? (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Unanswered Questions Remaining:</strong>
                  You have not answered {unansweredCount} out of {totalCount} questions. Unanswered questions will receive 0 marks.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">All questions answered!</strong>
                  Ready to calculate your score, breakdown marks, and reveal mark schemes?
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsConfirmSubmitOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Keep Revising
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md hover:bg-indigo-700"
              >
                Submit Now
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default QuizPlayPage;
