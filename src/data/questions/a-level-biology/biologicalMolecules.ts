import type {
  Question,
  MultipleChoiceQuestion,
  MultipleAnswerQuestion,
  ShortResponseQuestion,
  SequencingQuestion,
  GraphInterpretationQuestion,
  KeywordDefinitionQuestion,
} from '../../../types';

export const aLevelBiologyQuestions: Question[] = [
  // 1. Multiple Choice: Protein Structure
  {
    id: 'alb-mcq-1',
    type: 'multiple-choice',
    subjectId: 'a-level-biology',
    topicId: 'alb-1',
    qualification: 'a-level',
    difficulty: 3,
    marks: 1,
    assessmentObjective: 'AO1',
    stem: 'Which type of bond stabilizes the secondary structure (such as an $\\alpha$-helix or $\\beta$-pleated sheet) of a polypeptide chain?',
    options: [
      { id: 'a', text: 'Disulfide bridges between cysteine R-groups' },
      { id: 'b', text: 'Hydrogen bonds between $-C=O$ and $-N-H$ groups of the peptide backbone', explanation: 'Secondary structure is maintained strictly by regular hydrogen bonding between peptide backbone groups, not R-group interactions.' },
      { id: 'c', text: 'Ionic bonds between oppositely charged R-groups' },
      { id: 'd', text: 'Hydrophobic interactions between non-polar side chains' },
    ],
    correctOptionId: 'b',
    explanation: 'Secondary structure arises from regular hydrogen bonds forming between oxygen of carbonyl groups and hydrogen of amino groups in the peptide backbone. R-group interactions stabilize the tertiary structure.',
    commonMisconceptions: ['Attributing secondary structure stabilization to R-group interactions instead of the backbone.'],
    tags: ['proteins', 'secondary structure', 'biological molecules'],
  } as MultipleChoiceQuestion,

  // 2. Keyword Definition: Competitive Inhibitor
  {
    id: 'alb-kd-1',
    type: 'keyword-definition',
    subjectId: 'a-level-biology',
    topicId: 'alb-1',
    qualification: 'a-level',
    difficulty: 3,
    marks: 2,
    assessmentObjective: 'AO1',
    stem: 'Define the term **competitive inhibitor** in the context of enzyme-catalysed reactions.',
    keyword: 'competitive inhibitor',
    acceptableAnswers: [
      'A molecule with a similar shape to the substrate that binds to the active site, preventing substrate binding',
      'A substance that competes with the substrate for the enzyme active site because it has a complementary shape',
    ],
    keyTerms: ['similar shape', 'substrate', 'active site', 'binds'],
    explanation: 'A competitive inhibitor has a molecular structure similar to the substrate, allowing it to fit into and block the enzyme active site, preventing enzyme-substrate complex formation.',
    tags: ['enzymes', 'inhibitors'],
  } as KeywordDefinitionQuestion,

  // 3. Sequencing: Semi-Conservative DNA Replication
  {
    id: 'alb-seq-1',
    type: 'sequencing',
    subjectId: 'a-level-biology',
    topicId: 'alb-1',
    qualification: 'a-level',
    difficulty: 4,
    marks: 4,
    assessmentObjective: 'AO1',
    stem: 'Place the events of semi-conservative DNA replication in the correct chronological sequence:',
    items: [
      { id: 'e1', text: 'DNA helicase breaks hydrogen bonds between complementary base pairs, unwinding the double helix' },
      { id: 'e2', text: 'Both original strands act as templates as free floating DNA nucleotides align by complementary base pairing (A to T, C to G)' },
      { id: 'e3', text: 'DNA polymerase catalyses condensation reactions joining adjacent nucleotides, forming phosphodiester bonds along the sugar-phosphate backbone' },
      { id: 'e4', text: 'Hydrogen bonds reform between bases, producing two genetically identical DNA molecules, each containing one conserved and one newly synthesised strand' },
    ],
    correctOrder: ['e1', 'e2', 'e3', 'e4'],
    explanation: 'DNA replication begins with helicase unwinding the helix, followed by complementary base pairing of free nucleotides, phosphodiester bond formation by DNA polymerase (working 5\' to 3\'), and completion of the two semi-conserved daughter helices.',
    tags: ['DNA replication', 'nucleic acids'],
  } as SequencingQuestion,

  // 4. Graph Interpretation: Enzyme Kinetics and Substrate Concentration
  {
    id: 'alb-gi-1',
    type: 'graph-interpretation',
    subjectId: 'a-level-biology',
    topicId: 'alb-1',
    qualification: 'a-level',
    difficulty: 4,
    marks: 4,
    assessmentObjective: 'AO2',
    stem: 'The graph below shows the rate of an enzyme-controlled reaction as substrate concentration increases at a fixed enzyme concentration.',
    graphData: {
      title: 'Rate of Reaction vs Substrate Concentration',
      xAxisLabel: 'Substrate Concentration',
      yAxisLabel: 'Initial Rate of Reaction',
      xUnit: 'mmol/dm³',
      yUnit: 'μmol/min',
      datasets: [
        {
          label: 'Uninhibited Enzyme',
          colour: '#10b981',
          data: [
            { x: 0, y: 0 },
            { x: 1, y: 35 },
            { x: 2, y: 60 },
            { x: 4, y: 85 },
            { x: 8, y: 100 },
            { x: 12, y: 102 },
            { x: 16, y: 102 },
          ],
        },
      ],
    },
    subQuestions: [
      {
        id: 'sq1',
        stem: 'Explain why the rate of reaction levels off at substrate concentrations greater than 8 mmol/dm³.',
        type: 'short-response',
        marks: 2,
        markScheme: [
          { id: 'p1', point: 'All enzyme active sites are occupied / saturated with substrate', marks: 1, required: true, keywords: ['saturated', 'occupied', 'full', 'active sites'] },
          { id: 'p2', point: 'Enzyme concentration becomes the limiting factor', marks: 1, required: true, keywords: ['enzyme concentration', 'limiting factor'] },
        ],
        modelAnswer: 'At high substrate concentrations (> 8 mmol/dm³), all active sites of the enzyme molecules are saturated with substrate. Maximum turnover rate ($V_{max}$) is reached, and enzyme concentration is now the limiting factor.',
      },
      {
        id: 'sq2',
        stem: 'If a competitive inhibitor were added to this reaction mixture, what would happen to the maximum rate ($V_{max}$) at very high substrate concentrations?',
        type: 'multiple-choice',
        marks: 2,
        options: [
          { id: 'same', text: 'Vmax remains unchanged, because sufficient substrate outcompetes the inhibitor' },
          { id: 'lower', text: 'Vmax is permanently reduced because the inhibitor denatures active sites' },
          { id: 'zero', text: 'Vmax drops to zero' },
        ],
        correctOptionId: 'same',
      },
    ],
    explanation: 'With a competitive inhibitor, increasing substrate concentration sufficiently outcompetes the inhibitor for active sites, reaching the same $V_{max}$, though with a higher $K_m$.',
    tags: ['enzymes', 'enzyme kinetics', 'Vmax'],
  } as GraphInterpretationQuestion,

  // 5. Short Response: Triglyceride vs Phospholipid Structure and Function
  {
    id: 'alb-sr-1',
    type: 'short-response',
    subjectId: 'a-level-biology',
    topicId: 'alb-1',
    qualification: 'a-level',
    difficulty: 4,
    marks: 4,
    assessmentObjective: 'AO1',
    stem: 'Compare the chemical structure of a triglyceride with that of a phospholipid and explain how the structure of a phospholipid relates to its function in cell surface membranes.',
    markScheme: [
      { id: 'p1', point: 'Triglyceride has 1 glycerol bonded to 3 fatty acids via ester bonds', marks: 1, required: true, keywords: ['3 fatty acids', 'three fatty acids'] },
      { id: 'p2', point: 'Phospholipid replaces one fatty acid with a phosphate group (1 glycerol, 2 fatty acids, 1 phosphate)', marks: 1, required: true, keywords: ['phosphate group', 'two fatty acids', '2 fatty acids'] },
      { id: 'p3', point: 'Phospholipids are amphipathic: hydrophilic phosphate head and hydrophobic fatty acid tails', marks: 1, required: true, keywords: ['hydrophilic head', 'hydrophobic tail', 'amphipathic'] },
      { id: 'p4', point: 'Forms a phospholipid bilayer with hydrophobic tails shielded internally and heads facing aqueous cytoplasm/tissue fluid', marks: 1, required: true, keywords: ['bilayer', 'tails inside', 'heads outside', 'aqueous'] },
    ],
    modelAnswer: 'A triglyceride consists of one glycerol molecule bonded to three fatty acids by ester bonds. In a phospholipid, one fatty acid is replaced by a hydrophilic phosphate group, resulting in one glycerol, two fatty acids, and a phosphate group.\n\nThis makes phospholipids amphipathic: the phosphate head is hydrophilic (polar) and interacts with water, while the fatty acid hydrocarbon tails are hydrophobic (non-polar). In aqueous environments, they spontaneously assemble into a stable bilayer with hydrophobic tails oriented inwards away from water, creating a selectively permeable barrier to water-soluble molecules.',
    explanation: 'The amphipathic nature of phospholipids is fundamental to the fluid-mosaic model of biological membranes.',
    tags: ['lipids', 'phospholipids', 'membranes'],
  } as ShortResponseQuestion,
];
