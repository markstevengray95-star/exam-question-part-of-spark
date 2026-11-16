import React from 'react';
import type { Question, UserAnswer, MarkResult } from '../../types';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { MultipleAnswerQuestion } from './MultipleAnswerQuestion';
import { TrueFalseQuestion } from './TrueFalseQuestion';
import { FillBlanksQuestion } from './FillBlanksQuestion';
import { KeywordDefinitionQuestion } from './KeywordDefinitionQuestion';
import { ShortResponseQuestion } from './ShortResponseQuestion';
import { ExtendedResponseQuestion } from './ExtendedResponseQuestion';
import { CalculationQuestion } from './CalculationQuestion';
import { EquationRearrangementQuestion } from './EquationRearrangementQuestion';
import { UnitConversionQuestion } from './UnitConversionQuestion';
import { DragDropQuestion } from './DragDropQuestion';
import { MatchingQuestion } from './MatchingQuestion';
import { SequencingQuestion } from './SequencingQuestion';
import { DiagramLabellingQuestion } from './DiagramLabellingQuestion';
import { GraphPlottingQuestion } from './GraphPlottingQuestion';
import { GraphInterpretationQuestion } from './GraphInterpretationQuestion';
import { DataAnalysisQuestion } from './DataAnalysisQuestion';
import { RequiredPracticalQuestion } from './RequiredPracticalQuestion';

interface QuestionRendererProps {
  question: Question;
  userAnswer?: UserAnswer;
  result?: MarkResult;
  onAnswer: (answer: UserAnswer) => void;
  isSubmitted?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  userAnswer,
  result,
  onAnswer,
  isSubmitted = false,
}) => {
  switch (question.type) {
    case 'multiple-choice':
      return (
        <MultipleChoiceQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'multiple-answer':
      return (
        <MultipleAnswerQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'true-false':
      return (
        <TrueFalseQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'fill-blanks':
      return (
        <FillBlanksQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'keyword-definition':
      return (
        <KeywordDefinitionQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'short-response':
      return (
        <ShortResponseQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'extended-response':
      return (
        <ExtendedResponseQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'calculation-single':
    case 'calculation-multi':
      return (
        <CalculationQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'equation-rearrangement':
      return (
        <EquationRearrangementQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'unit-conversion':
      return (
        <UnitConversionQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'drag-drop':
      return (
        <DragDropQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'matching':
      return (
        <MatchingQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'sequencing':
      return (
        <SequencingQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'diagram-labelling':
      return (
        <DiagramLabellingQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'graph-plotting':
      return (
        <GraphPlottingQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'graph-interpretation':
      return (
        <GraphInterpretationQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'data-analysis':
      return (
        <DataAnalysisQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    case 'required-practical':
      return (
        <RequiredPracticalQuestion
          question={question}
          userAnswer={userAnswer}
          result={result}
          onAnswer={onAnswer}
          isSubmitted={isSubmitted}
        />
      );
    default:
      return <div>Unsupported question type.</div>;
  }
};
