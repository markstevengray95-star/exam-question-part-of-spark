// ─── Marking Engine ──────────────────────────────────────────────
// Centralised marking for all question types in the SPARK Exam app.

import type {
  Question,
  UserAnswer,
  MarkResult,
  StepFeedback,
  SubQuestion,
  MultipleChoiceQuestion,
  MultipleAnswerQuestion,
  TrueFalseQuestion,
  FillBlanksQuestion,
  KeywordDefinitionQuestion,
  ShortResponseQuestion,
  ExtendedResponseQuestion,
  SingleCalculationQuestion,
  MultiStepCalculationQuestion,
  EquationRearrangementQuestion,
  UnitConversionQuestion,
  DragDropQuestion,
  MatchingQuestion,
  SequencingQuestion,
  DiagramLabellingQuestion,
  GraphPlottingQuestion,
  GraphInterpretationQuestion,
  DataAnalysisQuestion,
  RequiredPracticalQuestion,
  MarkPoint,
} from '../types';

// ─── Helpers ─────────────────────────────────────────────────────

/** Round a number to the given number of significant figures. */
function roundToSF(n: number, sf: number): number {
  if (n === 0) return 0;
  const magnitude = Math.floor(Math.log10(Math.abs(n))) + 1;
  const factor = Math.pow(10, sf - magnitude);
  return Math.round(n * factor) / factor;
}

/** Normalise whitespace in a string for comparison. */
function normalise(s: string): string {
  return s.replace(/\s+/g, ' ').trim().toLowerCase();
}

/** Check whether a numeric answer is within tolerance. */
function withinTolerance(
  actual: number,
  expected: number,
  tolerance: number,
): boolean {
  return Math.abs(actual - expected) <= Math.abs(tolerance);
}

/** Build a default MarkResult shell. */
function emptyResult(
  questionId: string,
  marksAvailable: number,
): MarkResult {
  return {
    questionId,
    marksAwarded: 0,
    marksAvailable,
    isCorrect: false,
    isPartiallyCorrect: false,
    feedback: '',
    autoMarked: true,
  };
}

// ─── Sub-question marker (reused by graph-interp, data-analysis, rp) ──

function markSubQuestion(
  sq: SubQuestion,
  answer: UserAnswer | undefined,
): StepFeedback {
  const fb: StepFeedback = {
    stepId: sq.id,
    correct: false,
    marksAwarded: 0,
    feedback: '',
  };
  if (!answer) {
    fb.feedback = 'No answer provided.';
    return fb;
  }

  switch (sq.type) {
    case 'multiple-choice': {
      if (answer.selectedOptionId === sq.correctOptionId) {
        fb.correct = true;
        fb.marksAwarded = sq.marks;
        fb.feedback = 'Correct.';
      } else {
        fb.feedback = `Incorrect. The correct answer was option ${sq.correctOptionId}.`;
      }
      break;
    }
    case 'calculation-single': {
      const num = answer.numericAnswer;
      if (
        num !== undefined &&
        sq.expectedAnswer !== undefined &&
        sq.tolerance !== undefined &&
        withinTolerance(num, sq.expectedAnswer, sq.tolerance)
      ) {
        fb.correct = true;
        fb.marksAwarded = sq.marks;
        fb.feedback = 'Correct.';
      } else {
        fb.feedback = `Incorrect. Expected ${sq.expectedAnswer} ${sq.unit ?? ''}.`;
      }
      break;
    }
    case 'short-response': {
      if (sq.markScheme && answer.textAnswer) {
        const text = answer.textAnswer.toLowerCase();
        let awarded = 0;
        const found: string[] = [];
        const missed: string[] = [];
        for (const mp of sq.markScheme) {
          const kws = mp.keywords ?? [mp.point];
          const hit = kws.some((k) => text.includes(k.toLowerCase()));
          if (hit) {
            awarded += mp.marks;
            found.push(mp.point);
          } else {
            missed.push(mp.point);
          }
        }
        fb.marksAwarded = Math.min(awarded, sq.marks);
        fb.correct = fb.marksAwarded === sq.marks;
        fb.feedback = fb.correct
          ? 'Full marks.'
          : `Awarded ${fb.marksAwarded}/${sq.marks}. Missed: ${missed.join('; ')}.`;
      } else {
        fb.feedback = 'No answer or no mark scheme available.';
      }
      break;
    }
    case 'fill-blanks': {
      if (sq.blanks && answer.blanksAnswers) {
        let correct = 0;
        for (const blank of sq.blanks) {
          const userVal = answer.blanksAnswers[blank.id];
          if (userVal) {
            const matches = blank.acceptableAnswers.some((a) =>
              blank.caseSensitive
                ? a === userVal
                : a.toLowerCase() === userVal.toLowerCase(),
            );
            if (matches) correct++;
          }
        }
        fb.marksAwarded = Math.round(
          (correct / sq.blanks.length) * sq.marks,
        );
        fb.correct = correct === sq.blanks.length;
        fb.feedback = fb.correct
          ? 'All blanks correct.'
          : `${correct}/${sq.blanks.length} blanks correct.`;
      }
      break;
    }
    default:
      fb.feedback = 'Unknown sub-question type.';
  }
  return fb;
}

