import type {
  Question,
  MultipleChoiceQuestion,
  SingleCalculationQuestion,
  MultiStepCalculationQuestion,
  EquationRearrangementQuestion,
  MatchingQuestion,
  KeywordDefinitionQuestion,
} from '../../../types';

export const aLevelFieldsAndNuclearQuestions: Question[] = [
  // 1. Capacitors: Discharge Exponential Decay Multi-Step
  {
    id: 'alp-cap-decay',
    type: 'calculation-multi',
    subjectId: 'a-level-physics',
    topicId: 'alp-6',
    qualification: 'a-level',
    difficulty: 4,
    marks: 4,
    assessmentObjective: 'AO2',
    stem: 'A capacitor of capacitance 470 µF is fully charged to a potential difference of 12.0 V.\nIt is then discharged through a resistor of resistance {resistance} kΩ.\n\nCalculate the potential difference across the capacitor 5.0 seconds after discharge begins.\nUse: $$V = V_0 e^{-\\frac{t}{RC}}$$',
    steps: [
      {
        id: 's1',
        description: 'Calculate time constant of the circuit (τ = RC)',
        equation: '\\tau = R \\times C',
        expectedAnswer: 4.7,
        tolerance: 0.1,
        unit: 's',
        marks: 1,
      },
      {
        id: 's2',
        description: 'Calculate exponential factor (exp(-t / τ))',
        equation: 'e^{-\\frac{5.0}{\\tau}}',
        expectedAnswer: 0.345,
        tolerance: 0.02,
        unit: '',
        marks: 1,
      },
      {
        id: 's3',
        description: 'Calculate final potential difference (V = V0 × exp(-t / τ))',
        equation: 'V = 12.0 \\times e^{-\\frac{t}{RC}}',
        expectedAnswer: 4.14,
        tolerance: 0.1,
        unit: 'V',
        marks: 2,
      },
    ],
    finalAnswer: 4.14,
    tolerance: 0.1,
    unit: 'V',
    significantFigures: 3,
    randomisable: true,
    randomConfig: {
      variables: [
        { name: 'resistance', min: 8, max: 15, step: 1, decimalPlaces: 0 },
      ],
      calculateAnswer: '12.0 * Math.exp(-5.0 / (resistance * 1000 * 470e-6))',
    },
    workedSolution: 'Step 1: Time constant $\\tau = RC = (10 \\times 10^3\\text{ }\\Omega) \\times (470 \\times 10^{-6}\\text{ F}) = 4.70\\text{ s}$\nStep 2 & 3: $V = 12.0 \\times e^{-\\frac{5.0}{4.70}} = 12.0 \\times e^{-1.064} = 12.0 \\times 0.3451 = 4.14\\text{ V}$',
    explanation: 'Capacitor discharge follows exponential decay $V = V_0 e^{-t/RC}$, where $\\tau = RC$ is the time constant.',
    tags: ['capacitors', 'exponential decay', 'time constant', 'electricity'],
  } as MultiStepCalculationQuestion,

  // 2. Gravitational Fields: Orbital Speed & Kepler
  {
    id: 'alp-grav-orbit',
    type: 'calculation-single',
    subjectId: 'a-level-physics',
    topicId: 'alp-6',
    qualification: 'a-level',
    difficulty: 4,
    marks: 3,
    assessmentObjective: 'AO2',
    stem: 'A satellite orbits Earth (mass $M = 5.97 \\times 10^{24}\\text{ kg}$) at a distance of {radius} $\\times 10^6\\text{ m}$ from Earth\'s centre.\n($G = 6.67 \\times 10^{-11}\\text{ N m}^2\\text{/kg}^2$).\n\nCalculate the orbital speed ($v$) of the satellite to 3 significant figures.\nEquate gravitational force to centripetal force: $$\\frac{G M m}{r^2} = \\frac{m v^2}{r}$$',
    equation: 'v = \\sqrt{\\frac{G M}{r}}',
    variables: [
      { name: 'radius_coeff', symbol: 'r', value: 7.0, unit: '× 10⁶ m' },
    ],
    expectedAnswer: 7540,
    tolerance: 50,
    unit: 'm/s',
    significantFigures: 3,
    randomisable: true,
    randomConfig: {
      variables: [
        { name: 'radius_coeff', min: 6.8, max: 9.0, step: 0.2, decimalPlaces: 1 },
      ],
      calculateAnswer: 'Math.sqrt((6.67e-11 * 5.97e24) / (radius_coeff * 1e6))',
    },
    workedSolution: '$$v = \\sqrt{\\frac{G M}{r}} = \\sqrt{\\frac{6.67 \\times 10^{-11} \\times 5.97 \\times 10^{24}}{7.0 \\times 10^6}} = \\sqrt{\\frac{3.982 \\times 10^{14}}{7.0 \\times 10^6}} = \\sqrt{5.688 \\times 10^7} \\approx 7540\\text{ m/s}$$',
    explanation: 'In circular orbit, the gravitational attraction provides the required centripetal acceleration ($v = \\sqrt{GM/r}$). Speed is independent of satellite mass.',
    tags: ['gravitation', 'orbits', 'centripetal force'],
  } as SingleCalculationQuestion,

  // 3. Simple Harmonic Motion: Definition of SHM
  {
    id: 'alp-shm-kd',
    type: 'keyword-definition',
    subjectId: 'a-level-physics',
    topicId: 'alp-5',
    qualification: 'a-level',
    difficulty: 3,
    marks: 2,
    assessmentObjective: 'AO1',
    stem: 'Define **Simple Harmonic Motion (SHM)** in terms of acceleration and displacement.',
    keyword: 'Simple Harmonic Motion',
    acceptableAnswers: [
      'Motion where acceleration is directly proportional to displacement from equilibrium position and directed towards equilibrium',
      'Acceleration directly proportional to displacement and opposite in direction',
    ],
    keyTerms: ['directly proportional to displacement', 'towards equilibrium'],
    explanation: 'SHM is defined by the governing relation $a = -\\omega^2 x$: acceleration is directly proportional to displacement from equilibrium and directed towards the equilibrium position.',
    tags: ['shm', 'simple harmonic motion', 'oscillations'],
  } as KeywordDefinitionQuestion,
];
