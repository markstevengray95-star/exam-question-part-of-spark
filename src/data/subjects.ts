import type { Subject } from '../types';

export const subjects: Subject[] = [
  // ─── GCSE Combined Science (AQA Trilogy) ────────────────────────
  {
    id: 'gcse-combined-science',
    name: 'GCSE Combined Science: Trilogy',
    qualification: 'gcse',
    colour: '#7c3aed', // Purple
    topics: [
      // Biology topics
      {
        id: 'gcse-bio-1',
        name: 'Cell Biology',
        subtopics: [
          { id: 'b1-1', name: 'Cell Structure & Transport' },
          { id: 'b1-2', name: 'Cell Division (Mitosis)' },
          { id: 'b1-3', name: 'Transport in Cells (Diffusion, Osmosis, Active Transport)' },
        ],
      },
      {
        id: 'gcse-bio-2',
        name: 'Organisation',
        subtopics: [
          { id: 'b2-1', name: 'Principles of Organisation & Digestion' },
          { id: 'b2-2', name: 'Heart & Blood Circulation' },
          { id: 'b2-3', name: 'Plant Tissues, Organs & Systems' },
        ],
      },
      {
        id: 'gcse-bio-3',
        name: 'Infection and Response',
        subtopics: [
          { id: 'b3-1', name: 'Communicable Diseases & Pathogens' },
          { id: 'b3-2', name: 'Immune System & Vaccination' },
          { id: 'b3-3', name: 'Antibiotics & Drug Discovery' },
        ],
      },
      {
        id: 'gcse-bio-4',
        name: 'Bioenergetics',
        subtopics: [
          { id: 'b4-1', name: 'Photosynthesis' },
          { id: 'b4-2', name: 'Respiration & Metabolism' },
        ],
      },
      {
        id: 'gcse-bio-5',
        name: 'Homeostasis and Response',
        subtopics: [
          { id: 'b5-1', name: 'Nervous System & Reflexes' },
          { id: 'b5-2', name: 'Hormonal Control (Blood Glucose & Reproduction)' },
        ],
      },
      {
        id: 'gcse-bio-6',
        name: 'Inheritance, Variation and Evolution',
        subtopics: [
          { id: 'b6-1', name: 'DNA & Genome' },
          { id: 'b6-2', name: 'Genetic Crosses & Punnett Squares' },
          { id: 'b6-3', name: 'Natural Selection & Evolution' },
        ],
      },
      {
        id: 'gcse-bio-7',
        name: 'Ecology',
        subtopics: [
          { id: 'b7-1', name: 'Adaptations & Communities' },
          { id: 'b7-2', name: 'Carbon & Water Cycles' },
          { id: 'b7-3', name: 'Biodiversity & Waste Management' },
        ],
      },
      // Chemistry topics
      {
        id: 'gcse-chem-1',
        name: 'Atomic Structure and the Periodic Table',
        subtopics: [
          { id: 'c1-1', name: 'Atoms, Elements & Compounds' },
          { id: 'c1-2', name: 'Electronic Structure & the Periodic Table' },
          { id: 'c1-3', name: 'Group 1, Group 7 & Group 0 Elements' },
        ],
      },
      {
        id: 'gcse-chem-2',
        name: 'Bonding, Structure and the Properties of Matter',
        subtopics: [
          { id: 'c2-1', name: 'Ionic, Covalent & Metallic Bonding' },
          { id: 'c2-2', name: 'States of Matter & Nanoparticles' },
          { id: 'c2-3', name: 'Giant Covalent Structures (Diamond, Graphite, Graphene)' },
        ],
      },
      {
        id: 'gcse-chem-3',
        name: 'Quantitative Chemistry',
        subtopics: [
          { id: 'c3-1', name: 'Conservation of Mass & Chemical Equations' },
          { id: 'c3-2', name: 'Moles, Relative Formula Mass & Concentrations' },
        ],
      },
      {
        id: 'gcse-chem-4',
        name: 'Chemical Changes',
        subtopics: [
          { id: 'c4-1', name: 'Reactivity of Metals & Extraction' },
          { id: 'c4-2', name: 'Acids, Alkalis, Neutralisation & Salts' },
          { id: 'c4-3', name: 'Electrolysis' },
        ],
      },
      {
        id: 'gcse-chem-5',
        name: 'Energy Changes',
        subtopics: [
          { id: 'c5-1', name: 'Exothermic & Endothermic Reactions' },
          { id: 'c5-2', name: 'Reaction Profiles & Bond Energy Calculations' },
        ],
      },
      {
        id: 'gcse-chem-6',
        name: 'The Rate and Extent of Chemical Change',
        subtopics: [
          { id: 'c6-1', name: 'Measuring Rates of Reaction' },
          { id: 'c6-2', name: 'Factors Affecting Rates & Catalysts' },
          { id: 'c6-3', name: 'Reversible Reactions & Le Chatelier’s Principle' },
        ],
      },
      {
        id: 'gcse-chem-7',
        name: 'Organic Chemistry',
        subtopics: [
          { id: 'c7-1', name: 'Crude Oil, Hydrocarbons & Alkanes' },
          { id: 'c7-2', name: 'Fractional Distillation & Cracking' },
        ],
      },
      {
        id: 'gcse-chem-8',
        name: 'Chemical Analysis',
        subtopics: [
          { id: 'c8-1', name: 'Pure Substances & Formulations' },
          { id: 'c8-2', name: 'Chromatography & Gas Tests' },
        ],
      },
      {
        id: 'gcse-chem-9',
        name: 'Chemistry of the Atmosphere',
        subtopics: [
          { id: 'c9-1', name: 'Evolution of the Atmosphere' },
          { id: 'c9-2', name: 'Greenhouse Gases & Climate Change' },
        ],
      },
      {
        id: 'gcse-chem-10',
        name: 'Using Resources',
        subtopics: [
          { id: 'c10-1', name: 'Potable Water & Water Treatment' },
          { id: 'c10-2', name: 'Life Cycle Assessment (LCA) & Recycling' },
        ],
      },
      // Physics topics
      {
        id: 'gcse-phys-1',
        name: 'Energy',
        subtopics: [
          { id: 'p1-1', name: 'Energy Stores & Transfers' },
          { id: 'p1-2', name: 'Conservation & Dissipation of Energy' },
          { id: 'p1-3', name: 'National and Global Energy Resources' },
        ],
      },
      {
        id: 'gcse-phys-2',
        name: 'Electricity',
        subtopics: [
          { id: 'p2-1', name: 'Current, Potential Difference & Resistance' },
          { id: 'p2-2', name: 'Series and Parallel Circuits' },
          { id: 'p2-3', name: 'Domestic Uses & Safety (Mains, Plugs, Power)' },
        ],
      },
      {
        id: 'gcse-phys-3',
        name: 'Particle Model of Matter',
        subtopics: [
          { id: 'p3-1', name: 'Density of Materials' },
          { id: 'p3-2', name: 'Temperature Changes & Specific Heat Capacity' },
          { id: 'p3-3', name: 'Specific Latent Heat & Particle Motion' },
        ],
      },
      {
        id: 'gcse-phys-4',
        name: 'Atomic Structure',
        subtopics: [
          { id: 'p4-1', name: 'Atoms & Nuclear Radiation (Alpha, Beta, Gamma)' },
          { id: 'p4-2', name: 'Half-Life & Radioactive Decay' },
          { id: 'p4-3', name: 'Contamination & Irradiation' },
        ],
      },
      {
        id: 'gcse-phys-5',
        name: 'Forces',
        subtopics: [
          { id: 'p5-1', name: 'Scalar, Vector & Contact/Non-contact Forces' },
          { id: 'p5-2', name: 'Work Done & Elasticity (Hooke’s Law)' },
          { id: 'p5-3', name: 'Speed, Velocity & Acceleration' },
          { id: 'p5-4', name: 'Newton’s Laws of Motion' },
          { id: 'p5-5', name: 'Stopping Distances & Braking' },
        ],
      },
      {
        id: 'gcse-phys-6',
        name: 'Waves',
        subtopics: [
          { id: 'p6-1', name: 'Transverse & Longitudinal Waves' },
          { id: 'p6-2', name: 'Wave Properties (Reflection, Refraction)' },
          { id: 'p6-3', name: 'Electromagnetic Spectrum' },
        ],
      },
      {
        id: 'gcse-phys-7',
        name: 'Magnetism and Electromagnetism',
        subtopics: [
          { id: 'p7-1', name: 'Permanent & Induced Magnets, Magnetic Fields' },
          { id: 'p7-2', name: 'Electromagnetism & The Motor Effect' },
        ],
      },
    ],
  },

  // ─── GCSE Separate Sciences (Separate Biology, Chemistry, Physics) ───
  {
    id: 'gcse-biology',
    name: 'GCSE Biology',
    qualification: 'gcse',
    colour: '#10b981', // Emerald green
    topics: [
      {
        id: 'gcse-bio-1',
        name: 'Cell Biology',
        subtopics: [
          { id: 'b1-1', name: 'Cell Structure & Microscopy' },
          { id: 'b1-2', name: 'Cell Division, Mitosis & Stem Cells' },
          { id: 'b1-3', name: 'Culturing Microorganisms (Triple only)' },
          { id: 'b1-4', name: 'Transport in Cells' },
        ],
      },
      {
        id: 'gcse-bio-2',
        name: 'Organisation',
        subtopics: [
          { id: 'b2-1', name: 'Enzyme Action & Food Tests' },
          { id: 'b2-2', name: 'Circulatory System & Cardiovascular Disease' },
          { id: 'b2-3', name: 'Plant Transport & Transpiration' },
        ],
      },
      {
        id: 'gcse-bio-3',
        name: 'Infection and Response',
        subtopics: [
          { id: 'b3-1', name: 'Viral, Bacterial, Fungal & Protist Diseases' },
          { id: 'b3-2', name: 'Monoclonal Antibodies (Triple only)' },
          { id: 'b3-3', name: 'Plant Disease & Defences (Triple only)' },
        ],
      },
      {
        id: 'gcse-bio-4',
        name: 'Bioenergetics',
        subtopics: [
          { id: 'b4-1', name: 'Photosynthetic Reaction & Limiting Factors' },
          { id: 'b4-2', name: 'Aerobic & Anaerobic Respiration' },
        ],
      },
      {
        id: 'gcse-bio-5',
        name: 'Homeostasis and Response',
        subtopics: [
          { id: 'b5-1', name: 'The Brain & Eye (Triple only)' },
          { id: 'b5-2', name: 'Control of Body Temperature (Triple only)' },
          { id: 'b5-3', name: 'Kidneys & Dialysis (Triple only)' },
          { id: 'b5-4', name: 'Plant Hormones: Auxins & Gibberellins (Triple only)' },
        ],
      },
      {
        id: 'gcse-bio-6',
        name: 'Inheritance, Variation and Evolution',
        subtopics: [
          { id: 'b6-1', name: 'Sexual vs Asexual Reproduction & Meiosis' },
          { id: 'b6-2', name: 'Protein Synthesis & DNA Structure (Triple only)' },
          { id: 'b6-3', name: 'Genetic Engineering & Selective Breeding' },
          { id: 'b6-4', name: 'Speciation & Fossils' },
        ],
      },
      {
        id: 'gcse-bio-7',
        name: 'Ecology',
        subtopics: [
          { id: 'b7-1', name: 'Trophic Levels & Pyramids of Biomass (Triple only)' },
          { id: 'b7-2', name: 'Decomposition & Biogas (Triple only)' },
          { id: 'b7-3', name: 'Food Security & Sustainable Fisheries' },
        ],
      },
    ],
  },
  {
    id: 'gcse-chemistry',
    name: 'GCSE Chemistry',
    qualification: 'gcse',
    colour: '#06b6d4', // Cyan
    topics: [
      {
        id: 'gcse-chem-1',
        name: 'Atomic Structure and the Periodic Table',
        subtopics: [
          { id: 'c1-1', name: 'Subatomic Particles & Isotopes' },
          { id: 'c1-2', name: 'Periodic Table History (Mendeleev)' },
          { id: 'c1-3', name: 'Transition Metals (Triple only)' },
        ],
      },
      {
        id: 'gcse-chem-2',
        name: 'Bonding, Structure and Properties of Matter',
        subtopics: [
          { id: 'c2-1', name: 'Chemical Bonds (Ionic, Covalent, Metallic)' },
          { id: 'c2-2', name: 'Fullerenes, Graphene & Nanoparticles' },
        ],
      },
      {
        id: 'gcse-chem-3',
        name: 'Quantitative Chemistry',
        subtopics: [
          { id: 'c3-1', name: 'Mole Calculations & Balanced Equations' },
          { id: 'c3-2', name: 'Percentage Yield & Atom Economy (Triple only)' },
          { id: 'c3-3', name: 'Molar Gas Volume Calculations (Triple only)' },
          { id: 'c3-4', name: 'Titration Calculations (Triple only)' },
        ],
      },
      {
        id: 'gcse-chem-4',
        name: 'Chemical Changes',
        subtopics: [
          { id: 'c4-1', name: 'Reactivity & Extraction of Metals' },
          { id: 'c4-2', name: 'Strong vs Weak Acids (Triple only)' },
          { id: 'c4-3', name: 'Electrolysis of Molten & Aqueous Salts' },
        ],
      },
      {
        id: 'gcse-chem-5',
        name: 'Energy Changes',
        subtopics: [
          { id: 'c5-1', name: 'Exothermic & Endothermic Energy Profiles' },
          { id: 'c5-2', name: 'Bond Energies' },
          { id: 'c5-3', name: 'Chemical Cells & Fuel Cells (Triple only)' },
        ],
      },
      {
        id: 'gcse-chem-6',
        name: 'Rate and Extent of Chemical Change',
        subtopics: [
          { id: 'c6-1', name: 'Collision Theory & Catalysis' },
          { id: 'c6-2', name: 'Equilibria & Le Chatelier’s Principle' },
        ],
      },
      {
        id: 'gcse-chem-7',
        name: 'Organic Chemistry',
        subtopics: [
          { id: 'c7-1', name: 'Alkanes, Alkenes & Reactions (Triple only)' },
          { id: 'c7-2', name: 'Alcohols, Carboxylic Acids & Esters (Triple only)' },
          { id: 'c7-3', name: 'Addition & Condensation Polymerisation (Triple only)' },
        ],
      },
      {
        id: 'gcse-chem-8',
        name: 'Chemical Analysis',
        subtopics: [
          { id: 'c8-1', name: 'Purity, Formulations & Chromatography' },
          { id: 'c8-2', name: 'Identification of Cations & Anions (Flame tests, ppt) (Triple only)' },
          { id: 'c8-3', name: 'Instrumental Methods & Flame Emission Spectroscopy (Triple only)' },
        ],
      },
      {
        id: 'gcse-chem-9',
        name: 'Chemistry of the Atmosphere',
        subtopics: [
          { id: 'c9-1', name: 'Evolution of Atmosphere & Greenhouse Effect' },
          { id: 'c9-2', name: 'Atmospheric Pollutants (Carbon monoxide, SO2, NOx)' },
        ],
      },
      {
        id: 'gcse-chem-10',
        name: 'Using Resources',
        subtopics: [
          { id: 'c10-1', name: 'Potable Water, Desalination & Sewage Treatment' },
          { id: 'c10-2', name: 'Corrosion & Prevention (Triple only)' },
          { id: 'c10-3', name: 'Alloys, Ceramics, Polymers & Composites (Triple only)' },
          { id: 'c10-4', name: 'The Haber Process & NPK Fertilisers (Triple only)' },
        ],
      },
    ],
  },
  {
    id: 'gcse-physics',
    name: 'GCSE Physics',
    qualification: 'gcse',
    colour: '#3b82f6', // Blue
    topics: [
      {
        id: 'gcse-phys-1',
        name: 'Energy',
        subtopics: [
          { id: 'p1-1', name: 'Kinetic, GPE, Elastic & Thermal Energy Stores' },
          { id: 'p1-2', name: 'Work, Power & Efficiency Calculations' },
          { id: 'p1-3', name: 'Insulation & Thermal Conductivity' },
        ],
      },
      {
        id: 'gcse-phys-2',
        name: 'Electricity',
        subtopics: [
          { id: 'p2-1', name: 'Circuit Components, Ohm’s Law & I-V Graphs' },
          { id: 'p2-2', name: 'LDRs, Thermistors, Series & Parallel Analysis' },
          { id: 'p2-3', name: 'Mains AC, Plugs, Cables & The National Grid' },
          { id: 'p2-4', name: 'Static Electricity & Electric Fields (Triple only)' },
        ],
      },
      {
        id: 'gcse-phys-3',
        name: 'Particle Model of Matter',
        subtopics: [
          { id: 'p3-1', name: 'Density Calculations & Required Practical' },
          { id: 'p3-2', name: 'Specific Heat Capacity & Latent Heat' },
          { id: 'p3-3', name: 'Gas Pressure, Boyle’s Law & Work on Gases (Triple only)' },
        ],
      },
      {
        id: 'gcse-phys-4',
        name: 'Atomic Structure',
        subtopics: [
          { id: 'p4-1', name: 'Rutherford Scattering & Nuclear Model' },
          { id: 'p4-2', name: 'Alpha, Beta, Gamma Decay & Nuclear Equations' },
          { id: 'p4-3', name: 'Half-Life & Medical Tracers' },
          { id: 'p4-4', name: 'Nuclear Fission & Fusion (Triple only)' },
        ],
      },
      {
        id: 'gcse-phys-5',
        name: 'Forces',
        subtopics: [
          { id: 'p5-1', name: 'Resultant Forces & Vector Diagrams' },
          { id: 'p5-2', name: 'Moments, Levers & Gears (Triple only)' },
          { id: 'p5-3', name: 'Pressure in Fluids & Atmospheric Pressure (Triple only)' },
          { id: 'p5-4', name: 'Distance-Time & Velocity-Time Graphs' },
          { id: 'p5-5', name: 'Newton’s 3 Laws & Momentum (Triple only)' },
        ],
      },
      {
        id: 'gcse-phys-6',
        name: 'Waves',
        subtopics: [
          { id: 'p6-1', name: 'Wave Equation & Ripple Tank Practical' },
          { id: 'p6-2', name: 'Sound Waves & Ultrasound (Triple only)' },
          { id: 'p6-3', name: 'Electromagnetic Waves & Applications' },
          { id: 'p6-4', name: 'Lenses, Ray Diagrams & Magnification (Triple only)' },
          { id: 'p6-5', name: 'Black Body Radiation (Triple only)' },
        ],
      },
      {
        id: 'gcse-phys-7',
        name: 'Magnetism and Electromagnetism',
        subtopics: [
          { id: 'p7-1', name: 'Magnetic Fields & Solenoids' },
          { id: 'p7-2', name: 'Fleming’s Left-Hand Rule & Electric Motors' },
          { id: 'p7-3', name: 'Loudspeakers & Microphones (Triple only)' },
          { id: 'p7-4', name: 'The Generator Effect & Transformers (Triple only)' },
        ],
      },
      {
        id: 'gcse-phys-8',
        name: 'Space Physics',
        subtopics: [
          { id: 'p8-1', name: 'Solar System, Orbital Motion & Satellites (Triple only)' },
          { id: 'p8-2', name: 'Life Cycle of Stars (Triple only)' },
          { id: 'p8-3', name: 'Red-Shift & The Big Bang Theory (Triple only)' },
        ],
      },
    ],
  },

  // ─── A-level Sciences (AQA Specification) ─────────────────────────
  {
    id: 'a-level-biology',
    name: 'A-level Biology',
    qualification: 'a-level',
    colour: '#059669', // Dark emerald
    topics: [
      {
        id: 'alb-1',
        name: 'Biological Molecules',
        subtopics: [
          { id: 'alb1-1', name: 'Carbohydrates & Lipids' },
          { id: 'alb1-2', name: 'Proteins & Enzyme Kinetics' },
          { id: 'alb1-3', name: 'DNA, RNA & ATP' },
        ],
      },
      {
        id: 'alb-2',
        name: 'Cells',
        subtopics: [
          { id: 'alb2-1', name: 'Cell Structure & Ultrastructure' },
          { id: 'alb2-2', name: 'Membrane Transport & Fluid Mosaic Model' },
          { id: 'alb2-3', name: 'Immune System & Monoclonal Antibodies' },
        ],
      },
      {
        id: 'alb-3',
        name: 'Organisms Exchange Substances with Environment',
        subtopics: [
          { id: 'alb3-1', name: 'Gas Exchange Systems (Insects, Fish, Humans)' },
          { id: 'alb3-2', name: 'Digestion & Absorption' },
          { id: 'alb3-3', name: 'Mass Transport in Animals & Plants' },
        ],
      },
      {
        id: 'alb-4',
        name: 'Genetic Information, Variation and Relationships',
        subtopics: [
          { id: 'alb4-1', name: 'Genes, Genetic Code & Protein Synthesis' },
          { id: 'alb4-2', name: 'Meiosis & Genetic Diversity' },
          { id: 'alb4-3', name: 'Biodiversity & Taxonomy' },
        ],
      },
      {
        id: 'alb-5',
        name: 'Energy Transfers In and Between Organisms',
        subtopics: [
          { id: 'alb5-1', name: 'Photosynthesis: Light-dependent & Calvin Cycle' },
          { id: 'alb5-2', name: 'Respiration: Glycolysis, Krebs & Oxidative Phosphorylation' },
          { id: 'alb5-3', name: 'Energy Transfer & Nutrient Cycles' },
        ],
      },
      {
        id: 'alb-6',
        name: 'Organisms Respond to Changes in Internal and External Environments',
        subtopics: [
          { id: 'alb6-1', name: 'Stimuli, Receptors & Nervous Coordination' },
          { id: 'alb6-2', name: 'Synaptic Transmission & Muscle Contraction' },
          { id: 'alb6-3', name: 'Homeostasis: Blood Glucose & Osmoregulation' },
        ],
      },
      {
        id: 'alb-7',
        name: 'Genetics, Populations, Evolution and Ecosystems',
        subtopics: [
          { id: 'alb7-1', name: 'Inheritance, Epistasis & Hardy-Weinberg' },
          { id: 'alb7-2', name: 'Speciation & Population Ecology' },
        ],
      },
      {
        id: 'alb-8',
        name: 'The Control of Gene Expression',
        subtopics: [
          { id: 'alb8-1', name: 'Mutations, Epigenetics & Stem Cells' },
          { id: 'alb8-2', name: 'Gene Technologies: PCR, Electrophoresis & Plasmids' },
        ],
      },
    ],
  },
  {
    id: 'a-level-chemistry',
    name: 'A-level Chemistry',
    qualification: 'a-level',
    colour: '#0284c7', // Sky Blue
    topics: [
      {
        id: 'alc-1',
        name: 'Physical Chemistry',
        subtopics: [
          { id: 'alc1-1', name: 'Atomic Structure & Mass Spectrometry' },
          { id: 'alc1-2', name: 'Amount of Substance & Ideal Gas Equation' },
          { id: 'alc1-3', name: 'Bonding, Shapes of Molecules & Intermolecular Forces' },
          { id: 'alc1-4', name: 'Energetics, Hess’s Law & Born-Haber Cycles' },
          { id: 'alc1-5', name: 'Kinetics, Rate Equations & Arrhenius Equation' },
          { id: 'alc1-6', name: 'Equilibria: Kc, Kp & Acids, Bases, pH & Kw' },
          { id: 'alc1-7', name: 'Redox, Electrode Potentials & Electrochemical Cells' },
        ],
      },
      {
        id: 'alc-2',
        name: 'Inorganic Chemistry',
        subtopics: [
          { id: 'alc2-1', name: 'Periodicity & Period 3 Trends' },
          { id: 'alc2-2', name: 'Group 2 (Alkaline Earths) & Group 7 (Halogens)' },
          { id: 'alc2-3', name: 'Transition Metals: Complexes, Ligands & Catalysis' },
          { id: 'alc2-4', name: 'Reactions of Ions in Aqueous Solution' },
        ],
      },
      {
        id: 'alc-3',
        name: 'Organic Chemistry',
        subtopics: [
          { id: 'alc3-1', name: 'Nomenclature, Isomerism & Alkanes' },
          { id: 'alc3-2', name: 'Halogenoalkanes & Mechanisms (Nucleophilic Substitution/Elimination)' },
          { id: 'alc3-3', name: 'Alkenes & Electrophilic Addition' },
          { id: 'alc3-4', name: 'Alcohols & Carbonyl Compounds (Aldehydes, Ketones)' },
          { id: 'alc3-5', name: 'Carboxylic Acids, Esters & Acylation' },
          { id: 'alc3-6', name: 'Aromatic Chemistry (Benzene) & Amines' },
          { id: 'alc3-7', name: 'Polymers, Amino Acids, Proteins & DNA' },
          { id: 'alc3-8', name: 'Organic Synthesis, NMR Spectroscopy & Chromatography' },
        ],
      },
    ],
  },
  {
    id: 'a-level-physics',
    name: 'A-level Physics',
    qualification: 'a-level',
    colour: '#4f46e5', // Indigo
    topics: [
      {
        id: 'alp-1',
        name: 'Particles and Radiation',
        subtopics: [
          { id: 'alp1-1', name: 'Particles, Antiparticles & Photons' },
          { id: 'alp1-2', name: 'Classification of Particles & Quarks' },
          { id: 'alp1-3', name: 'Photoelectric Effect & Wave-Particle Duality' },
        ],
      },
      {
        id: 'alp-2',
        name: 'Waves and Optics',
        subtopics: [
          { id: 'alp2-1', name: 'Progressive & Stationary Waves' },
          { id: 'alp2-2', name: 'Refraction, Total Internal Reflection & Dispersion' },
          { id: 'alp2-3', name: 'Diffraction, Young’s Double Slit & Diffraction Grating' },
        ],
      },
      {
        id: 'alp-3',
        name: 'Mechanics and Materials',
        subtopics: [
          { id: 'alp3-1', name: 'Vectors, Moments & Equilibrium' },
          { id: 'alp3-2', name: 'Motion Along a Straight Line & Projectiles' },
          { id: 'alp3-3', name: 'Newton’s Laws, Momentum & Conservation' },
          { id: 'alp3-4', name: 'Work, Energy, Power & Efficiency' },
          { id: 'alp3-5', name: 'Bulk Materials: Young Modulus, Stress & Strain' },
        ],
      },
      {
        id: 'alp-4',
        name: 'Electricity',
        subtopics: [
          { id: 'alp4-1', name: 'Current-Voltage Characteristics & Resistivity' },
          { id: 'alp4-2', name: 'Circuits, Potential Dividers, EMF & Internal Resistance' },
        ],
      },
      {
        id: 'alp-5',
        name: 'Further Mechanics and Thermal Physics',
        subtopics: [
          { id: 'alp5-1', name: 'Circular Motion & Simple Harmonic Motion (SHM)' },
          { id: 'alp5-2', name: 'Thermal Energy Transfer & Ideal Gas Laws' },
          { id: 'alp5-3', name: 'Molecular Kinetic Theory Model' },
        ],
      },
      {
        id: 'alp-6',
        name: 'Fields and Their Consequences',
        subtopics: [
          { id: 'alp6-1', name: 'Gravitational Fields, Potential & Orbits' },
          { id: 'alp6-2', name: 'Electric Fields, Coulomb’s Law & Capacitors' },
          { id: 'alp6-3', name: 'Magnetic Fields, Electromagnetic Induction & Faraday/Lenz' },
        ],
      },
      {
        id: 'alp-7',
        name: 'Nuclear Physics',
        subtopics: [
          { id: 'alp7-1', name: 'Rutherford Scattering & Nuclear Radius' },
          { id: 'alp7-2', name: 'Radioactive Decay Law, Decay Constant & Half-Life' },
          { id: 'alp7-3', name: 'Mass Defect, Binding Energy & Nuclear Fission/Fusion' },
        ],
      },
      {
        id: 'alp-8',
        name: 'Astrophysics',
        subtopics: [
          { id: 'alp8-1', name: 'Telescopes & Optical Instruments' },
          { id: 'alp8-2', name: 'Classification of Stars & Hertzsprung-Russell Diagram' },
          { id: 'alp8-3', name: 'Cosmology, Hubble’s Law & Doppler Red Shift' },
        ],
      },
    ],
  },
];