// ─── Per-type markers ────────────────────────────────────────────

function markMultipleChoice(
  q: MultipleChoiceQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  if (a.selectedOptionId === q.correctOptionId) {
    r.marksAwarded = q.marks;
    r.isCorrect = true;
    r.feedback = 'Correct!';
  } else {
    const correctOpt = q.options.find((o) => o.id === q.correctOptionId);
    r.feedback = `Incorrect. The correct answer was: ${correctOpt?.text ?? q.correctOptionId}.`;
  }
  return r;
}

function markMultipleAnswer(
  q: MultipleAnswerQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const selected = a.selectedOptionIds ?? [];
  const correctSet = new Set(q.correctOptionIds);

  let score = 0;
  for (const id of selected) {
    if (correctSet.has(id)) {
      score += 1;
    } else {
      score -= 1;
    }
  }
  score = Math.max(0, score);
  // Scale score to marks available: each correct selection is proportional
  const maxRaw = q.correctOptionIds.length;
  r.marksAwarded = Math.min(
    q.marks,
    Math.round((score / maxRaw) * q.marks),
  );
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'All correct!'
    : `You scored ${r.marksAwarded}/${q.marks}.`;
  return r;
}

function markTrueFalse(q: TrueFalseQuestion, a: UserAnswer): MarkResult {
  const r = emptyResult(q.id, q.marks);
  if (a.booleanAnswer === q.correctAnswer) {
    r.marksAwarded = q.marks;
    r.isCorrect = true;
    r.feedback = 'Correct!';
  } else {
    r.feedback = `Incorrect. The answer is ${q.correctAnswer ? 'True' : 'False'}.`;
  }
  return r;
}

function markFillBlanks(q: FillBlanksQuestion, a: UserAnswer): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const answers = a.blanksAnswers ?? {};
  let correctCount = 0;
  const details: StepFeedback[] = [];

  for (const blank of q.blanks) {
    const userVal = answers[blank.id] ?? '';
    const isMatch = blank.acceptableAnswers.some((acc) =>
      blank.caseSensitive
        ? acc === userVal
        : acc.toLowerCase() === userVal.toLowerCase(),
    );
    if (isMatch) correctCount++;
    details.push({
      stepId: blank.id,
      correct: isMatch,
      marksAwarded: isMatch ? 1 : 0,
      feedback: isMatch
        ? 'Correct.'
        : `Incorrect. Acceptable answers: ${blank.acceptableAnswers.join(', ')}.`,
    });
  }

  const totalBlanks = q.blanks.length;
  r.marksAwarded = Math.round((correctCount / totalBlanks) * q.marks);
  r.isCorrect = correctCount === totalBlanks;
  r.isPartiallyCorrect = correctCount > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'All blanks correct!'
    : `${correctCount}/${totalBlanks} blanks correct.`;
  r.detailedFeedback = details;
  return r;
}

