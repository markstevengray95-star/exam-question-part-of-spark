import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Question,
  QuizConfig,
  QuizResults,
  UserAnswer,
  MarkResult,
  TopicPerformance,
  DifficultyPerformance,
  TypePerformance,
  Difficulty,
  QuestionType,
} from '../types';
import { markQuiz } from '../engine/markingEngine';
import { subjects } from '../data/subjects';

// ─── State Shape ──────────────────────────────────────────────────
interface QuizStoreState {
  // Core quiz state
  id: string | null;
  config: QuizConfig | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, UserAnswer>;
  results: Record<string, MarkResult>;
  startTime: number;
  endTime: number | undefined;
  isComplete: boolean;
  isPaused: boolean;
  hintsUsed: Record<string, number>;
  flagged: string[];
  toggleFlag: (id: string) => void;

  // Computed getters
  currentQuestion: () => Question | null;
  progress: () => number;
  timeRemaining: () => number | null;

  // Actions
  startQuiz: (config: QuizConfig, questions: Question[]) => void;
  answerQuestion: (questionId: string, answer: UserAnswer) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  submitQuiz: () => QuizResults;
  useHint: (questionId: string) => void;
  pauseQuiz: () => void;
  resumeQuiz: () => void;
  retryIncorrect: () => void;
  resetQuiz: () => void;
  calculateResults: () => QuizResults;
}

