import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { QuizCard } from '../components/quiz/QuizCard';
import { subjects } from '../data/subjects';
import { allQuestions } from '../data/questions';
import { useQuizStore } from '../store/quizStore';
import { randomiseQuestion } from '../engine/randomiser';
import type {
  QuizMode,
  QuizConfig,
  Difficulty,
  QuestionType,
  Qualification,
  Question,
} from '../types';
import { Play, Sparkles, Filter, Sliders, CheckSquare, Clock } from 'lucide-react';
import { getDifficultyLabel, getQuestionTypeLabel } from '../utils/formatUtils';

export const QuizSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const startQuiz = useQuizStore((s) => s.startQuiz);

  // Initial params
  const paramSubject = searchParams.get('subject');
  const paramMode = (searchParams.get('mode') as QuizMode) || 'practice';

  // Config State
  const [mode, setMode] = useState<QuizMode>(paramMode);
  const [selectedQual, setSelectedQual] = useState<Qualification | 'all'>('all');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(
    paramSubject ? [paramSubject] : ['gcse-combined-science']
  );
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedDifficulties, setSelectedDifficulties] = useState<Difficulty[]>([1, 2, 3, 4, 5]);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>([]);
  const [questionCount, setQuestionCount] = useState<number>(mode === 'quick-fire' ? 10 : 15);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(15);
  const [showHints, setShowHints] = useState<boolean>(true);
  const [showExplanations, setShowExplanations] = useState<boolean>(true);

  // Available topics based on selected subjects
  const availableSubjects = subjects.filter(
    (s) => selectedQual === 'all' || s.qualification === selectedQual
  );

  const availableTopics = subjects
    .filter((s) => selectedSubjects.includes(s.id))
    .flatMap((s) => s.topics);

  // Match questions count
  const matchingQuestions = allQuestions.filter((q) => {
    if (selectedQual !== 'all' && q.qualification !== selectedQual) return false;
    if (selectedSubjects.length > 0 && !selectedSubjects.includes(q.subjectId)) return false;
    if (selectedTopics.length > 0 && !selectedTopics.includes(q.topicId)) return false;
    if (selectedTypes.length > 0 && !selectedTypes.includes(q.type)) return false;
    if (selectedDifficulties.length > 0 && !selectedDifficulties.includes(q.difficulty)) return false;
    return true;
  });

  const handleSubjectToggle = (subjId: string) => {
    setSelectedTopics([]);
    setSelectedSubjects((prev) =>
      prev.includes(subjId) ? prev.filter((id) => id !== subjId) : [...prev, subjId]
    );
  };

  const handleTopicToggle = (topId: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topId) ? prev.filter((id) => id !== topId) : [...prev, topId]
    );
  };

  const handleDifficultyToggle = (diff: Difficulty) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  const handleStart = () => {
    if (matchingQuestions.length === 0) return;
    const current = useQuizStore.getState();
    if (current.id && !current.isComplete && !window.confirm('Start a new quiz? Your unfinished quiz will be replaced.')) return;
    const pool = [...matchingQuestions];
    for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [pool[i],pool[j]]=[pool[j],pool[i]]; }

    // Slice to count
    const selected = pool.slice(0, Math.min(questionCount, pool.length));

    // Randomise calculations if appropriate
    const randomised = selected.map((q) => randomiseQuestion(q));

    const config: QuizConfig = {
      mode,
      questionCount: randomised.length,
      subjectIds: selectedSubjects,
      topicIds: selectedTopics,
      difficulties: selectedDifficulties,
      questionTypes: selectedTypes,
      timeLimit: mode === 'timed-exam' ? timeLimitMinutes * 60 : undefined,
      showHints: mode !== 'timed-exam' && showHints,
      showExplanations,
      randomiseOrder: true,
    };

    startQuiz(config, randomised);
    navigate('/quiz/play');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        {/* Title */}
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Custom Quiz & Exam Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure your revision session by subject, topics, exam challenge format, and difficulty.
          </p>
        </div>

        {/* 1. Quiz Mode Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            1. Select Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuizCard
              mode="practice"
              title="Practice Mode"
              description="Untimed revision with hints and feedback after submission."
              badgeText="Flexible"
              selected={mode === 'practice'}
              onClick={() => {
                setMode('practice');
                setQuestionCount(10);
              }}
            />
            <QuizCard
              mode="quick-fire"
              title="Quick Fire"
              description="Rapid recall quiz covering key definitions, MCQs and calculations."
              badgeText="10 Questions"
              selected={mode === 'quick-fire'}
              onClick={() => {
                setMode('quick-fire');
                setQuestionCount(10);
              }}
            />
            <QuizCard
              mode="topic-test"
              title="Topic Mastery"
              description="In-depth assessment targeting specific curriculum modules."
              badgeText="Targeted"
              selected={mode === 'topic-test'}
              onClick={() => {
                setMode('topic-test');
                setQuestionCount(15);
              }}
            />
            <QuizCard
              mode="timed-exam"
              title="Exam Challenge"
              description="Strict countdown timer simulating real AQA exam conditions."
              badgeText="Timed"
              selected={mode === 'timed-exam'}
              onClick={() => {
                setMode('timed-exam');
                setQuestionCount(20);
              }}
            />
          </div>
        </div>

        {/* 2. Qualification & Subject Selection */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              2. Qualification & Subjects
            </span>
            <div className="flex gap-1.5">
              {(['all', 'gcse', 'a-level'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => { setSelectedQual(q); setSelectedSubjects(prev => prev.filter(id => q === 'all' || subjects.some(s => s.id === id && s.qualification === q))); setSelectedTopics([]); }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    selectedQual === q
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {q === 'all' ? 'All Specs' : q}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {availableSubjects.map((sub) => {
              const isSelected = selectedSubjects.includes(sub.id);
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => handleSubjectToggle(sub.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 font-bold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-indigo-300'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs truncate">{sub.name}</div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">
                      {sub.topics.length} topics
                    </span>
                  </div>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-600 text-white'
                        : 'border-slate-300 dark:border-slate-600'
                    }`}
                  >
                    {isSelected && <span className="text-[10px]">✓</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Topics Sub-Filter */}
          {availableTopics.length > 0 && (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Filter by Specific Topics ({selectedTopics.length > 0 ? `${selectedTopics.length} selected` : 'All topics included'}):
                </span>
                {selectedTopics.length > 0 && (
                  <button
                    onClick={() => setSelectedTopics([])}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline text-[11px]"
                  >
                    Clear topic filters
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                {availableTopics.map((top) => {
                  const isTopSelected = selectedTopics.includes(top.id);
                  return (
                    <button
                      key={top.id}
                      type="button"
                      onClick={() => handleTopicToggle(top.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        isTopSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      }`}
                    >
                      {top.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <section className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"><div className="flex items-center justify-between gap-2"><h2 className="text-sm font-bold">Question formats</h2><button type="button" onClick={()=>setSelectedTypes([])} className="text-xs text-indigo-600 dark:text-indigo-400">Clear</button></div><p className="text-xs text-slate-500">Choose specific formats, or leave all available. Select calculation formats to practise equations and numerical skills.</p><div className="flex flex-wrap gap-2">{Array.from(new Set(allQuestions.map(q=>q.type))).sort().map(type=><button type="button" key={type} aria-pressed={selectedTypes.includes(type)} onClick={()=>setSelectedTypes(prev=>prev.includes(type)?prev.filter(t=>t!==type):[...prev,type])} className={'px-3 py-2 rounded-lg border text-xs font-semibold '+(selectedTypes.includes(type)?'bg-indigo-600 border-indigo-600 text-white':'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300')}>{getQuestionTypeLabel(type)}</button>)}</div></section>
        {/* 3. Difficulties & Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Levels */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              3. Difficulty Levels
            </span>
            <div className="space-y-2">
              {([1, 2, 3, 4, 5] as Difficulty[]).map((d) => {
                const isSelected = selectedDifficulties.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => handleDifficultyToggle(d)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <span>Level {d} — {getDifficultyLabel(d)}</span>
                    <span className="text-xs">{isSelected ? '✓' : ''}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quiz Length & Parameters */}
          <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                4. Quiz Size & Parameters
              </span>

              {/* Question Count Slider */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span>Number of Questions:</span>
                  <span className="font-mono text-base font-bold text-indigo-600">{questionCount}</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value, 10))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Time Limit for timed mode */}
              {mode === 'timed-exam' && (
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Time Limit:</span>
                    <span className="font-mono font-bold text-rose-600">{timeLimitMinutes} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={timeLimitMinutes}
                    onChange={(e) => setTimeLimitMinutes(parseInt(e.target.value, 10))}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={mode === 'timed-exam'}
                    checked={showHints && mode !== 'timed-exam'}
                    onChange={(e) => setShowHints(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Allow Progressive Hints</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showExplanations}
                    onChange={(e) => setShowExplanations(e.target.checked)}
                    className="rounded accent-indigo-600"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">Show Model Solutions & Mark Schemes</span>
                </label>
              </div>
            </div>

            {/* Matching Count Preview & Launch Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="text-xs text-slate-500 mb-3 text-center">
                <strong>{matchingQuestions.length}</strong> matching questions in question bank
                {matchingQuestions.length < questionCount && <p className="mt-1 text-amber-700 dark:text-amber-300">{matchingQuestions.length ? 'Only the available matching questions will be used.' : 'No questions match. Change the filters to continue.'}</p>}
              </div>

              <button
                type="button"
                onClick={handleStart}
                disabled={matchingQuestions.length === 0}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg shadow-indigo-500/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Start Revision Quiz ({Math.min(questionCount, matchingQuestions.length)} Questions)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizSetupPage;
