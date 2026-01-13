
export enum Profession {
  ENGINEER = 'Software Engineer',
  DOCTOR = 'Medical Doctor',
  LAWYER = 'Legal Professional',
  MARKETER = 'Digital Marketer',
  ACADEMIC = 'Academic Researcher',
  CREATIVE = 'Creative Writer',
  EXECUTIVE = 'Corporate Executive',
  JOURNALIST = 'Investigative Journalist',
  OTHER = 'Custom Profession'
}

export interface RewriteResponse {
  humanizedText: string;
  originalStats: TextStats;
  humanizedStats: TextStats;
  changesMade: string[];
}

export interface TextStats {
  perplexity: number;
  burstiness: number;
  aiLikelihood: number;
}