// Helper: generate a simple unique ID
function generateId(): string {
  return `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// Helper: resolve topic name from the subjects data
function resolveTopicName(topicId: string): string {
  for (const subject of subjects) {
    for (const topic of subject.topics) {
      if (topic.id === topicId) return topic.name;
    }
  }
  return topicId;
}

// ─── Store ────────────────────────────────────────────────────────
export const useQuizStore = create<QuizStoreState>()(persist((set, get) => ({
  // Initial state
  id: null,
  config: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  results: {},
  startTime: 0,
  endTime: undefined,
  isComplete: false,
  isPaused: false,
  hintsUsed: {},
  flagged: [],
  toggleFlag: (id) => set(s => ({ flagged: s.flagged.includes(id) ? s.flagged.filter(x => x !== id) : [...s.flagged, id] })),

  // ── Computed getters ───────────────────────────────────────────

  currentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] ?? null;
  },

  progress: () => {
    const { questions, answers } = get();
    if (questions.length === 0) return 0;
    return Object.keys(answers).length / questions.length;
  },

  timeRemaining: () => {
    const { config, startTime, isPaused, endTime } = get();
    if (!config?.timeLimit) return null;
    if (endTime) return 0;

    const elapsed = isPaused
      ? 0
      : Math.floor((Date.now() - startTime) / 1000);
    const remaining = config.timeLimit - elapsed;
    return Math.max(0, remaining);
  },

  // ── Actions ────────────────────────────────────────────────────

  startQuiz: (config: QuizConfig, questions: Question[]) => {
    const orderedQuestions = [...questions];
    if (config.randomiseOrder) for (let i = orderedQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [orderedQuestions[i], orderedQuestions[j]] = [orderedQuestions[j], orderedQuestions[i]];
    }

    set({
      id: generateId(),
      config,
      questions: orderedQuestions,
      currentIndex: 0,
      answers: {},
      results: {},
      startTime: Date.now(),
      endTime: undefined,
      isComplete: false,
      isPaused: false,
      hintsUsed: {},
      flagged: [],
    });
  },

  answerQuestion: (questionId: string, answer: UserAnswer) => {
    if (get().isComplete) return;
    set((state) => ({
      results: {},
      answers: {
        ...state.answers,
        [questionId]: {
          ...answer,
          questionId,
          timestamp: Date.now(),
        },
      },
    }));
  },

  nextQuestion: () => {
    set((state) => ({
      currentIndex: Math.min(state.currentIndex + 1, state.questions.length - 1),
    }));
  },

  prevQuestion: () => {
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    }));
  },

  submitQuiz: () => {
    if (get().isComplete) return get().calculateResults();
    const { questions, answers } = get();
    set({ results: markQuiz(questions, answers), isComplete: true, endTime: Date.now() });
    return get().calculateResults();
  },

  useHint: (questionId: string) => {
    set((state) => ({
      hintsUsed: {
        ...state.hintsUsed,
        [questionId]: (state.hintsUsed[questionId] ?? 0) + 1,
      },
    }));
  },

  pauseQuiz: () => {
    set({ isPaused: true });
  },

  resumeQuiz: () => {
    set({ isPaused: false });
  },

  retryIncorrect: () => {
    const { questions, results } = get();

    // Filter to only questions that were incorrect or partially correct
    const incorrectQuestions = questions.filter((q) => {
      const result = results[q.id];
      return result && !result.isCorrect;
    });

    if (incorrectQuestions.length === 0) return;

    set({
      config: get().config ? { ...get().config!, questionCount: incorrectQuestions.length, mode: 'practice', timeLimit: undefined } : null,
      id: generateId(),
      questions: incorrectQuestions,
      currentIndex: 0,
      answers: {},
      results: {},
      startTime: Date.now(),
      endTime: undefined,
      isComplete: false,
      isPaused: false,
      hintsUsed: {},
      flagged: [],
    });
  },

  resetQuiz: () => {
    set({
      id: null,
      config: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      results: {},
      startTime: 0,
      endTime: undefined,
      isComplete: false,
      isPaused: false,
      hintsUsed: {},
      flagged: [],
    });
  },

  calculateResults: (): QuizResults => {
    const { id, questions, answers, startTime, endTime, results: existingResults } = get();

    // Mark all questions
    const markResults =
      Object.keys(existingResults).length > 0
        ? existingResults
        : markQuiz(questions, answers);

    // Pure calculation: never update the store while rendering results.

    // Compute totals
    let totalMarks = 0;
    let maxMarks = 0;
    const questionResults: MarkResult[] = [];
    const incorrectQuestionIds: string[] = [];

    for (const q of questions) {
      const result = markResults[q.id];
      if (result) {
        totalMarks += result.marksAwarded;
        maxMarks += result.marksAvailable;
        questionResults.push(result);
        if (!result.isCorrect) {
          incorrectQuestionIds.push(q.id);
        }
      }
    }

    const percentage = maxMarks > 0 ? (totalMarks / maxMarks) : 0;
    const timeTaken = Math.max(0, Math.floor(((endTime ?? Date.now()) - startTime) / 1000));

    // ── Topic breakdown ──────────────────────────────────────────
    const topicMap = new Map<string, { marks: number; maxMarks: number }>();
    for (const q of questions) {
      const result = markResults[q.id];
      if (!result) continue;
      const existing = topicMap.get(q.topicId) ?? { marks: 0, maxMarks: 0 };
      existing.marks += result.marksAwarded;
      existing.maxMarks += result.marksAvailable;
      topicMap.set(q.topicId, existing);
    }
    const topicBreakdown: TopicPerformance[] = Array.from(topicMap.entries()).map(
      ([topicId, data]) => ({
        topicId,
        topicName: resolveTopicName(topicId),
        marks: data.marks,
        maxMarks: data.maxMarks,
        percentage: data.maxMarks > 0 ? (data.marks / data.maxMarks) : 0,
      })
    );

    // ── Difficulty breakdown ─────────────────────────────────────
    const diffMap = new Map<Difficulty, { marks: number; maxMarks: number }>();
    for (const q of questions) {
      const result = markResults[q.id];
      if (!result) continue;
      const existing = diffMap.get(q.difficulty) ?? { marks: 0, maxMarks: 0 };
      existing.marks += result.marksAwarded;
      existing.maxMarks += result.marksAvailable;
      diffMap.set(q.difficulty, existing);
    }
    const difficultyBreakdown: DifficultyPerformance[] = Array.from(
      diffMap.entries()
    ).map(([difficulty, data]) => ({
      difficulty,
      marks: data.marks,
      maxMarks: data.maxMarks,
      percentage: data.maxMarks > 0 ? (data.marks / data.maxMarks) : 0,
    }));

    // ── Type breakdown ───────────────────────────────────────────
    const typeMap = new Map<QuestionType, { marks: number; maxMarks: number }>();
    for (const q of questions) {
      const result = markResults[q.id];
      if (!result) continue;
      const existing = typeMap.get(q.type) ?? { marks: 0, maxMarks: 0 };
      existing.marks += result.marksAwarded;
      existing.maxMarks += result.marksAvailable;
      typeMap.set(q.type, existing);
    }
    const typeBreakdown: TypePerformance[] = Array.from(typeMap.entries()).map(
      ([type, data]) => ({
        type,
        marks: data.marks,
        maxMarks: data.maxMarks,
        percentage: data.maxMarks > 0 ? (data.marks / data.maxMarks) : 0,
      })
    );

    return {
      quizId: id ?? 'unknown',
      totalMarks,
      maxMarks,
      percentage,
      timeTaken,
      questionResults,
      topicBreakdown,
      difficultyBreakdown,
      typeBreakdown,
      incorrectQuestionIds,
    };
  },
}), { name: 'spark-exam-session-v1', partialize: s => ({ id: s.id, config: s.config, questions: s.questions, currentIndex: s.currentIndex, answers: s.answers, results: s.results, startTime: s.startTime, endTime: s.endTime, isComplete: s.isComplete, isPaused: s.isPaused, hintsUsed: s.hintsUsed, flagged: s.flagged }) }));
