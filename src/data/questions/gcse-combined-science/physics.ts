import type {
  Question,
  MultipleChoiceQuestion,
  MultipleAnswerQuestion,
  TrueFalseQuestion,
  FillBlanksQuestion,
  SingleCalculationQuestion,
  MultiStepCalculationQuestion,
  EquationRearrangementQuestion,
  UnitConversionQuestion,
  DragDropQuestion,
  DiagramLabellingQuestion,
  GraphInterpretationQuestion,
  GraphPlottingQuestion,
  RequiredPracticalQuestion,
} from '../../../types';

export const gcsePhysicsQuestions: Question[] = [
  // 1. Single Calculation with Randomisation: Kinetic Energy
  {
    id: 'gcse-phys-calc-1',
    type: 'calculation-single',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-1',
    qualification: 'gcse',
    difficulty: 2,
    marks: 2,
    assessmentObjective: 'AO2',
    stem: 'A runner of mass {mass} kg accelerates to a velocity of {velocity} m/s.\n\nCalculate their kinetic energy ($E_k$).\nUse the equation: $$E_k = \\frac{1}{2}mv^2$$',
    equation: 'E_k = 0.5 \\times m \\times v^2',
    variables: [
      { name: 'mass', symbol: 'm', value: 60, unit: 'kg' },
      { name: 'velocity', symbol: 'v', value: 8, unit: 'm/s' },
    ],
    expectedAnswer: 1920,
    tolerance: 10,
    unit: 'J',
    significantFigures: 3,
    randomisable: true,
    randomConfig: {
      variables: [
        { name: 'mass', min: 40, max: 90, step: 5, decimalPlaces: 0 },
        { name: 'velocity', min: 4, max: 12, step: 1, decimalPlaces: 0 },
      ],
      calculateAnswer: '0.5 * mass * velocity * velocity',
    },
    workedSolution: '$$E_k = \\frac{1}{2} \\times 60 \\times 8^2 = 0.5 \\times 60 \\times 64 = 1920\\text{ J}$$',
    explanation: 'Kinetic energy depends on half the mass multiplied by velocity squared.',
    commonMisconceptions: ['Forgetting to square the velocity', 'Squaring 0.5 * m * v instead of just v'],
    tags: ['kinetic energy', 'energy stores'],
  } as SingleCalculationQuestion,

  // 2. Multi-Step Calculation with Randomisation: Gravitational Potential to Kinetic Energy
  {
    id: 'gcse-phys-calc-multi-1',
    type: 'calculation-multi',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-1',
    qualification: 'gcse',
    difficulty: 4,
    marks: 4,
    assessmentObjective: 'AO2',
    stem: 'A roller coaster carriage of mass {mass} kg is at rest at the top of a track {height} m above the ground ($g = 9.8\\text{ N/kg}$).\n\nAssuming negligible resistive forces, calculate the speed of the carriage when it reaches the bottom of the drop.',
    steps: [
      {
        id: 's1',
        description: 'Calculate initial gravitational potential energy ($E_p = mgh$)',
        equation: 'E_p = m \\times g \\times h',
        expectedAnswer: 78400,
        tolerance: 200,
        unit: 'J',
        marks: 1,
      },
      {
        id: 's2',
        description: 'Equate Ep to kinetic energy ($E_k = \\frac{1}{2}mv^2$)',
        equation: 'E_k = E_p',
        expectedAnswer: 78400,
        tolerance: 200,
        unit: 'J',
        marks: 1,
      },
      {
        id: 's3',
        description: 'Calculate final speed ($v = \\sqrt{2gh}$)',
        equation: 'v = \\sqrt{\\frac{2E_k}{m}}',
        expectedAnswer: 19.8,
        tolerance: 0.5,
        unit: 'm/s',
        marks: 2,
      },
    ],
    finalAnswer: 19.8,
    tolerance: 0.5,
    unit: 'm/s',
    significantFigures: 3,
    randomisable: true,
    randomConfig: {
      variables: [
        { name: 'mass', min: 200, max: 600, step: 50, decimalPlaces: 0 },
        { name: 'height', min: 15, max: 45, step: 5, decimalPlaces: 0 },
      ],
      calculateAnswer: 'Math.sqrt(2 * 9.8 * height)',
    },
    workedSolution: 'Step 1: $E_p = mgh = 400 \\times 9.8 \\times 20 = 78,400\\text{ J}$\nStep 2: Conservation of energy: $E_k = E_p = 78,400\\text{ J}$\nStep 3: $v = \\sqrt{\\frac{2 \\times E_k}{m}} = \\sqrt{\\frac{2 \\times 78400}{400}} = \\sqrt{392} \\approx 19.8\\text{ m/s}$ (or directly $v = \\sqrt{2gh}$)',
    explanation: 'By conservation of energy, the loss in gravitational potential energy equals the gain in kinetic energy when friction and air resistance are negligible.',
    tags: ['conservation of energy', 'multi-step calculation'],
  } as MultiStepCalculationQuestion,

  // 3. Equation Rearrangement: Ohm’s Law
  {
    id: 'gcse-phys-eq-1',
    type: 'equation-rearrangement',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-2',
    qualification: 'gcse',
    difficulty: 2,
    marks: 1,
    assessmentObjective: 'AO1',
    stem: 'The potential difference across a resistor is given by: $$V = I R$$\nRearrange this equation to make resistance ($R$) the subject.',
    originalEquation: 'V = I * R',
    targetVariable: 'R',
    correctRearrangement: 'R = V / I',
    acceptableFormats: ['R = V / I', 'R = V/I', 'V / I', 'V/I'],
    hints: ['Divide both sides by current (I).'],
    explanation: 'Dividing both sides of $V = IR$ by current $I$ yields $R = \\frac{V}{I}$.',
    tags: ['electricity', 'equations'],
  } as EquationRearrangementQuestion,

  // 4. Unit Conversion: kW to W and hours to seconds
  {
    id: 'gcse-phys-uc-1',
    type: 'unit-conversion',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-2',
    qualification: 'gcse',
    difficulty: 2,
    marks: 1,
    assessmentObjective: 'AO1',
    stem: 'An electric kettle has a power rating of {value} kW. Convert this power into Watts (W).',
    value: 2.2,
    fromUnit: 'kW',
    toUnit: 'W',
    correctAnswer: 2200,
    tolerance: 1,
    conversionSteps: [
      '1 kilowatt (kW) = 1,000 Watts (W)',
      'Multiply the value in kW by 1,000',
      '2.2 × 1,000 = 2,200 W',
    ],
    randomisable: true,
    randomConfig: {
      variables: [
        { name: 'val', min: 1.2, max: 3.5, step: 0.1, decimalPlaces: 1 },
      ],
      calculateAnswer: 'val * 1000',
    },
    explanation: 'The kilo- prefix means $10^3$ or 1,000. So multiply by 1,000.',
    tags: ['power', 'unit conversion'],
  } as UnitConversionQuestion,

  // 5. Drag and Drop: Energy Stores and Pathways
  {
    id: 'gcse-phys-dd-1',
    type: 'drag-drop',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-1',
    qualification: 'gcse',
    difficulty: 3,
    marks: 3,
    assessmentObjective: 'AO1',
    stem: 'Match each description to its correct energy store or pathway category by dragging the items into the zones:',
    items: [
      { id: 'i1', content: 'Energy stored in chemical bonds of food or fuel' },
      { id: 'i2', content: 'Energy transferred by an electric current flowing' },
      { id: 'i3', content: 'Energy stored in an object stretched or compressed' },
    ],
    dropZones: [
      { id: 'z1', label: 'Chemical Energy Store' },
      { id: 'z2', label: 'Electrical Work Pathway' },
      { id: 'z3', label: 'Elastic Potential Store' },
    ],
    correctPlacements: {
      i1: 'z1',
      i2: 'z2',
      i3: 'z3',
    },
    explanation: 'Chemical and elastic potential are energy stores (ways energy is kept within a system), while electrical work is a transfer pathway (a mechanism by which energy moves between stores).',
    tags: ['energy stores', 'drag and drop'],
  } as DragDropQuestion,

  // 6. Diagram Labelling: The Rutherford Alpha Scattering Experiment
  {
    id: 'gcse-phys-dl-1',
    type: 'diagram-labelling',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-4',
    qualification: 'gcse',
    difficulty: 3,
    marks: 3,
    assessmentObjective: 'AO1',
    stem: 'Label the key components of the Rutherford alpha particle scattering experiment apparatus:',
    diagramSvg: `<svg viewBox="0 0 400 240" class="w-full h-auto bg-slate-900 rounded-lg p-2">
      <!-- Alpha Source -->
      <rect x="20" y="90" width="50" height="40" fill="#475569" stroke="#94a3b8" stroke-width="2" rx="4"/>
      <text x="45" y="115" fill="#f8fafc" font-size="10" text-anchor="middle">Source</text>
      <!-- Alpha beam -->
      <line x1="70" y1="110" x2="180" y2="110" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4"/>
      <!-- Gold Foil -->
      <line x1="185" y1="40" x2="185" y2="180" stroke="#eab308" stroke-width="4"/>
      <!-- Scattered tracks -->
      <line x1="185" y1="110" x2="330" y2="110" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2"/>
      <line x1="185" y1="110" x2="310" y2="40" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2"/>
      <line x1="185" y1="110" x2="90" y2="40" stroke="#f59e0b" stroke-width="2" stroke-dasharray="2"/>
      <!-- Detector Ring -->
      <path d="M 120 30 A 130 130 0 1 1 120 190" fill="none" stroke="#38bdf8" stroke-width="3"/>
      <!-- Pins -->
      <circle cx="45" cy="75" r="8" fill="#ef4444" />
      <text x="45" y="79" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">1</text>
      <circle cx="185" cy="25" r="8" fill="#ef4444" />
      <text x="185" y="29" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">2</text>
      <circle cx="345" cy="110" r="8" fill="#ef4444" />
      <text x="345" y="114" fill="#fff" font-size="10" font-weight="bold" text-anchor="middle">3</text>
    </svg>`,
    labels: [
      { id: '1', correctLabel: 'Alpha source (in lead box)', x: 45, y: 75 },
      { id: '2', correctLabel: 'Thin gold foil', x: 185, y: 25 },
      { id: '3', correctLabel: 'Zinc sulfide detector screen', x: 345, y: 110 },
    ],
    labelOptions: [
      'Alpha source (in lead box)',
      'Thin gold foil',
      'Zinc sulfide detector screen',
      'Cathode ray tube',
      'Geiger-Müller tube',
    ],
    explanation: 'Alpha particles from a radioactive source passed through a thin gold foil. Most passed straight through, but a small fraction deflected through large angles, proving the nuclear model of the atom.',
    tags: ['atomic structure', 'diagram labelling'],
  } as DiagramLabellingQuestion,

  // 7. Graph Interpretation: Current-Voltage (I-V) Characteristics
  {
    id: 'gcse-phys-gi-1',
    type: 'graph-interpretation',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-2',
    qualification: 'gcse',
    difficulty: 3,
    marks: 4,
    assessmentObjective: 'AO2',
    stem: 'The graph below shows the current-voltage characteristic of an electrical component.',
    graphData: {
      title: 'Current vs Potential Difference for a Filament Lamp',
      xAxisLabel: 'Potential Difference',
      yAxisLabel: 'Current',
      xUnit: 'V',
      yUnit: 'A',
      datasets: [
        {
          label: 'Filament Lamp',
          colour: '#3b82f6',
          data: [
            { x: -6, y: -0.65 },
            { x: -4, y: -0.55 },
            { x: -2, y: -0.35 },
            { x: 0, y: 0 },
            { x: 2, y: 0.35 },
            { x: 4, y: 0.55 },
            { x: 6, y: 0.65 },
          ],
        },
      ],
    },
    subQuestions: [
      {
        id: 'sq1',
        stem: 'Identify the component whose I-V graph is shown above.',
        type: 'multiple-choice',
        marks: 1,
        options: [
          { id: 'resistor', text: 'Ohmic conductor (fixed resistor at constant temperature)' },
          { id: 'lamp', text: 'Filament lamp' },
          { id: 'diode', text: 'Diode' },
          { id: 'thermistor', text: 'Thermistor' },
        ],
        correctOptionId: 'lamp',
      },
      {
        id: 'sq2',
        stem: 'Explain why the resistance of this component increases as the potential difference increases.',
        type: 'short-response',
        marks: 3,
        markScheme: [
          { id: 'm1', point: 'Current increases, causing temperature of filament to increase', marks: 1, required: true, keywords: ['temperature', 'hotter', 'heats up'] },
          { id: 'm2', point: 'Metal ions / lattice vibrate more violently', marks: 1, required: true, keywords: ['vibrate', 'lattice', 'ions'] },
          { id: 'm3', point: 'More frequent collisions with moving electrons resist charge flow', marks: 1, required: true, keywords: ['collisions', 'electrons', 'flow'] },
        ],
        modelAnswer: 'As the potential difference increases, current increases, which heats the filament wire. The higher temperature causes positive metal ions in the lattice to vibrate with greater amplitude, resulting in more frequent collisions with moving delocalised electrons, thus increasing resistance.',
      },
    ],
    explanation: 'A filament lamp is a non-ohmic conductor. Its resistance rises with temperature as lattice ion vibrations impede electron flow.',
    tags: ['electricity', 'graph interpretation'],
  } as GraphInterpretationQuestion,

  // 8. Graph Plotting: Hooke’s Law (Force vs Extension)
  {
    id: 'gcse-phys-gp-1',
    type: 'graph-plotting',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-5',
    qualification: 'gcse',
    difficulty: 3,
    marks: 4,
    assessmentObjective: 'AO2',
    stem: 'A student measured the extension of a spring when different weights were suspended from it. The data obtained is:\n\nForce (N): 0, 1.0, 2.0, 3.0, 4.0, 5.0\nExtension (cm): 0, 2.5, 5.0, 7.5, 10.0, 12.5\n\nPlot the points on the graph grid and identify the relationship.',
    dataPoints: [
      { x: 0, y: 0 },
      { x: 1.0, y: 2.5 },
      { x: 2.0, y: 5.0 },
      { x: 3.0, y: 7.5 },
      { x: 4.0, y: 10.0 },
      { x: 5.0, y: 12.5 },
    ],
    xAxisLabel: 'Force',
    yAxisLabel: 'Extension',
    xUnit: 'N',
    yUnit: 'cm',
    expectedLineType: 'straight',
    markScheme: [
      { id: 'p1', point: 'Accurate plotting of data points (± 0.5 grid square)', marks: 2, required: true },
      { id: 'p2', point: 'Straight line of best fit drawn passing through the origin', marks: 1, required: true },
      { id: 'p3', point: 'Recognising directly proportional relationship ($F = ke$)', marks: 1, required: true },
    ],
    explanation: 'According to Hooke’s Law, extension is directly proportional to applied force, provided the limit of proportionality is not exceeded. This yields a straight line through the origin.',
    tags: ['forces', 'graph plotting', 'Hooke’s Law'],
  } as GraphPlottingQuestion,

  // 9. Required Practical: Determining the Resistance of a Wire
  {
    id: 'gcse-phys-rp-1',
    type: 'required-practical',
    subjectId: 'gcse-combined-science',
    topicId: 'gcse-phys-2',
    qualification: 'gcse',
    difficulty: 3,
    marks: 5,
    assessmentObjective: 'AO3',
    practicalTitle: 'Investigating Factors Affecting the Resistance of Electrical Circuits',
    practicalNumber: 3,
    stem: 'A student set up a circuit with a meter rule and crocodile clips to measure how the resistance of a constantan wire varies with its length.',
    apparatus: ['Ammeter', 'Voltmeter', 'Meter rule', 'Crocodile clips', 'Constantan resistance wire', 'Power supply', 'Connecting leads'],
    subQuestions: [
      {
        id: 'sq1',
        stem: 'How should the voltmeter be connected in relation to the test wire?',
        type: 'multiple-choice',
        marks: 1,
        options: [
          { id: 'parallel', text: 'In parallel across the length of wire being tested' },
          { id: 'series', text: 'In series between the switch and the wire' },
          { id: 'power', text: 'Directly across the power supply terminals only' },
        ],
        correctOptionId: 'parallel',
      },
      {
        id: 'sq2',
        stem: 'State one significant hazard in this experiment and how the student should minimise the risk.',
        type: 'short-response',
        marks: 2,
        markScheme: [
          { id: 'm1', point: 'Wire heating up / risk of burns', marks: 1, required: true, keywords: ['hot wire', 'heat', 'burns', 'fire'] },
          { id: 'm2', point: 'Disconnect power supply between readings / use low potential difference', marks: 1, required: true, keywords: ['switch off', 'disconnect', 'low voltage', 'low p.d.'] },
        ],
        modelAnswer: 'The wire can get very hot, causing burns. To minimise this, disconnect the power pack or switch off the circuit between taking readings, and use a low potential difference.',
      },
      {
        id: 'sq3',
        stem: 'For a wire of length 0.40 m, the voltmeter reads 2.4 V and the ammeter reads 0.80 A. Calculate the resistance of this wire.',
        type: 'calculation-single',
        marks: 2,
        expectedAnswer: 3.0,
        tolerance: 0.1,
        unit: 'Ω',
        modelAnswer: '$$R = \\frac{V}{I} = \\frac{2.4\\text{ V}}{0.80\\text{ A}} = 3.0\\text{ }\\Omega$$',
      },
    ],
    explanation: 'Resistance is directly proportional to wire length: $R = \\frac{\\rho L}{A}$. The voltmeter measures p.d. in parallel, and switching off between readings prevents temperature changes from altering the wire’s resistance.',
    tags: ['resistance', 'required practical'],
  } as RequiredPracticalQuestion,
];
