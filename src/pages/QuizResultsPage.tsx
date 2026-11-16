import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useQuizStore } from '../store/quizStore';
import { ResultsChart } from '../components/quiz/ResultsChart';
import { QuestionReview } from '../components/quiz/QuestionReview';
import { formatTime, getGradeFromPercentage } from '../utils/formatUtils';
import {
  Trophy,
  RotateCcw,
  PlusCircle,
  Clock,
  Award,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react';

export const QuizResultsPage: React.FC = () => {
  const navigate = useNavigate();

  const questions = useQuizStore((s) => s.questions);
  const answers = useQuizStore((s) => s.answers);
  const results = useQuizStore((s) => s.results);
  const calculateResults = useQuizStore((s) => s.calculateResults);
  const isComplete = useQuizStore(s => s.isComplete);
  const config = useQuizStore(s => s.config);
  const [reviewFilter, setReviewFilter] = React.useState<'all' | 'incorrect'>('all');
  const retryIncorrect = useQuizStore((s) => s.retryIncorrect);

  // If no results, compute them or redirect
  if (!questions || questions.length === 0) {
    return (
      <Layout>
        <div className="text-center py-20 space-y-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">
            No completed quiz found.
          </h2>
          <button
            onClick={() => navigate('/quiz/setup')}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold"
          >
            Start a Quiz
          </button>
        </div>
      </Layout>
    );
  }

  if (!isComplete) return <Navigate to="/quiz/play" replace />;
  const quizResults = calculateResults();
  const percentage = Math.round(quizResults.percentage * 100);
  const qual = questions[0]?.qualification || 'gcse';
  const grade = questions.every(q => q.qualification === qual) && !questions.some(q => q.subjectId === 'gcse-combined-science') ? getGradeFromPercentage(quizResults.percentage, qual) : '—';
  const incorrectCount = quizResults.incorrectQuestionIds.length;

  const handleRetry = () => {
    retryIncorrect();
    navigate('/quiz/play');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        {/* Results Hero Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 rounded-3xl text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-purple-200">
                <Trophy className="w-3.5 h-3.5" />
                <span>Quiz Completed</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Exam Performance Breakdown
              </h1>
              <p className="text-purple-200 text-xs sm:text-sm max-w-lg">
                Practice marks using SPARK's built-in marking rules. Grade estimates are indicative only, not official AQA boundaries.
              </p>
            </div>

            {/* Score Pill / Circle */}
            <div className="flex items-center gap-6">
              <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="block text-4xl sm:text-5xl font-mono font-black tracking-tight">
                  {percentage}%
                </span>
                <span className="text-xs uppercase font-bold text-purple-200">
                  {quizResults.totalMarks} / {quizResults.maxMarks} Marks
                </span>
              </div>

              <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <span className="block text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-300">
                  {grade}
                </span>
                <span className="text-xs uppercase font-bold text-purple-200">
                  Grade Est.
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="mt-6 pt-5 border-t border-white/15 grid grid-cols-3 gap-4 text-center text-xs">
            <div>
              <span className="text-purple-300 block">Time Spent</span>
              <strong className="text-sm font-mono">{formatTime(quizResults.timeTaken)}</strong>
            </div>
            <div>
              <span className="text-purple-300 block">Questions Completed</span>
              <strong className="text-sm">{Object.keys(answers).length} / {questions.length}</strong>
            </div>
            <div>
              <span className="text-purple-300 block">Marks Accuracy</span>
              <strong className="text-sm">
                {quizResults.totalMarks} / {quizResults.maxMarks} ({percentage}%)
              </strong>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {incorrectCount > 0 && (
              <button
                type="button"
                onClick={handleRetry}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Incorrect Questions ({incorrectCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate('/quiz/setup')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Configure New Quiz</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate('/questions')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-semibold text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <Layers className="w-4 h-4" />
            <span>Browse Question Bank</span>
          </button>
        </div>

        {/* Recharts Graphical Visualisations */}
        <ResultsChart
          topicBreakdown={quizResults.topicBreakdown}
          difficultyBreakdown={quizResults.difficultyBreakdown}
          typeBreakdown={quizResults.typeBreakdown}
        />

        {/* Question by Question Detailed Review */}
        {config?.showExplanations !== false && <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Detailed Question Review & Model Solutions
            </h3>
            <span className="text-xs text-slate-500">
              Click any question to view mark schemes & examiner tips
            </span>
          </div>

          <div className="flex gap-2">{(['all','incorrect'] as const).map(v=><button type="button" key={v} aria-pressed={reviewFilter===v} onClick={()=>setReviewFilter(v)} className={'rounded-lg px-3 py-2 text-xs font-semibold '+(reviewFilter===v?'bg-indigo-600 text-white':'bg-slate-100 dark:bg-slate-800')}>{v==='all'?'All questions':'Needs practice ('+incorrectCount+')'}</button>)}</div>
          <div className="space-y-3">
            {reviewFilter === 'incorrect' && incorrectCount===0 && <p className="text-sm text-slate-500">All questions achieved full marks.</p>}
            {questions.map((q, idx) => (reviewFilter === 'incorrect' && !quizResults.incorrectQuestionIds.includes(q.id)) ? null : (
              <QuestionReview
                key={q.id}
                question={q}
                answer={answers[q.id]}
                result={results[q.id]}
                index={idx}
              />
            ))}
          </div>
        </div>}
      </div>
    </Layout>
  );
};

export default QuizResultsPage;
