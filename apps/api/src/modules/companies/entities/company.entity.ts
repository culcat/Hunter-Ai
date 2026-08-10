import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('companies')
export class CompanyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  @Index('idx_company_name')
  name!: string;

  @Column({ unique: true })
  @Index('idx_company_code')
  code!: string;

  @Column()
  websiteUrl!: string;

  @Column()
  careerUrl!: string;

  @Column({ nullable: true })
  logoUrl?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  requiresAuth!: boolean;

  @Column({ type: 'text', nullable: true })
  authConfig?: string;

  @Column({ type: 'text', nullable: true })
  scrapingConfig?: string;

  @Column({ default: true })
  @Index('idx_company_active')
  isActive!: boolean;

  @Column({ type: 'datetime', nullable: true })
  lastScrapedAt?: Date;

  @Column({ type: 'integer', default: 0 })
  vacanciesCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
