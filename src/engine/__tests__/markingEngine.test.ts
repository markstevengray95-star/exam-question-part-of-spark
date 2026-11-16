import { describe, it, expect } from 'vitest';
import { markQuestion, markQuiz } from '../markingEngine';
import { randomiseQuestion } from '../randomiser';
import type {
  MultipleChoiceQuestion,
  MultipleAnswerQuestion,
  TrueFalseQuestion,
  FillBlanksQuestion,
  KeywordDefinitionQuestion,
  SingleCalculationQuestion,
  MultiStepCalculationQuestion,
  EquationRearrangementQuestion,
  UnitConversionQuestion,
  DragDropQuestion,
  MatchingQuestion,
  SequencingQuestion,
  DiagramLabellingQuestion,
  UserAnswer,
} from '../../types';

describe('Marking Engine & Randomiser Tests', () => {
  // 1. Multiple Choice
  it('correctly marks multiple-choice questions', () => {
    const mcq: MultipleChoiceQuestion = {
      id: 'mcq-1',
      type: 'multiple-choice',
      subjectId: 'chem',
      topicId: 'c1',
      qualification: 'gcse',
      difficulty: 1,
      marks: 1,
      assessmentObjective: 'AO1',
      stem: 'What is the symbol for Sodium?',
      options: [
        { id: 'na', text: 'Na' },
        { id: 'so', text: 'So' },
      ],
      correctOptionId: 'na',
      explanation: 'Sodium is Na',
    };

    const correctAns: UserAnswer = {
      questionId: 'mcq-1',
      timestamp: Date.now(),
      value: 'na',
      selectedOptionId: 'na',
    };
    const res1 = markQuestion(mcq, correctAns);
    expect(res1.marksAwarded).toBe(1);
    expect(res1.isCorrect).toBe(true);

    const wrongAns: UserAnswer = {
      questionId: 'mcq-1',
      timestamp: Date.now(),
      value: 'so',
      selectedOptionId: 'so',
    };
    const res2 = markQuestion(mcq, wrongAns);
    expect(res2.marksAwarded).toBe(0);
    expect(res2.isCorrect).toBe(false);
  });

  // 2. Multiple Answer with Partial Marking
  it('correctly awards partial marks for multiple-answer questions', () => {
    const maq: MultipleAnswerQuestion = {
      id: 'maq-1',
      type: 'multiple-answer',
      subjectId: 'phys',
      topicId: 'p1',
      qualification: 'gcse',
      difficulty: 2,
      marks: 2,
      assessmentObjective: 'AO1',
      stem: 'Which are vectors?',
      options: [
        { id: 'vel', text: 'Velocity' },
        { id: 'disp', text: 'Displacement' },
        { id: 'spd', text: 'Speed' },
      ],
      correctOptionIds: ['vel', 'disp'],
      partialMarking: true,
      explanation: 'Velocity and displacement have direction.',
    };

    // Selecting only one correct gives 1 mark
    const ans1: UserAnswer = {
      questionId: 'maq-1',
      timestamp: Date.now(),
      value: ['vel'],
      selectedOptionIds: ['vel'],
    };
    const res1 = markQuestion(maq, ans1);
    expect(res1.marksAwarded).toBe(1);
    expect(res1.isPartiallyCorrect).toBe(true);

    // Both correct gives 2 marks
    const ans2: UserAnswer = {
      questionId: 'maq-1',
      timestamp: Date.now(),
      value: ['vel', 'disp'],
      selectedOptionIds: ['vel', 'disp'],
    };
    const res2 = markQuestion(maq, ans2);
    expect(res2.marksAwarded).toBe(2);
    expect(res2.isCorrect).toBe(true);
  });

  // 3. True / False
  it('correctly marks true/false questions', () => {
    const tf: TrueFalseQuestion = {
      id: 'tf-1',
      type: 'true-false',
      subjectId: 'bio',
      topicId: 'b1',
      qualification: 'gcse',
      difficulty: 1,
      marks: 1,
      assessmentObjective: 'AO1',
      stem: 'Mitochondria contain their own DNA.',
      correctAnswer: true,
      explanation: 'Mitochondria have circular DNA.',
    };

    const res = markQuestion(tf, {
      questionId: 'tf-1',
      timestamp: Date.now(),
      value: true,
      booleanAnswer: true,
    });
    expect(res.marksAwarded).toBe(1);
    expect(res.isCorrect).toBe(true);
  });

  // 4. Fill in the Blanks
  it('correctly marks fill-in-the-blanks with case-insensitivity', () => {
    const fb: FillBlanksQuestion = {
      id: 'fb-1',
      type: 'fill-blanks',
      subjectId: 'bio',
      topicId: 'b1',
      qualification: 'gcse',
      difficulty: 2,
      marks: 2,
      assessmentObjective: 'AO1',
      stem: 'Plant cells have a cell wall made of cellulose.',
      template: 'Plant cell walls are made of {{b1}} which provides {{b2}}.',
      blanks: [
        { id: 'b1', acceptableAnswers: ['cellulose'], caseSensitive: false },
        { id: 'b2', acceptableAnswers: ['strength', 'support', 'rigidity'], caseSensitive: false },
      ],
      explanation: 'Cellulose provides support.',
    };

    const ans: UserAnswer = {
      questionId: 'fb-1',
      timestamp: Date.now(),
      value: { b1: 'Cellulose', b2: 'support' },
      blanksAnswers: { b1: 'Cellulose', b2: 'support' },
    };
    const res = markQuestion(fb, ans);
    expect(res.marksAwarded).toBe(2);
    expect(res.isCorrect).toBe(true);
  });

  // 5. Keyword & Definition
  it('evaluates keyword-definition questions based on key terms', () => {
    const kd: KeywordDefinitionQuestion = {
      id: 'kd-1',
      type: 'keyword-definition',
      subjectId: 'bio',
      topicId: 'b1',
      qualification: 'gcse',
      difficulty: 2,
      marks: 2,
      assessmentObjective: 'AO1',
      stem: 'Define osmosis',
      keyword: 'osmosis',
      acceptableAnswers: ['The diffusion of water from a dilute to concentrated solution through a partially permeable membrane'],
      keyTerms: ['diffusion of water', 'partially permeable membrane'],
      explanation: 'Osmosis definition.',
    };

    const ans: UserAnswer = {
      questionId: 'kd-1',
      timestamp: Date.now(),
      value: 'Osmosis is the net diffusion of water across a partially permeable membrane down a water potential gradient.',
      textAnswer: 'Osmosis is the net diffusion of water across a partially permeable membrane down a water potential gradient.',
    };
    const res = markQuestion(kd, ans);
    expect(res.marksAwarded).toBe(2);
    expect(res.isCorrect).toBe(true);
  });

  // 6. Single Calculation & Tolerance
  it('marks calculations within numerical tolerance and tests randomisation', () => {
    const calc: SingleCalculationQuestion = {
      id: 'calc-1',
      type: 'calculation-single',
      subjectId: 'phys',
      topicId: 'p1',
      qualification: 'gcse',
      difficulty: 2,
      marks: 2,
      assessmentObjective: 'AO2',
      stem: 'A runner of mass {mass} kg runs at speed {speed} m/s. Calculate kinetic energy.',
      equation: 'E_k = 0.5 * m * v^2',
      variables: [
        { name: 'mass', symbol: 'm', value: 50, unit: 'kg' },
        { name: 'speed', symbol: 'v', value: 4, unit: 'm/s' },
      ],
      expectedAnswer: 400,
      tolerance: 2,
      unit: 'J',
      significantFigures: 2,
      randomisable: true,
      randomConfig: {
        variables: [
          { name: 'mass', min: 40, max: 80, step: 10, decimalPlaces: 0 },
          { name: 'speed', min: 2, max: 6, step: 1, decimalPlaces: 0 },
        ],
        calculateAnswer: '0.5 * mass * speed * speed',
      },
      workedSolution: '0.5 * 50 * 16 = 400 J',
      explanation: 'Ek formula',
    };

    const res = markQuestion(calc, {
      questionId: 'calc-1',
      timestamp: Date.now(),
      value: 400,
      numericAnswer: 400,
    });
    expect(res.marksAwarded).toBe(2);

    // Test randomisation
    const randomised = randomiseQuestion(calc) as SingleCalculationQuestion;
    expect(randomised.expectedAnswer).toBeGreaterThan(0);
    expect(randomised.stem).not.toContain('{mass}');
  });

  // 7. Multi-step calculation with partial credit per step
  it('awards partial marks for multi-step calculations', () => {
    const multiCalc: MultiStepCalculationQuestion = {
      id: 'mc-1',
      type: 'calculation-multi',
      subjectId: 'phys',
      topicId: 'p1',
      qualification: 'gcse',
      difficulty: 4,
      marks: 3,
      assessmentObjective: 'AO2',
      stem: 'Drop test',
      steps: [
        {
          id: 'step1',
          description: 'Calculate Ep',
          equation: 'mgh',
          expectedAnswer: 100,
          tolerance: 1,
          unit: 'J',
          marks: 1,
        },
        {
          id: 'step2',
          description: 'Calculate speed',
          equation: 'sqrt(2gh)',
          expectedAnswer: 10,
          tolerance: 0.1,
          unit: 'm/s',
          marks: 2,
        },
      ],
      finalAnswer: 10,
      tolerance: 0.1,
      unit: 'm/s',
      randomisable: false,
      workedSolution: 'Ep = 100 J, v = 10 m/s',
      explanation: 'Conservation of energy',
    };

    // User gets step 1 right, but step 2 wrong
    const ans: UserAnswer = {
      questionId: 'mc-1',
      timestamp: Date.now(),
      value: {},
      subAnswers: {
        step1: { questionId: 'step1', timestamp: Date.now(), value: 100, numericAnswer: 100 },
        step2: { questionId: 'step2', timestamp: Date.now(), value: 5, numericAnswer: 5 },
      },
    };

    const res = markQuestion(multiCalc, ans);
    expect(res.marksAwarded).toBe(1);
    expect(res.isPartiallyCorrect).toBe(true);
  });

  // 8. Unit Conversion
  it('correctly marks unit conversions', () => {
    const uc: UnitConversionQuestion = {
      id: 'uc-1',
      type: 'unit-conversion',
      subjectId: 'chem',
      topicId: 'c1',
      qualification: 'gcse',
      difficulty: 1,
      marks: 1,
      assessmentObjective: 'AO1',
      stem: 'Convert 500 cm3 to dm3',
      value: 500,
      fromUnit: 'cm³',
      toUnit: 'dm³',
      correctAnswer: 0.5,
      tolerance: 0.001,
      conversionSteps: ['Divide by 1000'],
      randomisable: false,
      explanation: '500 / 1000 = 0.5',
    };

    const res = markQuestion(uc, {
      questionId: 'uc-1',
      timestamp: Date.now(),
      value: 0.5,
      numericAnswer: 0.5,
    });
    expect(res.marksAwarded).toBe(1);
    expect(res.isCorrect).toBe(true);
  });
});
