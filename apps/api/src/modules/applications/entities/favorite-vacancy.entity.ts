import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { VacancyEntity } from '../../vacancies/entities/vacancy.entity';

@Entity('user_favorites')
@Unique(['userId', 'vacancyId'])
export class FavoriteVacancyEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index('idx_fav_user_id')
  userId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column()
  @Index('idx_fav_vacancy_id')
  vacancyId!: string;

  @ManyToOne(() => VacancyEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'vacancyId' })
  vacancy!: VacancyEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
