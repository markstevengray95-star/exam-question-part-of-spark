// Core type definitions for the SPARK Exam Questions & Quiz App

// ─── Qualification & Subject ─────────────────────────────────────
export type Qualification = 'gcse' | 'a-level';

export interface Subject {
  id: string;
  name: string;
  qualification: Qualification;
  topics: Topic[];
  colour: string;
}

export interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

export interface Subtopic {
  id: string;
  name: string;
}

// ─── Question Types ──────────────────────────────────────────────
export type QuestionType =
  | 'multiple-choice'
  | 'multiple-answer'
  | 'true-false'
  | 'fill-blanks'
  | 'keyword-definition'
  | 'short-response'
  | 'extended-response'
  | 'calculation-single'
  | 'calculation-multi'
  | 'equation-rearrangement'
  | 'unit-conversion'
  | 'drag-drop'
  | 'matching'
  | 'sequencing'
  | 'diagram-labelling'
  | 'graph-plotting'
  | 'graph-interpretation'
  | 'data-analysis'
  | 'required-practical';

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type AssessmentObjective = 'AO1' | 'AO2' | 'AO3';

// ─── Base Question ───────────────────────────────────────────────
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  subjectId: string;
  topicId: string;
  subtopicId?: string;
  qualification: Qualification;
  difficulty: Difficulty;
  marks: number;
  assessmentObjective: AssessmentObjective;
  stem: string; // supports LaTeX via $...$
  imageUrl?: string;
  hints?: string[];
  explanation: string;
  commonMisconceptions?: string[];
  tags?: string[];
}

// ─── Specific Question Types ─────────────────────────────────────
export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple-choice';
  options: AnswerOption[];
  correctOptionId: string;
}

export interface MultipleAnswerQuestion extends BaseQuestion {
  type: 'multiple-answer';
  options: AnswerOption[];
  correctOptionIds: string[];
  partialMarking: boolean;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true-false';
  correctAnswer: boolean;
}

export interface FillBlanksQuestion extends BaseQuestion {
  type: 'fill-blanks';
  template: string; // text with {{blank_id}} placeholders
  blanks: BlankAnswer[];
}

export interface KeywordDefinitionQuestion extends BaseQuestion {
  type: 'keyword-definition';
  keyword: string;
  acceptableAnswers: string[];
  keyTerms: string[]; // required keywords in the answer
}

export interface ShortResponseQuestion extends BaseQuestion {
  type: 'short-response';
  markScheme: MarkPoint[];
  modelAnswer: string;
  maxWords?: number;
}

export interface ExtendedResponseQuestion extends BaseQuestion {
  type: 'extended-response';
  markScheme: MarkPoint[];
  modelAnswer: string;
  qualityOfWrittenCommunication: boolean;
  levelDescriptors?: LevelDescriptor[];
}

export interface SingleCalculationQuestion extends BaseQuestion {
  type: 'calculation-single';
  equation: string;
  variables: CalculationVariable[];
  expectedAnswer: number;
  tolerance: number;
  unit: string;
  significantFigures?: number;
  randomisable: boolean;
  randomConfig?: RandomConfig;
  workedSolution: string;
}

export interface MultiStepCalculationQuestion extends BaseQuestion {
  type: 'calculation-multi';
  steps: CalculationStep[];
  finalAnswer: number;
  tolerance: number;
  unit: string;
  significantFigures?: number;
  randomisable: boolean;
  randomConfig?: RandomConfig;
  workedSolution: string;
}

export interface EquationRearrangementQuestion extends BaseQuestion {
  type: 'equation-rearrangement';
  originalEquation: string;
  targetVariable: string;
  correctRearrangement: string;
  acceptableFormats: string[];
}

export interface UnitConversionQuestion extends BaseQuestion {
  type: 'unit-conversion';
  value: number;
  fromUnit: string;
  toUnit: string;
  correctAnswer: number;
  tolerance: number;
  conversionSteps: string[];
  randomisable: boolean;
  randomConfig?: RandomConfig;
}

export interface DragDropQuestion extends BaseQuestion {
  type: 'drag-drop';
  items: DragItem[];
  dropZones: DropZone[];
  correctPlacements: Record<string, string>; // itemId -> zoneId
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: LabelledItem[];
  rightItems: LabelledItem[];
  correctPairs: [string, string][];
  partialMarking: boolean;
}

export interface SequencingQuestion extends BaseQuestion {
  type: 'sequencing';
  items: LabelledItem[];
  correctOrder: string[];
}

export interface DiagramLabellingQuestion extends BaseQuestion {
  type: 'diagram-labelling';
  diagramSvg: string;
  labels: DiagramLabel[];
  labelOptions: string[];
}

export interface GraphPlottingQuestion extends BaseQuestion {
  type: 'graph-plotting';
  dataPoints: DataPoint[];
  xAxisLabel: string;
  yAxisLabel: string;
  xUnit: string;
  yUnit: string;
  expectedLineType: 'straight' | 'curve' | 'bestfit';
  markScheme: MarkPoint[];
}

export interface GraphInterpretationQuestion extends BaseQuestion {
  type: 'graph-interpretation';
  graphData: GraphData;
  subQuestions: SubQuestion[];
}

export interface DataAnalysisQuestion extends BaseQuestion {
  type: 'data-analysis';
  tableData: TableData;
  subQuestions: SubQuestion[];
}

export interface RequiredPracticalQuestion extends BaseQuestion {
  type: 'required-practical';
  practicalTitle: string;
  practicalNumber: number;
  apparatus?: string[];
  subQuestions: SubQuestion[];
  diagramSvg?: string;
}

// ─── Supporting Types ────────────────────────────────────────────
export interface AnswerOption {
  id: string;
  text: string;
  explanation?: string;
}

