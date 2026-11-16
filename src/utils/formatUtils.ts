// Formatting utility functions for the SPARK Exam Questions app
import katex from 'katex';
import type { QuestionType, Difficulty, Qualification } from '../types';

/**
 * Process text containing LaTeX delimited by $...$ into HTML using KaTeX.
 * Inline math: $...$
 * Display math: $$...$$
 */
export function renderLatex(text: string): string {
  if (!text) return '';

  // First handle display math $$...$$
  let result = text.replace(/\$\$([^$]+)\$\$/g, (_match, latex) => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return `$$${latex}$$`;
    }
  });

  // Then handle inline math $...$
  result = result.replace(/\$([^$]+)\$/g, (_match, latex) => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return `$${latex}$`;
    }
  });

  return result;
}

/**
 * Format seconds into mm:ss string
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) seconds = 0;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format a decimal number as a percentage string to 1 decimal place
 */
export function formatPercentage(n: number): string {
  return `${(n * 100).toFixed(1)}%`;
}

/**
 * Get a human-readable label for a question type
 */
export function getQuestionTypeLabel(type: QuestionType): string {
  const labels: Record<QuestionType, string> = {
    'multiple-choice': 'Multiple Choice',
    'multiple-answer': 'Multiple Answer',
    'true-false': 'True or False',
    'fill-blanks': 'Fill in the Blanks',
    'keyword-definition': 'Keyword Definition',
    'short-response': 'Short Response',
    'extended-response': 'Extended Response',
    'calculation-single': 'Calculation',
    'calculation-multi': 'Multi-step Calculation',
    'equation-rearrangement': 'Equation Rearrangement',
    'unit-conversion': 'Unit Conversion',
    'drag-drop': 'Drag and Drop',
    'matching': 'Matching',
    'sequencing': 'Sequencing',
    'diagram-labelling': 'Diagram Labelling',
    'graph-plotting': 'Graph Plotting',
    'graph-interpretation': 'Graph Interpretation',
    'data-analysis': 'Data Analysis',
    'required-practical': 'Required Practical',
  };
  return labels[type] || type;
}

/**
 * Get a difficulty label from the numeric difficulty level
 */
export function getDifficultyLabel(d: Difficulty): string {
  const labels: Record<Difficulty, string> = {
    1: 'Foundation',
    2: 'Foundation Plus',
    3: 'Crossover',
    4: 'Higher',
    5: 'Challenge',
  };
  return labels[d] || `Level ${d}`;
}

/**
 * Estimate a grade from a percentage score and qualification.
 * Uses approximate AQA grade boundaries.
 */
export function getGradeFromPercentage(percentage: number, qual: Qualification): string {
  const p = percentage * 100; // convert to 0-100 scale

  if (qual === 'gcse') {
    if (p >= 90) return '9';
    if (p >= 80) return '8';
    if (p >= 70) return '7';
    if (p >= 60) return '6';
    if (p >= 50) return '5';
    if (p >= 40) return '4';
    if (p >= 30) return '3';
    if (p >= 20) return '2';
    if (p >= 10) return '1';
    return 'U';
  }

  // A-level
  if (p >= 80) return 'A*';
  if (p >= 70) return 'A';
  if (p >= 60) return 'B';
  if (p >= 50) return 'C';
  if (p >= 40) return 'D';
  if (p >= 30) return 'E';
  return 'U';
}

/**
 * Get a colour class for a difficulty level (Tailwind)
 */
export function getDifficultyColour(d: Difficulty): string {
  const colours: Record<Difficulty, string> = {
    1: 'text-green-600 bg-green-100',
    2: 'text-blue-600 bg-blue-100',
    3: 'text-yellow-600 bg-yellow-100',
    4: 'text-orange-600 bg-orange-100',
    5: 'text-red-600 bg-red-100',
  };
  return colours[d] || '';
}

/**
 * Get a colour class for assessment objective
 */
export function getAOLabel(ao: string): string {
  const labels: Record<string, string> = {
    'AO1': 'Knowledge & Understanding',
    'AO2': 'Application',
    'AO3': 'Analysis & Evaluation',
  };
  return labels[ao] || ao;
}
