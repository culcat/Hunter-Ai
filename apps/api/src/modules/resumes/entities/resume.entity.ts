import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { ParsedResumeData } from '@hunter-ai/types';

@Entity('resumes')
export class ResumeEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index('idx_resume_user_id')
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column({ default: 'My Resume' })
  title!: string;

  @Column({ type: 'text', default: '' })
  rawText!: string;

  @Column({ type: 'simple-json' })
  parsedData!: ParsedResumeData;

  @Column({ default: false })
  isPrimary!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
