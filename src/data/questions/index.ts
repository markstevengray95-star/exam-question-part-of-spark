import type { Question } from '../../types';
import { gcseCombinedBiologyQuestions } from './gcse-combined-science/biology';
import { gcseChemistryQuestions } from './gcse-combined-science/chemistry';
import { gcsePhysicsQuestions } from './gcse-combined-science/physics';
import { gcseMechanicsQuestions } from './gcse-physics/mechanics';
import { gcseGeneticsAndEcologyQuestions } from './gcse-biology/geneticsAndEcology';
import { gcseQuantitativeAndEnergyQuestions } from './gcse-chemistry/quantitativeAndEnergy';
import { gcseWavesAndElectricityQuestions } from './gcse-physics/wavesAndElectricity';
import { aLevelPhysicsQuestions } from './a-level-physics/particles';
import { aLevelFieldsAndNuclearQuestions } from './a-level-physics/fieldsAndNuclear';
import { aLevelChemistryQuestions } from './a-level-chemistry/organic';
import { aLevelPhysicalAndInorganicQuestions } from './a-level-chemistry/physicalAndInorganic';
import { aLevelBiologyQuestions } from './a-level-biology/biologicalMolecules';
import { aLevelPhysiologyAndGeneticsQuestions } from './a-level-biology/physiologyAndGenetics';

export const allQuestions: Question[] = [
  ...gcseCombinedBiologyQuestions,
  ...gcseChemistryQuestions,
  ...gcsePhysicsQuestions,
  ...gcseMechanicsQuestions,
  ...gcseGeneticsAndEcologyQuestions,
  ...gcseQuantitativeAndEnergyQuestions,
  ...gcseWavesAndElectricityQuestions,
  ...aLevelPhysicsQuestions,
  ...aLevelFieldsAndNuclearQuestions,
  ...aLevelChemistryQuestions,
  ...aLevelPhysicalAndInorganicQuestions,
  ...aLevelBiologyQuestions,
  ...aLevelPhysiologyAndGeneticsQuestions,
];

export {
  gcseCombinedBiologyQuestions,
  gcseChemistryQuestions,
  gcsePhysicsQuestions,
  gcseMechanicsQuestions,
  gcseGeneticsAndEcologyQuestions,
  gcseQuantitativeAndEnergyQuestions,
  gcseWavesAndElectricityQuestions,
  aLevelPhysicsQuestions,
  aLevelFieldsAndNuclearQuestions,
  aLevelChemistryQuestions,
  aLevelPhysicalAndInorganicQuestions,
  aLevelBiologyQuestions,
  aLevelPhysiologyAndGeneticsQuestions,
};
