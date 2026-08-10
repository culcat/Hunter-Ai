export interface AiMatchResult {
  vacancyId: string;
  resumeId: string;
  score: number; // 0 - 100
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  recommendation: string;
}

export interface EvaluateMatchDto {
  resumeId: string;
  vacancyId: string;
}
