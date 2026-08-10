export type GradeLevel = 'Intern' | 'Junior' | 'Middle' | 'Senior' | 'Lead';
export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'Native';

export interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description: string;
  technologies: string[];
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
}

export interface Project {
  name: string;
  description: string;
  role?: string;
  technologies: string[];
  url?: string;
}

export interface ParsedResumeData {
  position: string;
  grade: GradeLevel;
  totalExperienceMonths: number;
  skills: string[];
  education: Education[];
  englishLevel: EnglishLevel;
  projects: Project[];
  workExperience: WorkExperience[];
  summary: string;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  rawText: string;
  parsedData: ParsedResumeData;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResumeDto {
  title: string;
  parsedData: ParsedResumeData;
  isPrimary?: boolean;
}

export interface UpdateResumeDto {
  title?: string;
  parsedData?: Partial<ParsedResumeData>;
  isPrimary?: boolean;
}
