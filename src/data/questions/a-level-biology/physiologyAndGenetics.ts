import type {
  Question,
  MultipleChoiceQuestion,
  MultipleAnswerQuestion,
  SequencingQuestion,
  ShortResponseQuestion,
} from '../../../types';

export const aLevelPhysiologyAndGeneticsQuestions: Question[] = [
  // 1. Sequencing: Synaptic Transmission at a Cholinergic Synapse
  {
    id: 'alb-synapse-seq',
    type: 'sequencing',
    subjectId: 'a-level-biology',
    topicId: 'alb-6',
    qualification: 'a-level',
    difficulty: 4,
    marks: 4,
    assessmentObjective: 'AO1',
    stem: 'Arrange the sequence of events during nerve impulse transmission across a cholinergic synapse in chronological order:',
    items: [
      { id: 's1', text: 'Action potential reaches presynaptic knob, depolarising membrane and opening voltage-gated Ca²⁺ channels' },
      { id: 's2', text: 'Calcium ions diffuse into presynaptic knob, causing synaptic vesicles to fuse with presynaptic membrane' },
      { id: 's3', text: 'Acetylcholine is released by exocytosis, diffuses across synaptic cleft, and binds to receptor sites on postsynaptic Na⁺ channels' },
      { id: 's4', text: 'Ligand-gated Na⁺ channels open, Na⁺ diffuses into postsynaptic neurone, generating an excitatory postsynaptic potential (EPSP)' },
      { id: 's5', text: 'Acetylcholinesterase hydrolyses acetylcholine into choline and ethanoic acid, closing Na⁺ channels and preventing continuous stimulation' },
    ],
    correctOrder: ['s1', 's2', 's3', 's4', 's5'],
    explanation: '1) Depolarisation opens Ca2+ channels; 2) Influx triggers vesicle fusion; 3) Acetylcholine diffuses across cleft; 4) Binds receptors, triggering Na+ influx and EPSP; 5) Acetylcholinesterase breaks down ACh to reset the synapse.',
    tags: ['synapse', 'nervous system', 'action potential', 'neurotransmitters'],
  } as SequencingQuestion,

  // 2. Photosynthesis: The Light-Independent Reaction (Calvin Cycle)
  {
    id: 'alb-calvin-cycle',
    type: 'short-response',
    subjectId: 'a-level-biology',
    topicId: 'alb-5',
    qualification: 'a-level',
    difficulty: 4,
    marks: 4,
    assessmentObjective: 'AO1',
    stem: 'Describe how carbon dioxide is converted into triose phosphate (TP) in the light-independent stage (Calvin cycle) of photosynthesis.',
    markScheme: [
      { id: 'p1', point: 'Carbon dioxide reacts with ribulose bisphosphate (RuBP) catalysed by the enzyme Rubisco', marks: 1, required: true, keywords: ['RuBP', 'rubisco', 'ribulose bisphosphate'] },
      { id: 'p2', point: 'Forms two molecules of glycerate 3-phosphate (GP)', marks: 1, required: true, keywords: ['glycerate 3-phosphate', 'GP'] },
      { id: 'p3', point: 'GP is reduced to triose phosphate (TP)', marks: 1, required: true, keywords: ['reduced', 'reduction', 'triose phosphate', 'TP'] },
      { id: 'p4', point: 'Using energy from ATP and hydrogen / reducing power from reduced NADP (NADPH) from light-dependent reaction', marks: 1, required: true, keywords: ['ATP', 'reduced NADP', 'NADPH'] },
    ],
    modelAnswer: 'In the stroma, carbon dioxide reacts with ribulose bisphosphate (RuBP, 5C), catalysed by the enzyme Rubisco, to produce two molecules of glycerate 3-phosphate (GP, 3C). ATP from the light-dependent reaction provides energy, while reduced NADP (NADPH) supplies electrons/protons to reduce GP into triose phosphate (TP, 3C).',
    explanation: 'Rubisco fixes CO2 onto RuBP to yield 2x GP, which are reduced to TP using ATP and NADPH from the thylakoid reactions.',
    tags: ['photosynthesis', 'calvin cycle', 'rubisco', 'bioenergetics'],
  } as ShortResponseQuestion,
];
