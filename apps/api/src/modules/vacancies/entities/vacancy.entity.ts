import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';
import { GradeLevel, EnglishLevel, WorkFormat, EmploymentType } from '@hunter-ai/types';

@Entity('vacancies')
export class VacancyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ nullable: true })
  @Index('idx_vacancy_ext_id')
  externalId?: string;

  @Column({ default: 'custom' })
  source!: 'headhunter' | 'habr' | 'getmatch' | 'custom';

  @Column()
  @Index('idx_vacancy_title')
  title!: string;

  @Column()
  @Index('idx_vacancy_company')
  company!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column({ nullable: true })
  @Index('idx_vacancy_country')
  country?: string;

  @Column({ nullable: true })
  @Index('idx_vacancy_region')
  region?: string;

  @Column({ nullable: true })
  @Index('idx_vacancy_city')
  city?: string;

  @Column({ default: 'remote' })
  @Index('idx_vacancy_work_format')
  workFormat!: WorkFormat;

  @Column({ type: 'integer', nullable: true })
  @Index('idx_vacancy_salary_min')
  salaryMin?: number;

  @Column({ type: 'integer', nullable: true })
  @Index('idx_vacancy_salary_max')
  salaryMax?: number;

  @Column({ default: 'RUB' })
  currency?: string;

  @Column({ type: 'simple-array', default: '' })
  skills!: string[];

  @Column({ default: 'Middle' })
  @Index('idx_vacancy_grade')
  grade!: GradeLevel;

  @Column({ default: 'full-time' })
  @Index('idx_vacancy_employment_type')
  employmentType!: EmploymentType;

  @Column({ nullable: true })
  englishLevel?: EnglishLevel;

  @Column({ unique: true })
  url!: string;

  @Column({ type: 'datetime', nullable: true })
  publishedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