export interface BlankAnswer {
  id: string;
  acceptableAnswers: string[];
  caseSensitive: boolean;
}

export interface MarkPoint {
  id: string;
  point: string;
  marks: number;
  required: boolean;
  keywords?: string[];
}

export interface LevelDescriptor {
  level: number;
  description: string;
  marksRange: [number, number];
}

export interface CalculationVariable {
  name: string;
  symbol: string;
  value: number;
  unit: string;
}

export interface CalculationStep {
  id: string;
  description: string;
  equation: string;
  expectedAnswer: number;
  tolerance: number;
  unit: string;
  marks: number;
}

export interface RandomConfig {
  variables: RandomVariable[];
  calculateAnswer: string; // JS expression to evaluate
}

export interface RandomVariable {
  name: string;
  min: number;
  max: number;
  step: number;
  decimalPlaces: number;
}

export interface DragItem {
  id: string;
  content: string;
  imageUrl?: string;
}

export interface DropZone {
  id: string;
  label: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

export interface LabelledItem {
  id: string;
  text: string;
}

export interface DiagramLabel {
  id: string;
  correctLabel: string;
  x: number;
  y: number;
}

export interface DataPoint {
  x: number;
  y: number;
}

export interface GraphData {
  datasets: GraphDataset[];
  xAxisLabel: string;
  yAxisLabel: string;
  xUnit: string;
  yUnit: string;
  title?: string;
}

export interface GraphDataset {
  label: string;
  data: DataPoint[];
  colour: string;
}

export interface TableData {
  headers: string[];
  rows: (string | number)[][];
  units?: string[];
}

export interface SubQuestion {
  id: string;
  stem: string;
  type: 'short-response' | 'calculation-single' | 'multiple-choice' | 'fill-blanks';
  marks: number;
  // Type-specific data
  markScheme?: MarkPoint[];
  modelAnswer?: string;
  options?: AnswerOption[];
  correctOptionId?: string;
  expectedAnswer?: number;
  tolerance?: number;
  unit?: string;
  blanks?: BlankAnswer[];
  template?: string;
}

// ─── Union Type ──────────────────────────────────────────────────
export type Question =
  | MultipleChoiceQuestion
  | MultipleAnswerQuestion
  | TrueFalseQuestion
  | FillBlanksQuestion
  | KeywordDefinitionQuestion
  | ShortResponseQuestion
  | ExtendedResponseQuestion
  | SingleCalculationQuestion
  | MultiStepCalculationQuestion
  | EquationRearrangementQuestion
  | UnitConversionQuestion
  | DragDropQuestion
  | MatchingQuestion
  | SequencingQuestion
  | DiagramLabellingQuestion
  | GraphPlottingQuestion
  | GraphInterpretationQuestion
  | DataAnalysisQuestion
  | RequiredPracticalQuestion;

// ─── Quiz Types ──────────────────────────────────────────────────
export type QuizMode = 'practice' | 'quick-fire' | 'topic-test' | 'timed-exam';

export interface QuizConfig {
  mode: QuizMode;
  questionCount: number;
  subjectIds: string[];
  topicIds: string[];
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
  timeLimit?: number; // seconds
  showHints: boolean;
  showExplanations: boolean;
  randomiseOrder: boolean;
}

export interface QuizState {
  id: string;
  config: QuizConfig;
  questions: Question[];
  currentIndex: number;
  answers: Record<string, UserAnswer>;
  results: Record<string, MarkResult>;
  startTime: number;
  endTime?: number;
  isComplete: boolean;
  isPaused: boolean;
  hintsUsed: Record<string, number>;
}

export interface UserAnswer {
  questionId: string;
  timestamp: number;
  value: unknown;
  // Specific answer shapes:
  selectedOptionId?: string;
  selectedOptionIds?: string[];
  booleanAnswer?: boolean;
  textAnswer?: string;
  numericAnswer?: number;
  blanksAnswers?: Record<string, string>;
  placements?: Record<string, string>;
  pairs?: [string, string][];
  ordering?: string[];
  labelAnswers?: Record<string, string>;
  plotPoints?: DataPoint[];
  subAnswers?: Record<string, UserAnswer>;
  workingOut?: string;
}

export interface MarkResult {
  questionId: string;
  marksAwarded: number;
  marksAvailable: number;
  isCorrect: boolean;
  isPartiallyCorrect: boolean;
  feedback: string;
  detailedFeedback?: StepFeedback[];
  autoMarked: boolean;
}

export interface StepFeedback {
  stepId: string;
  correct: boolean;
  marksAwarded: number;
  feedback: string;
}

// ─── Results Types ───────────────────────────────────────────────
export interface QuizResults {
  quizId: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  timeTaken: number;
  questionResults: MarkResult[];
  topicBreakdown: TopicPerformance[];
  difficultyBreakdown: DifficultyPerformance[];
  typeBreakdown: TypePerformance[];
  incorrectQuestionIds: string[];
}

export interface TopicPerformance {
  topicId: string;
  topicName: string;
  marks: number;
  maxMarks: number;
  percentage: number;
}

export interface DifficultyPerformance {
  difficulty: Difficulty;
  marks: number;
  maxMarks: number;
  percentage: number;
}

export interface TypePerformance {
  type: QuestionType;
  marks: number;
  maxMarks: number;
  percentage: number;
}

// ─── Filter Types ────────────────────────────────────────────────
export interface QuestionFilter {
  qualifications: Qualification[];
  subjectIds: string[];
  topicIds: string[];
  subtopicIds: string[];
  difficulties: Difficulty[];
  questionTypes: QuestionType[];
  assessmentObjectives: AssessmentObjective[];
  searchTerm: string;
}
