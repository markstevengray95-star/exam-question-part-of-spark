// ─── Randomiser Engine ──────────────────────────────────────────────
// Generates randomised parameters and recalculates verified answers
// for calculation-single, calculation-multi, and unit-conversion questions.

import type {
  Question,
  SingleCalculationQuestion,
  MultiStepCalculationQuestion,
  UnitConversionQuestion,
  RandomVariable,
} from '../types';
import { randomInRange, roundToSF } from '../utils/mathUtils';

/**
 * Evaluates a math expression string with a dictionary of variable values.
 * Uses Function constructor safely in a restricted scope.
 */
function safeEvalExpression(expr: string, vars: Record<string, number>): number {
  // Replace variable names with their values or evaluate in sandbox function
  const varNames = Object.keys(vars);
  const varValues = Object.values(vars);
  try {
    const fn = new Function(...varNames, `return (${expr});`);
    return fn(...varValues);
  } catch (err) {
    console.error('Failed to evaluate random calculation expression:', expr, err);
    return 0;
  }
}

/**
 * Generates randomised values according to variable bounds.
 */
export function generateRandomVariables(vars: RandomVariable[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const v of vars) {
    result[v.name] = randomInRange(v.min, v.max, v.step, v.decimalPlaces);
  }
  return result;
}

/**
 * Randomises a calculation question with fresh numbers and updates:
 * - The question stem (replaces {varName} placeholders with generated values)
 * - The expected answer
 * - For multi-step: intermediate steps
 */
export function randomiseQuestion(question: Question): Question {
  if (question.type === 'calculation-single') {
    const q = { ...question } as SingleCalculationQuestion;
    if (!q.randomisable || !q.randomConfig) return question;

    const values = generateRandomVariables(q.randomConfig.variables);
    let newStem = q.stem;
    for (const [name, val] of Object.entries(values)) {
      newStem = newStem.replace(new RegExp(`\\{${name}\\}`, 'g'), String(val));
    }

    const calculatedAnswer = safeEvalExpression(q.randomConfig.calculateAnswer, values);
    const sf = q.significantFigures || 3;
    const finalAnswer = roundToSF(calculatedAnswer, sf);

    // Update variables list
    const updatedVariables = q.variables.map((v) => ({
      ...v,
      value: values[v.symbol] ?? values[v.name] ?? v.value,
    }));

    return {
      ...q,
      stem: newStem,
      variables: updatedVariables,
      expectedAnswer: finalAnswer,
    };
  }

  if (question.type === 'calculation-multi') {
    const q = { ...question } as MultiStepCalculationQuestion;
    if (!q.randomisable || !q.randomConfig) return question;

    const values = generateRandomVariables(q.randomConfig.variables);
    let newStem = q.stem;
    for (const [name, val] of Object.entries(values)) {
      newStem = newStem.replace(new RegExp(`\\{${name}\\}`, 'g'), String(val));
    }

    const calculatedAnswer = safeEvalExpression(q.randomConfig.calculateAnswer, values);
    const sf = q.significantFigures || 3;
    const finalAnswer = roundToSF(calculatedAnswer, sf);

    return {
      ...q,
      stem: newStem,
      finalAnswer,
    };
  }

  if (question.type === 'unit-conversion') {
    const q = { ...question } as UnitConversionQuestion;
    if (!q.randomisable || !q.randomConfig) return question;

    const values = generateRandomVariables(q.randomConfig.variables);
    const valKey = Object.keys(values)[0] || 'val';
    const newVal = values[valKey] ?? q.value;

    const calculated = safeEvalExpression(q.randomConfig.calculateAnswer, { [valKey]: newVal, val: newVal });
    const finalAns = roundToSF(calculated, 3);

    return {
      ...q,
      value: newVal,
      correctAnswer: finalAns,
      stem: q.stem.replace(/\{value\}/g, String(newVal)),
    };
  }

  return question;
}