function markKeywordDefinition(
  q: KeywordDefinitionQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const text = (a.textAnswer ?? '').toLowerCase();
  const found = q.keyTerms.filter((kw) => text.includes(kw.toLowerCase()));
  const total = q.keyTerms.length;

  r.marksAwarded = Math.round((found.length / total) * q.marks);
  r.isCorrect = found.length === total;
  r.isPartiallyCorrect = found.length > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'Correct — all key terms included.'
    : `Included ${found.length}/${total} key terms. Missing: ${q.keyTerms
        .filter((kw) => !text.includes(kw.toLowerCase()))
        .join(', ')}.`;
  return r;
}

function markShortResponse(
  q: ShortResponseQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const text = (a.textAnswer ?? '').toLowerCase();
  let awarded = 0;
  const details: StepFeedback[] = [];
  const missed: string[] = [];

  for (const mp of q.markScheme) {
    const kws = mp.keywords && mp.keywords.length > 0 ? mp.keywords : [mp.point];
    const hit = kws.some((k) => text.includes(k.toLowerCase()));
    const stepMarks = hit ? mp.marks : 0;
    awarded += stepMarks;
    if (!hit) missed.push(mp.point);
    details.push({
      stepId: mp.id,
      correct: hit,
      marksAwarded: stepMarks,
      feedback: hit ? `✓ ${mp.point}` : `✗ ${mp.point}`,
    });
  }
  r.marksAwarded = Math.min(awarded, q.marks);
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'Full marks!'
    : `${r.marksAwarded}/${q.marks}. Missing points: ${missed.join('; ')}.`;
  r.detailedFeedback = details;
  return r;
}

function markExtendedResponse(
  q: ExtendedResponseQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  r.autoMarked = false; // always flag for review
  const text = (a.textAnswer ?? '').toLowerCase();

  // Keyword-based estimate
  let awarded = 0;
  const details: StepFeedback[] = [];
  for (const mp of q.markScheme) {
    const kws = mp.keywords && mp.keywords.length > 0 ? mp.keywords : [mp.point];
    const hit = kws.some((k) => text.includes(k.toLowerCase()));
    const stepMarks = hit ? mp.marks : 0;
    awarded += stepMarks;
    details.push({
      stepId: mp.id,
      correct: hit,
      marksAwarded: stepMarks,
      feedback: hit ? `✓ ${mp.point}` : `✗ ${mp.point}`,
    });
  }

  // Apply level descriptors if present
  if (q.levelDescriptors && q.levelDescriptors.length > 0) {
    const sorted = [...q.levelDescriptors].sort(
      (a, b) => b.level - a.level,
    );
    let bestLevel = sorted[sorted.length - 1]; // lowest by default
    for (const ld of sorted) {
      if (awarded >= ld.marksRange[0]) {
        bestLevel = ld;
        break;
      }
    }
    // Clamp awarded to the level range
    awarded = Math.min(awarded, bestLevel.marksRange[1]);
    awarded = Math.max(awarded, bestLevel.marksRange[0]);
  }

  r.marksAwarded = Math.min(awarded, q.marks);
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = `Estimated ${r.marksAwarded}/${q.marks} (needs teacher review).`;
  r.detailedFeedback = details;
  return r;
}

function markCalculationSingle(
  q: SingleCalculationQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const num = a.numericAnswer;
  if (num === undefined || num === null) {
    r.feedback = `No numeric answer provided. Expected ${q.expectedAnswer} ${q.unit}.`;
    return r;
  }

  const correct = withinTolerance(num, q.expectedAnswer, q.tolerance);
  let sfCorrect = true;
  if (q.significantFigures) {
    const rounded = roundToSF(num, q.significantFigures);
    const expectedRounded = roundToSF(q.expectedAnswer, q.significantFigures);
    sfCorrect = rounded === expectedRounded;
  }

  if (correct && sfCorrect) {
    r.marksAwarded = q.marks;
    r.isCorrect = true;
    r.feedback = 'Correct!';
  } else if (correct && !sfCorrect) {
    // Correct value but wrong sig figs — lose 1 mark
    r.marksAwarded = Math.max(0, q.marks - 1);
    r.isPartiallyCorrect = r.marksAwarded > 0;
    r.feedback = `Correct value but not to ${q.significantFigures} significant figures. ${r.marksAwarded}/${q.marks}.`;
  } else {
    r.feedback = `Incorrect. Expected ${q.expectedAnswer} ${q.unit}.`;
    // Award 1 mark for showing working if they at least attempted
    if (a.workingOut && a.workingOut.trim().length > 10) {
      r.marksAwarded = Math.min(1, q.marks);
      r.isPartiallyCorrect = true;
      r.feedback += ' (1 mark for working shown.)';
    }
  }
  return r;
}

