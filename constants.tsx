
import { Profession } from './types';

export const PROFESSION_DETAILS: Record<Profession, { icon: string; description: string }> = {
  [Profession.ENGINEER]: { icon: 'fa-code', description: 'Pragmatic, technical, solution-oriented with occasional jargon and dry humor.' },
  [Profession.DOCTOR]: { icon: 'fa-stethoscope', description: 'Empathetic yet clinical, precise, and focused on patient outcomes and evidence.' },
  [Profession.LAWYER]: { icon: 'fa-scale-balanced', description: 'Analytical, formal, cautious, using precise syntax and logical hierarchies.' },
  [Profession.MARKETER]: { icon: 'fa-bullhorn', description: 'Persuasive, punchy, trend-aware, and focused on engagement and conversion.' },
  [Profession.ACADEMIC]: { icon: 'fa-graduation-cap', description: 'Nuanced, cited, complex structures, and focused on methodology and theoretical rigor.' },
  [Profession.CREATIVE]: { icon: 'fa-pen-nib', description: 'Descriptive, evocative, rhythmic, and rich in metaphor and varying sentence flow.' },
  [Profession.EXECUTIVE]: { icon: 'fa-briefcase', description: 'Concise, high-level, strategic, and focused on ROI and bottom-line impact.' },
  [Profession.JOURNALIST]: { icon: 'fa-newspaper', description: 'Direct, objective, narrative-driven, and focused on the "who, what, where, when, why".' },
  [Profession.OTHER]: { icon: 'fa-user-pen', description: 'Enter a custom role to define a specific tone and technical vocabulary manually.' }
};
