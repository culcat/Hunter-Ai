import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { VacancyEntity } from '../../vacancies/entities/vacancy.entity';
import { ResumeEntity } from '../../resumes/entities/resume.entity';
import { ApplicationStatus } from '@hunter-ai/types';

@Entity('job_applications')
export class JobApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index('idx_app_user_id')
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column()
  @Index('idx_app_vacancy_id')
  vacancyId!: string;

  @ManyToOne(() => VacancyEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'vacancyId' })
  vacancy!: VacancyEntity;

  @Column()
  resumeId!: string;

  @ManyToOne(() => ResumeEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resumeId' })
  resume?: ResumeEntity;

  @Column({ default: 'applied' })
  @Index('idx_app_status')
  status!: ApplicationStatus;

  @Column({ type: 'text', nullable: true })
  coverLetter?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  appliedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