function markCalculationMulti(
  q: MultiStepCalculationQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const subAnswers = a.subAnswers ?? {};
  const details: StepFeedback[] = [];
  let totalAwarded = 0;

  for (const step of q.steps) {
    const stepAnswer = subAnswers[step.id];
    const fb: StepFeedback = {
      stepId: step.id,
      correct: false,
      marksAwarded: 0,
      feedback: '',
    };

    if (!stepAnswer || stepAnswer.numericAnswer === undefined) {
      fb.feedback = `No answer for step: ${step.description}. Expected ${step.expectedAnswer} ${step.unit}.`;
    } else {
      const correct = withinTolerance(
        stepAnswer.numericAnswer,
        step.expectedAnswer,
        step.tolerance,
      );
      if (correct) {
        fb.correct = true;
        fb.marksAwarded = step.marks;
        fb.feedback = `Correct: ${step.description}.`;
      } else {
        fb.feedback = `Incorrect: ${step.description}. Expected ${step.expectedAnswer} ${step.unit}.`;
        // Error carried forward: award 1 mark if working is shown
        if (
          stepAnswer.workingOut &&
          stepAnswer.workingOut.trim().length > 5
        ) {
          fb.marksAwarded = Math.min(1, step.marks);
          fb.feedback += ' (ECF: 1 mark for method.)';
        }
      }
    }
    totalAwarded += fb.marksAwarded;
    details.push(fb);
  }

  // Also check final answer
  const finalNum = a.numericAnswer;
  if (finalNum !== undefined && withinTolerance(finalNum, q.finalAnswer, q.tolerance)) {
    // If they got the final answer right, ensure they get at least most marks
    totalAwarded = Math.max(totalAwarded, Math.ceil(q.marks * 0.8));
  }

  r.marksAwarded = Math.min(totalAwarded, q.marks);
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'Correct — all steps!'
    : `${r.marksAwarded}/${q.marks} marks.`;

  if (q.significantFigures && finalNum !== undefined) {
    const sfOk =
      roundToSF(finalNum, q.significantFigures) ===
      roundToSF(q.finalAnswer, q.significantFigures);
    if (!sfOk && r.marksAwarded > 0) {
      r.marksAwarded = Math.max(0, r.marksAwarded - 1);
      r.feedback += ` (−1 for significant figures.)`;
    }
  }

  r.detailedFeedback = details;
  return r;
}

function markEquationRearrangement(
  q: EquationRearrangementQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const text = normalise(a.textAnswer ?? '');
  const match = q.acceptableFormats.some((f) => normalise(f) === text);
  if (match) {
    r.marksAwarded = q.marks;
    r.isCorrect = true;
    r.feedback = 'Correct rearrangement!';
  } else {
    r.feedback = `Incorrect. Acceptable forms: ${q.acceptableFormats.join(' or ')}.`;
  }
  return r;
}

function markUnitConversion(
  q: UnitConversionQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const num = a.numericAnswer;
  if (num === undefined || num === null) {
    r.feedback = `No answer. Expected ${q.correctAnswer} ${q.toUnit}.`;
    return r;
  }
  if (withinTolerance(num, q.correctAnswer, q.tolerance)) {
    r.marksAwarded = q.marks;
    r.isCorrect = true;
    r.feedback = 'Correct!';
  } else {
    r.feedback = `Incorrect. ${q.value} ${q.fromUnit} = ${q.correctAnswer} ${q.toUnit}.`;
  }
  return r;
}

