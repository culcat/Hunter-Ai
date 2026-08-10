import { GradeLevel, EnglishLevel } from './resume';

export type WorkFormat = 'remote' | 'office' | 'hybrid';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'project';

export interface Vacancy {
  id: string;
  externalId?: string;
  source: 'headhunter' | 'habr' | 'getmatch' | 'custom';
  title: string;
  company: string;
  description: string;
  country?: string;
  region?: string;
  city?: string;
  workFormat: WorkFormat;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  grade: GradeLevel;
  employmentType: EmploymentType;
  englishLevel?: EnglishLevel;
  url: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface VacancyFilterDto {
  country?: string;
  region?: string;
  city?: string;
  workFormat?: WorkFormat;
  salaryFrom?: number;
  salaryTo?: number;
  techStack?: string[];
  grade?: GradeLevel;
  company?: string;
  employmentType?: EmploymentType;
  englishLevel?: EnglishLevel;
  publishedAfter?: string;
  onlyWithSalary?: boolean;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export interface CreateVacancyDto {
  externalId?: string;
  source: 'headhunter' | 'habr' | 'getmatch' | 'custom';
  title: string;
  company: string;
  description: string;
  country?: string;
  region?: string;
  city?: string;
  workFormat: WorkFormat;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  skills: string[];
  grade: GradeLevel;
  employmentType: EmploymentType;
  englishLevel?: EnglishLevel;
  url: string;
  publishedAt?: string;
}
