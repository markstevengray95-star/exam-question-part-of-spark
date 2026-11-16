import { describe, it, expect } from 'vitest';
import { markQuestion, markQuiz } from '../markingEngine';
import { randomiseQuestion } from '../randomiser';
import { allQuestions } from '../../data/questions';
import { subjects } from '../../data/subjects';
import type {
  DragDropQuestion,
  MatchingQuestion,
  SequencingQuestion,
  DiagramLabellingQuestion,
  EquationRearrangementQuestion,
  GraphPlottingQuestion,
  GraphInterpretationQuestion,
  DataAnalysisQuestion,
  RequiredPracticalQuestion,
  UserAnswer,
} from '../../types';

describe('All Question Types & Question Bank Verification', () => {
  // 1. Drag and Drop
  it('correctly marks drag and drop activities with partial credit', () => {
    const dd: DragDropQuestion = {
      id: 'dd-test',
      type: 'drag-drop',
      subjectId: 'phys',
      topicId: 'p1',
      qualification: 'gcse',
      difficulty: 3,
      marks: 3,
      assessmentObjective: 'AO1',
      stem: 'Sort items into zones',
      items: [
        { id: 'i1', content: 'Item 1' },
        { id: 'i2', content: 'Item 2' },
        { id: 'i3', content: 'Item 3' },
      ],
      dropZones: [
        { id: 'z1', label: 'Zone 1' },
        { id: 'z2', label: 'Zone 2' },
      ],
      correctPlacements: {
        i1: 'z1',
        i2: 'z1',
        i3: 'z2',
      },
      explanation: 'Explanation',
    };

    // 2 correct, 1 wrong
    const ans: UserAnswer = {
      questionId: 'dd-test',
      timestamp: Date.now(),
      value: { i1: 'z1', i2: 'z1', i3: 'z1' },
      placements: { i1: 'z1', i2: 'z1', i3: 'z1' },
    };
    const res = markQuestion(dd, ans);
    expect(res.marksAwarded).toBe(2);
    expect(res.isPartiallyCorrect).toBe(true);
  });

  // 2. Matching
  it('correctly marks matching questions', () => {
    const mq: MatchingQuestion = {
      id: 'match-test',
      type: 'matching',
      subjectId: 'chem',
      topicId: 'c1',
      qualification: 'gcse',
      difficulty: 2,
      marks: 2,
      assessmentObjective: 'AO1',
      stem: 'Match terms',
      leftItems: [
        { id: 'l1', text: 'Left 1' },
        { id: 'l2', text: 'Left 2' },
      ],
      rightItems: [
        { id: 'r1', text: 'Right 1' },
        { id: 'r2', text: 'Right 2' },
      ],
      correctPairs: [
        ['l1', 'r1'],
        ['l2', 'r2'],
      ],
      partialMarking: true,
      explanation: 'Explanation',
    };

    const ans: UserAnswer = {
      questionId: 'match-test',
      timestamp: Date.now(),
      value: [['l1', 'r1']],
      pairs: [['l1', 'r1']],
    };
    const res = markQuestion(mq, ans);
    expect(res.marksAwarded).toBe(1);
    expect(res.isPartiallyCorrect).toBe(true);
  });

  // 3. Sequencing
  it('correctly marks sequencing questions', () => {
    const seq: SequencingQuestion = {
      id: 'seq-test',
      type: 'sequencing',
      subjectId: 'bio',
      topicId: 'b1',
      qualification: 'gcse',
      difficulty: 3,
      marks: 3,
      assessmentObjective: 'AO1',
      stem: 'Order steps',
      items: [
        { id: 's1', text: 'First' },
        { id: 's2', text: 'Second' },
        { id: 's3', text: 'Third' },
      ],
      correctOrder: ['s1', 's2', 's3'],
      explanation: 'Chronological order',
    };

    const correctAns: UserAnswer = {
      questionId: 'seq-test',
      timestamp: Date.now(),
      value: ['s1', 's2', 's3'],
      ordering: ['s1', 's2', 's3'],
    };
    expect(markQuestion(seq, correctAns).marksAwarded).toBe(3);

    const wrongAns: UserAnswer = {
      questionId: 'seq-test',
      timestamp: Date.now(),
      value: ['s3', 's2', 's1'],
      ordering: ['s3', 's2', 's1'],
    };
    expect(markQuestion(seq, wrongAns).marksAwarded).toBe(0);
  });

  // 4. Diagram Labelling
  it('correctly marks diagram labelling questions', () => {
    const dl: DiagramLabellingQuestion = {
      id: 'dl-test',
      type: 'diagram-labelling',
      subjectId: 'phys',
      topicId: 'p4',
      qualification: 'gcse',
      difficulty: 3,
      marks: 2,
      assessmentObjective: 'AO1',
      stem: 'Label parts',
      diagramSvg: '<svg></svg>',
      labels: [
        { id: '1', correctLabel: 'Nucleus', x: 10, y: 10 },
        { id: '2', correctLabel: 'Electron', x: 20, y: 20 },
      ],
      labelOptions: ['Nucleus', 'Electron', 'Proton'],
      explanation: 'Rutherford model',
    };

    const ans: UserAnswer = {
      questionId: 'dl-test',
      timestamp: Date.now(),
      value: { '1': 'Nucleus', '2': 'Proton' },
      labelAnswers: { '1': 'Nucleus', '2': 'Proton' },
    };
    const res = markQuestion(dl, ans);
    expect(res.marksAwarded).toBe(1);
    expect(res.isPartiallyCorrect).toBe(true);
  });

  // 5. Equation Rearrangement
  it('correctly marks equation rearrangement ignoring whitespace', () => {
    const eq: EquationRearrangementQuestion = {
      id: 'eq-test',
      type: 'equation-rearrangement',
      subjectId: 'phys',
      topicId: 'p2',
      qualification: 'gcse',
      difficulty: 2,
      marks: 1,
      assessmentObjective: 'AO1',
      stem: 'Rearrange V = I * R for R',
      originalEquation: 'V = I * R',
      targetVariable: 'R',
      correctRearrangement: 'R = V / I',
      acceptableFormats: ['R = V / I', 'R = V/I', 'V / I', 'V/I'],
      explanation: 'Divide by I',
    };

    const ans: UserAnswer = {
      questionId: 'eq-test',
      timestamp: Date.now(),
      value: 'R = V/I',
      textAnswer: 'R = V/I',
    };
    const res = markQuestion(eq, ans);
    expect(res.marksAwarded).toBe(1);
    expect(res.isCorrect).toBe(true);
  });

  // 6. Graph Interpretation
  it('correctly marks graph interpretation sub-questions', () => {
    const gi: GraphInterpretationQuestion = {
      id: 'gi-test',
      type: 'graph-interpretation',
      subjectId: 'chem',
      topicId: 'c6',
      qualification: 'gcse',
      difficulty: 3,
      marks: 3,
      assessmentObjective: 'AO2',
      stem: 'Analyze rate graph',
      graphData: {
        datasets: [{ label: 'Rate', data: [{ x: 1, y: 10 }], colour: '#000' }],
        xAxisLabel: 'Time',
        yAxisLabel: 'Volume',
        xUnit: 's',
        yUnit: 'cm3',
      },
      subQuestions: [
        {
          id: 'sq1',
          stem: 'Part 1',
          type: 'multiple-choice',
          marks: 1,
          options: [{ id: 'a', text: 'Option A' }],
          correctOptionId: 'a',
        },
        {
          id: 'sq2',
          stem: 'Part 2',
          type: 'calculation-single',
          marks: 2,
          expectedAnswer: 20,
          tolerance: 0.5,
          unit: 'cm3',
        },
      ],
      explanation: 'Graph analysis',
    };

    const ans: UserAnswer = {
      questionId: 'gi-test',
      timestamp: Date.now(),
      value: {},
      subAnswers: {
        sq1: { questionId: 'sq1', timestamp: Date.now(), value: 'a', selectedOptionId: 'a' },
        sq2: { questionId: 'sq2', timestamp: Date.now(), value: 20, numericAnswer: 20 },
      },
    };

    const res = markQuestion(gi, ans);
    expect(res.marksAwarded).toBe(3);
    expect(res.isCorrect).toBe(true);
  });

  // 7. Data Analysis
  it('correctly marks data analysis questions with tabular data', () => {
    const da: DataAnalysisQuestion = {
      id: 'da-test',
      type: 'data-analysis',
      subjectId: 'bio',
      topicId: 'b1',
      qualification: 'gcse',
      difficulty: 3,
      marks: 2,
      assessmentObjective: 'AO2',
      stem: 'Results table',
      tableData: {
        headers: ['Col 1', 'Col 2'],
        rows: [[1, 2], [3, 4]],
      },
      subQuestions: [
        {
          id: 'sq1',
          stem: 'Calc',
          type: 'calculation-single',
          marks: 2,
          expectedAnswer: 50,
          tolerance: 1,
          unit: '%',
        },
      ],
      explanation: 'Analysis',
    };

    const ans: UserAnswer = {
      questionId: 'da-test',
      timestamp: Date.now(),
      value: {},
      subAnswers: {
        sq1: { questionId: 'sq1', timestamp: Date.now(), value: 50, numericAnswer: 50 },
      },
    };

    const res = markQuestion(da, ans);
    expect(res.marksAwarded).toBe(2);
    expect(res.isCorrect).toBe(true);
  });

  // 8. Required Practical
  it('correctly marks required practical sub-questions', () => {
    const rp: RequiredPracticalQuestion = {
      id: 'rp-test',
      type: 'required-practical',
      subjectId: 'phys',
      topicId: 'p2',
      qualification: 'gcse',
      difficulty: 3,
      marks: 2,
      assessmentObjective: 'AO3',
      practicalTitle: 'Resistance',
      practicalNumber: 3,
      stem: 'Investigating resistance of a wire',
      subQuestions: [
        {
          id: 'rp_sq1',
          stem: 'Voltmeter connection',
          type: 'multiple-choice',
          marks: 1,
          options: [{ id: 'par', text: 'Parallel' }, { id: 'ser', text: 'Series' }],
          correctOptionId: 'par',
        },
        {
          id: 'rp_sq2',
          stem: 'Calculate resistance',
          type: 'calculation-single',
          marks: 1,
          expectedAnswer: 5,
          tolerance: 0.1,
          unit: 'Ω',
        },
      ],
      explanation: 'Ohmic circuit',
    };

    const ans: UserAnswer = {
      questionId: 'rp-test',
      timestamp: Date.now(),
      value: {},
      subAnswers: {
        rp_sq1: { questionId: 'rp_sq1', timestamp: Date.now(), value: 'par', selectedOptionId: 'par' },
        rp_sq2: { questionId: 'rp_sq2', timestamp: Date.now(), value: 5, numericAnswer: 5 },
      },
    };

    const res = markQuestion(rp, ans);
    expect(res.marksAwarded).toBe(2);
    expect(res.isCorrect).toBe(true);
  });

  // 9. Full Quiz Marking Engine
  it('correctly marks an entire quiz with markQuiz', () => {
    const sampleQuestions = allQuestions.slice(0, 5);
    const answers: Record<string, UserAnswer> = {};

    sampleQuestions.forEach((q) => {
      if (q.type === 'multiple-choice') {
        answers[q.id] = {
          questionId: q.id,
          timestamp: Date.now(),
          value: q.correctOptionId,
          selectedOptionId: q.correctOptionId,
        };
      }
    });

    const quizMarks = markQuiz(sampleQuestions, answers);
    expect(Object.keys(quizMarks).length).toBe(sampleQuestions.length);
  });

  // 10. Question Bank Integrity Check
  it('verifies that all questions in the question bank have valid specs, marks, and explanations', () => {
    expect(allQuestions.length).toBeGreaterThanOrEqual(40);

    const validSubjectIds = subjects.map((s) => s.id);

    allQuestions.forEach((q) => {
      expect(q.id).toBeDefined();
      expect(q.type).toBeDefined();
      expect(q.marks).toBeGreaterThanOrEqual(1);
      expect(q.stem).toBeTruthy();
      expect(q.explanation).toBeTruthy();
      expect(['gcse', 'a-level']).toContain(q.qualification);
      expect([1, 2, 3, 4, 5]).toContain(q.difficulty);
      expect(['AO1', 'AO2', 'AO3']).toContain(q.assessmentObjective);
      expect(validSubjectIds).toContain(q.subjectId);
    });
  });
});