function markDragDrop(q: DragDropQuestion, a: UserAnswer): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const placements = a.placements ?? {};
  let correct = 0;
  const total = Object.keys(q.correctPlacements).length;
  const details: StepFeedback[] = [];

  for (const [itemId, zoneId] of Object.entries(q.correctPlacements)) {
    const isCorrect = placements[itemId] === zoneId;
    if (isCorrect) correct++;
    details.push({
      stepId: itemId,
      correct: isCorrect,
      marksAwarded: isCorrect ? 1 : 0,
      feedback: isCorrect
        ? `Correct placement.`
        : `Incorrect — should be in ${q.dropZones.find((z) => z.id === zoneId)?.label ?? zoneId}.`,
    });
  }

  r.marksAwarded = Math.round((correct / total) * q.marks);
  r.isCorrect = correct === total;
  r.isPartiallyCorrect = correct > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'All placements correct!'
    : `${correct}/${total} correct.`;
  r.detailedFeedback = details;
  return r;
}

function markMatching(q: MatchingQuestion, a: UserAnswer): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const pairs = a.pairs ?? [];
  let correct = 0;
  const total = q.correctPairs.length;

  const correctSet = new Set(
    q.correctPairs.map(([l, r]) => `${l}::${r}`),
  );
  for (const [l, right] of pairs) {
    if (correctSet.has(`${l}::${right}`)) correct++;
  }

  r.marksAwarded = Math.round((correct / total) * q.marks);
  r.isCorrect = correct === total;
  r.isPartiallyCorrect = correct > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'All pairs matched correctly!'
    : `${correct}/${total} correct matches.`;
  return r;
}

function markSequencing(q: SequencingQuestion, a: UserAnswer): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const ordering = a.ordering ?? [];
  const allCorrect =
    ordering.length === q.correctOrder.length &&
    ordering.every((id, i) => id === q.correctOrder[i]);

  if (allCorrect) {
    r.marksAwarded = q.marks;
    r.isCorrect = true;
    r.feedback = 'Correct sequence!';
  } else {
    r.feedback = 'Incorrect order. No partial marks for sequencing.';
  }
  return r;
}

function markDiagramLabelling(
  q: DiagramLabellingQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const labelAnswers = a.labelAnswers ?? {};
  let correct = 0;
  const total = q.labels.length;
  const details: StepFeedback[] = [];

  for (const label of q.labels) {
    const userLabel = (labelAnswers[label.id] ?? '').toLowerCase().trim();
    const isCorrect = userLabel === label.correctLabel.toLowerCase().trim();
    if (isCorrect) correct++;
    details.push({
      stepId: label.id,
      correct: isCorrect,
      marksAwarded: isCorrect ? 1 : 0,
      feedback: isCorrect
        ? 'Correct.'
        : `Incorrect — should be "${label.correctLabel}".`,
    });
  }

  r.marksAwarded = Math.round((correct / total) * q.marks);
  r.isCorrect = correct === total;
  r.isPartiallyCorrect = correct > 0 && !r.isCorrect;
  r.feedback = r.isCorrect
    ? 'All labels correct!'
    : `${correct}/${total} labels correct.`;
  r.detailedFeedback = details;
  return r;
}

function markGraphPlotting(
  q: GraphPlottingQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  r.autoMarked = false; // needs manual review

  const plotPoints = a.plotPoints ?? [];
  let matchedPoints = 0;
  const pointTolerance = 0.1; // 10% tolerance

  for (const expected of q.dataPoints) {
    const found = plotPoints.some(
      (p) =>
        withinTolerance(
          p.x,
          expected.x,
          Math.abs(expected.x) * pointTolerance || 0.5,
        ) &&
        withinTolerance(
          p.y,
          expected.y,
          Math.abs(expected.y) * pointTolerance || 0.5,
        ),
    );
    if (found) matchedPoints++;
  }

  const ratio = q.dataPoints.length > 0 ? matchedPoints / q.dataPoints.length : 0;
  // Keyword-based marking from markScheme
  let schemeMarks = 0;
  if (q.markScheme) {
    for (const mp of q.markScheme) {
      // For graph plotting, award marks for correct data points
      if (mp.keywords && mp.keywords.includes('points') && ratio >= 0.8) {
        schemeMarks += mp.marks;
      }
    }
  }

  r.marksAwarded = Math.min(
    Math.round(ratio * q.marks) + schemeMarks,
    q.marks,
  );
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = `${matchedPoints}/${q.dataPoints.length} data points plotted correctly (needs teacher review).`;
  return r;
}

