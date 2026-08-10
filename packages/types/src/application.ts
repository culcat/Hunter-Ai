import { Vacancy } from './vacancy';

export type ApplicationStatus = 'applied' | 'screening' | 'interview' | 'offer' | 'rejected';

export interface JobApplication {
  id: string;
  userId: string;
  vacancyId: string;
  vacancy?: Vacancy;
  resumeId: string;
  status: ApplicationStatus;
  coverLetter?: string;
  notes?: string;
  appliedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationDto {
  vacancyId: string;
  resumeId: string;
  coverLetter?: string;
  notes?: string;
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  notes?: string;
}

export interface UserFavorite {
  id: string;
  userId: string;
  vacancyId: string;
  vacancy?: Vacancy;
  createdAt: string;
}
