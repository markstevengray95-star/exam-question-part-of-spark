import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { allQuestions } from '../data/questions';
import { subjects } from '../data/subjects';
import { Badge } from '../components/common/Badge';
import { LatexRenderer } from '../components/common/LatexRenderer';
import { Modal } from '../components/common/Modal';
import { QuestionRenderer } from '../components/questions/QuestionRenderer';
import { markQuestion } from '../engine/markingEngine';
import type {
  Question,
  Qualification,
  Difficulty,
  QuestionType,
  UserAnswer,
  MarkResult,
} from '../types';
import {
  Search,
  Filter,
  Layers,
  ChevronRight,
  BookOpen,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { getDifficultyLabel, getQuestionTypeLabel } from '../utils/formatUtils';

export const QuestionBankPage: React.FC = () => {
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQual, setSelectedQual] = useState<Qualification | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedType, setSelectedType] = useState<QuestionType | 'all'>('all');

  // Preview / Interactive Try Modal
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [activeAnswer, setActiveAnswer] = useState<UserAnswer | undefined>(undefined);
  const [activeResult, setActiveResult] = useState<MarkResult | undefined>(undefined);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (selectedQual !== 'all' && q.qualification !== selectedQual) return false;
      if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
      if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
      if (selectedType !== 'all' && q.type !== selectedType) return false;
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const inStem = q.stem.toLowerCase().includes(term);
        const inTags = q.tags?.some((t: string) => t.toLowerCase().includes(term));
        if (!inStem && !inTags) return false;
      }
      return true;
    });
  }, [selectedQual, selectedSubject, selectedDifficulty, selectedType, searchTerm]);

  const handleOpenTryModal = (q: Question) => {
    setActiveQuestion(q);
    setActiveAnswer(undefined);
    setActiveResult(undefined);
    setIsSubmitted(false);
  };

  const handleCheckAnswer = () => {
    if (!activeQuestion || !activeAnswer) return;
    const res = markQuestion(activeQuestion, activeAnswer);
    setActiveResult(res);
    setIsSubmitted(true);
  };

  const handleResetModal = () => {
    setActiveAnswer(undefined);
    setActiveResult(undefined);
    setIsSubmitted(false);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Question Bank & Specification Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Explore {allQuestions.length} exam-style questions across GCSE & A-Level Science specifications.
            </p>
          </div>

          <Link
            to="/quiz/setup"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Build Custom Quiz</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search questions by keyword, topic, formula or tag (e.g. 'osmosis', 'kinetic energy', 'respiration')..."
              className="w-full pl-10 pr-4 py-2.5 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Filter Dropdowns Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {/* Qualification */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Qualification:
              </label>
              <select
                value={selectedQual}
                onChange={(e) => setSelectedQual(e.target.value as Qualification | 'all')}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium outline-none"
              >
                <option value="all">All Qualifications</option>
                <option value="gcse">GCSE</option>
                <option value="a-level">A-Level</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Subject:
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium outline-none truncate"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Difficulty:
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) =>
                  setSelectedDifficulty(
                    e.target.value === 'all' ? 'all' : (parseInt(e.target.value, 10) as Difficulty)
                  )
                }
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium outline-none"
              >
                <option value="all">All Difficulties</option>
                <option value="1">Level 1 (Foundation)</option>
                <option value="2">Level 2 (Developing)</option>
                <option value="3">Level 3 (Intermediate)</option>
                <option value="4">Level 4 (Advanced)</option>
                <option value="5">Level 5 (Challenge)</option>
              </select>
            </div>

            {/* Question Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Type:
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as QuestionType | 'all')}
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium outline-none truncate"
              >
                <option value="all">All Question Types</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="multiple-answer">Multiple Answer</option>
                <option value="calculation-single">Single Calculation</option>
                <option value="calculation-multi">Multi-Step Calculation</option>
                <option value="equation-rearrangement">Equation Rearrangement</option>
                <option value="unit-conversion">Unit Conversion</option>
                <option value="fill-blanks">Fill in Blanks</option>
                <option value="matching">Matching</option>
                <option value="sequencing">Sequencing</option>
                <option value="diagram-labelling">Diagram Labelling</option>
                <option value="graph-plotting">Graph Plotting</option>
                <option value="graph-interpretation">Graph Interpretation</option>
                <option value="data-analysis">Data Analysis</option>
                <option value="required-practical">Required Practical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredQuestions.length}</strong> questions matching criteria
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredQuestions.map((q) => (
            <div
              key={q.id}
              className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant="qualification" qualification={q.qualification} />
                    <Badge variant="difficulty" difficulty={q.difficulty} />
                    <Badge variant="marks" marks={q.marks} />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {getQuestionTypeLabel(q.type)}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 line-clamp-3 leading-relaxed">
                  <LatexRenderer content={q.stem} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {q.tags?.slice(0, 2).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenTryModal(q)}
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-bold text-xs flex items-center gap-1 transition-all"
                >
                  <span>Try Question</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-16 p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Layers className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 dark:text-slate-300">No questions found</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search keywords or clearing some filters.
            </p>
          </div>
        )}

        {/* Interactive Try Question Modal */}
        <Modal
          isOpen={!!activeQuestion}
          onClose={() => setActiveQuestion(null)}
          title={activeQuestion ? `Try Question (${getQuestionTypeLabel(activeQuestion.type)})` : ''}
          maxWidth="max-w-2xl"
        >
          {activeQuestion && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Badge variant="qualification" qualification={activeQuestion.qualification} />
                <Badge variant="difficulty" difficulty={activeQuestion.difficulty} />
                <Badge variant="marks" marks={activeQuestion.marks} />
              </div>

              <div className="text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                <LatexRenderer content={activeQuestion.stem} />
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <QuestionRenderer
                  question={activeQuestion}
                  userAnswer={activeAnswer}
                  result={activeResult}
                  onAnswer={(ans) => setActiveAnswer(ans)}
                  isSubmitted={isSubmitted}
                />
              </div>

              {isSubmitted && (
                <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-2">
                  <div className="font-bold text-sm">
                    Result: {activeResult?.marksAwarded} / {activeQuestion.marks} marks
                  </div>
                  <div>
                    <LatexRenderer content={activeQuestion.explanation} />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={handleResetModal}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>

                {!isSubmitted ? (
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md"
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveQuestion(null)}
                    className="px-6 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default QuestionBankPage;