function markGraphInterpretation(
  q: GraphInterpretationQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const subAnswers = a.subAnswers ?? {};
  const details: StepFeedback[] = [];
  let totalAwarded = 0;

  for (const sq of q.subQuestions) {
    const fb = markSubQuestion(sq, subAnswers[sq.id]);
    totalAwarded += fb.marksAwarded;
    details.push(fb);
  }

  r.marksAwarded = Math.min(totalAwarded, q.marks);
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = `${r.marksAwarded}/${q.marks} marks.`;
  r.detailedFeedback = details;
  return r;
}

function markDataAnalysis(
  q: DataAnalysisQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const subAnswers = a.subAnswers ?? {};
  const details: StepFeedback[] = [];
  let totalAwarded = 0;

  for (const sq of q.subQuestions) {
    const fb = markSubQuestion(sq, subAnswers[sq.id]);
    totalAwarded += fb.marksAwarded;
    details.push(fb);
  }

  r.marksAwarded = Math.min(totalAwarded, q.marks);
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = `${r.marksAwarded}/${q.marks} marks.`;
  r.detailedFeedback = details;
  return r;
}

function markRequiredPractical(
  q: RequiredPracticalQuestion,
  a: UserAnswer,
): MarkResult {
  const r = emptyResult(q.id, q.marks);
  const subAnswers = a.subAnswers ?? {};
  const details: StepFeedback[] = [];
  let totalAwarded = 0;

  for (const sq of q.subQuestions) {
    const fb = markSubQuestion(sq, subAnswers[sq.id]);
    totalAwarded += fb.marksAwarded;
    details.push(fb);
  }

  r.marksAwarded = Math.min(totalAwarded, q.marks);
  r.isCorrect = r.marksAwarded === q.marks;
  r.isPartiallyCorrect = r.marksAwarded > 0 && !r.isCorrect;
  r.feedback = `${r.marksAwarded}/${q.marks} marks.`;
  r.detailedFeedback = details;
  return r;
}

// ─── Public API ──────────────────────────────────────────────────

/**
 * Mark a single question against a user answer.
 */
export function markQuestion(
  question: Question,
  answer: UserAnswer,
): MarkResult {
  switch (question.type) {
    case 'multiple-choice':
      return markMultipleChoice(question, answer);
    case 'multiple-answer':
      return markMultipleAnswer(question, answer);
    case 'true-false':
      return markTrueFalse(question, answer);
    case 'fill-blanks':
      return markFillBlanks(question, answer);
    case 'keyword-definition':
      return markKeywordDefinition(question, answer);
    case 'short-response':
      return markShortResponse(question, answer);
    case 'extended-response':
      return markExtendedResponse(question, answer);
    case 'calculation-single':
      return markCalculationSingle(question, answer);
    case 'calculation-multi':
      return markCalculationMulti(question, answer);
    case 'equation-rearrangement':
      return markEquationRearrangement(question, answer);
    case 'unit-conversion':
      return markUnitConversion(question, answer);
    case 'drag-drop':
      return markDragDrop(question, answer);
    case 'matching':
      return markMatching(question, answer);
    case 'sequencing':
      return markSequencing(question, answer);
    case 'diagram-labelling':
      return markDiagramLabelling(question, answer);
    case 'graph-plotting':
      return markGraphPlotting(question, answer);
    case 'graph-interpretation':
      return markGraphInterpretation(question, answer);
    case 'data-analysis':
      return markDataAnalysis(question, answer);
    case 'required-practical':
      return markRequiredPractical(question, answer);
    default: {
      // Exhaustive check — should never reach here
      const _exhaustive: never = question;
      return emptyResult((_exhaustive as Question).id, 0);
    }
  }
}

/**
 * Mark an entire quiz — returns a map of questionId → MarkResult.
 */
export function markQuiz(
  questions: Question[],
  answers: Record<string, UserAnswer>,
): Record<string, MarkResult> {
  const results: Record<string, MarkResult> = {};
  for (const q of questions) {
    const a = answers[q.id];
    if (a) {
      results[q.id] = markQuestion(q, a);
    } else {
      results[q.id] = emptyResult(q.id, q.marks);
      results[q.id].feedback = 'Not attempted.';
    }
  }
  return results;
}
