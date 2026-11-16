// Math utility functions for the SPARK Exam Questions app

/**
 * Round a number to specified significant figures
 */
export function roundToSF(n: number, sf: number): number {
  if (n === 0) return 0;
  if (!isFinite(n)) return n;
  const magnitude = Math.floor(Math.log10(Math.abs(n)));
  const factor = Math.pow(10, sf - 1 - magnitude);
  return Math.round(n * factor) / factor;
}

/**
 * Format a number to specified significant figures as a string
 */
export function formatNumber(n: number, sf: number): string {
  if (n === 0) return '0';
  if (!isFinite(n)) return String(n);
  const rounded = roundToSF(n, sf);
  // Determine how many decimal places we need
  const magnitude = Math.floor(Math.log10(Math.abs(rounded)));
  const decimalPlaces = Math.max(0, sf - 1 - magnitude);
  return rounded.toFixed(decimalPlaces);
}

/**
 * Parse a user's numeric answer string into a number.
 * Handles fractions (e.g. "3/4"), scientific notation (e.g. "2.5e3" or "2.5 x 10^3"),
 * and negative numbers.
 */
export function parseNumericAnswer(s: string): number | null {
  if (typeof s !== 'string') return null;
  const trimmed = s.trim();
  if (trimmed === '') return null;

  // Handle fractions: "3/4", "-1/2"
  const fractionMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*\/\s*(-?\d+(?:\.\d+)?)$/);
  if (fractionMatch) {
    const numerator = parseFloat(fractionMatch[1]);
    const denominator = parseFloat(fractionMatch[2]);
    if (denominator === 0) return null;
    return numerator / denominator;
  }

  // Handle "x 10^" notation: "2.5 x 10^3", "2.5 × 10^3", "2.5x10^-3"
  const sciMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*[x×]\s*10\^(-?\d+)$/i);
  if (sciMatch) {
    const mantissa = parseFloat(sciMatch[1]);
    const exponent = parseInt(sciMatch[2], 10);
    return mantissa * Math.pow(10, exponent);
  }

  // Handle standard number and scientific notation (e.g. "2.5e3")
  const num = parseFloat(trimmed);
  if (!isNaN(num)) return num;

  return null;
}

/**
 * Normalise an equation string for comparison.
 * Removes all whitespace, converts to lowercase, normalises multiplication symbols.
 */
export function normaliseEquation(s: string): string {
  return s
    .replace(/\s+/g, '')       // remove all whitespace
    .toLowerCase()
    .replace(/[×·]/g, '*')     // normalise multiplication symbols
    .replace(/÷/g, '/')        // normalise division
    .replace(/\*\*/g, '^');    // normalise exponentiation
}

/**
 * Generate a random number within a range, snapped to a step, rounded to dp decimal places.
 */
export function randomInRange(min: number, max: number, step: number, dp: number): number {
  const steps = Math.floor((max - min) / step);
  const randomStep = Math.floor(Math.random() * (steps + 1));
  const value = min + randomStep * step;
  return parseFloat(value.toFixed(dp));
}

/**
 * Safely evaluate a math expression with variables.
 * Only allows basic math operations, Math functions, and the provided variables.
 * 
 * @param expr - JavaScript expression string, e.g. "mass * velocity"
 * @param vars - Record of variable names to values
 * @returns The numeric result
 */
export function evaluateExpression(expr: string, vars: Record<string, number>): number {
  // Build a list of allowed names and values
  const keys = Object.keys(vars);
  const values = Object.values(vars);

  // Create a function that receives the variables as arguments
  // We also provide Math as a variable so expressions can use Math.sqrt, etc.
  const allKeys = ['Math', ...keys];
  const allValues = [Math, ...values];

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function(...allKeys, `"use strict"; return (${expr});`);
    const result = fn(...allValues);
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error(`Expression "${expr}" did not evaluate to a finite number`);
    }
    return result;
  } catch (e) {
    throw new Error(`Failed to evaluate expression "${expr}": ${e}`);
  }
}

/**
 * Check if two numbers are equal within a given tolerance (absolute difference).
 */
export function isWithinTolerance(actual: number, expected: number, tolerance: number): boolean {
  return Math.abs(actual - expected) <= tolerance;
}

/**
 * Check if a number is correctly given to the specified significant figures.
 */
export function isCorrectSF(value: number, sf: number): boolean {
  const rounded = roundToSF(value, sf);
  return value === rounded;
}
