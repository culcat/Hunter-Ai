import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_settings')
export class UserSettingsEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column({ type: 'text', nullable: true })
  hhCookies?: string;

  @Column({ type: 'varchar', nullable: true })
  hhUserAgent?: string;

  @Column({ type: 'boolean', default: false })
  hhAutoApplyEnabled!: boolean;

  @Column({ type: 'varchar', nullable: true })
  hhResumeId?: string;

  @Column({ type: 'text', nullable: true })
  habrCookies?: string;

  @Column({ type: 'varchar', nullable: true })
  habrUserAgent?: string;

  @Column({ type: 'boolean', default: false })
  habrAutoApplyEnabled!: boolean;

  @Column({ type: 'varchar', nullable: true })
  habrResumeId?: string;

  @Column({ type: 'text', nullable: true })
  defaultCoverLetter?: string;

  @Column({ type: 'integer', default: 20 })
  dailyAutoApplyLimit!: number;

  @Column({ type: 'integer', default: 70 })
  autoApplyMinMatchScore!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
