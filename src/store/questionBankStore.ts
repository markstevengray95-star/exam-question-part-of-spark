import { create } from 'zustand';
import type {
  Question,
  QuestionFilter,
  Qualification,
  Difficulty,
  QuestionType,
  AssessmentObjective,
} from '../types';
import { allQuestions } from '../data/questions';

// ─── State Shape ──────────────────────────────────────────────────
interface QuestionBankState {
  allQuestions: Question[];
  filters: QuestionFilter;
  filteredQuestions: Question[];
  isLoaded: boolean;

  // Actions
  loadQuestions: () => void;
  setFilters: (partial: Partial<QuestionFilter>) => void;
  clearFilters: () => void;

  // Getters
  getFilteredQuestions: () => Question[];
  getQuestionsByTopic: (topicId: string) => Question[];
  getRandomQuestions: (count: number, filter?: Partial<QuestionFilter>) => Question[];
}

// ─── Default filter (nothing selected = show all) ─────────────────
const defaultFilter: QuestionFilter = {
  qualifications: [],
  subjectIds: [],
  topicIds: [],
  subtopicIds: [],
  difficulties: [],
  questionTypes: [],
  assessmentObjectives: [],
  searchTerm: '',
};

// ─── Filtering logic ──────────────────────────────────────────────
function applyFilters(questions: Question[], filters: QuestionFilter): Question[] {
  return questions.filter((q) => {
    // Qualification filter
    if (
      filters.qualifications.length > 0 &&
      !filters.qualifications.includes(q.qualification as Qualification)
    ) {
      return false;
    }

    // Subject filter
    if (
      filters.subjectIds.length > 0 &&
      !filters.subjectIds.includes(q.subjectId)
    ) {
      return false;
    }

    // Topic filter
    if (
      filters.topicIds.length > 0 &&
      !filters.topicIds.includes(q.topicId)
    ) {
      return false;
    }

    // Subtopic filter
    if (
      filters.subtopicIds.length > 0 &&
      q.subtopicId &&
      !filters.subtopicIds.includes(q.subtopicId)
    ) {
      return false;
    }

    // Difficulty filter
    if (
      filters.difficulties.length > 0 &&
      !filters.difficulties.includes(q.difficulty as Difficulty)
    ) {
      return false;
    }

    // Question type filter
    if (
      filters.questionTypes.length > 0 &&
      !filters.questionTypes.includes(q.type as QuestionType)
    ) {
      return false;
    }

    // Assessment objective filter
    if (
      filters.assessmentObjectives.length > 0 &&
      !filters.assessmentObjectives.includes(q.assessmentObjective as AssessmentObjective)
    ) {
      return false;
    }

    // Search term filter (case-insensitive match on stem)
    if (filters.searchTerm.trim().length > 0) {
      const term = filters.searchTerm.toLowerCase();
      const stemMatch = q.stem.toLowerCase().includes(term);
      const tagMatch = q.tags?.some((t) => t.toLowerCase().includes(term)) ?? false;
      if (!stemMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });
}

// Fisher-Yates shuffle
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Store ────────────────────────────────────────────────────────
export const useQuestionBankStore = create<QuestionBankState>((set, get) => ({
  allQuestions: [],
  filters: { ...defaultFilter },
  filteredQuestions: [],
  isLoaded: false,

  loadQuestions: () => {
    const questions = allQuestions;
    set({
      allQuestions: questions,
      filteredQuestions: questions,
      isLoaded: true,
    });
  },

  setFilters: (partial: Partial<QuestionFilter>) => {
    const currentFilters = get().filters;
    const newFilters: QuestionFilter = { ...currentFilters, ...partial };
    const filtered = applyFilters(get().allQuestions, newFilters);
    set({
      filters: newFilters,
      filteredQuestions: filtered,
    });
  },

  clearFilters: () => {
    set({
      filters: { ...defaultFilter },
      filteredQuestions: get().allQuestions,
    });
  },

  getFilteredQuestions: () => {
    const { allQuestions: all, filters } = get();
    return applyFilters(all, filters);
  },

  getQuestionsByTopic: (topicId: string) => {
    return get().allQuestions.filter((q) => q.topicId === topicId);
  },

  getRandomQuestions: (count: number, filter?: Partial<QuestionFilter>) => {
    const base = filter
      ? applyFilters(get().allQuestions, { ...defaultFilter, ...filter })
      : get().filteredQuestions;

    const shuffled = shuffle(base);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },
}));
