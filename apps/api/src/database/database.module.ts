import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../modules/users/entities/user.entity';
import { ResumeEntity } from '../modules/resumes/entities/resume.entity';
import { VacancyEntity } from '../modules/vacancies/entities/vacancy.entity';
import { JobApplicationEntity } from '../modules/applications/entities/job-application.entity';
import { FavoriteVacancyEntity } from '../modules/applications/entities/favorite-vacancy.entity';
import { CompanyEntity } from '../modules/companies/entities/company.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_FILE || 'database.sqlite',
      entities: [
        UserEntity,
        ResumeEntity,
        VacancyEntity,
        JobApplicationEntity,
        FavoriteVacancyEntity,
        CompanyEntity,
      ],
      synchronize: true,
    }),
  ],
})
export class DatabaseModule {}

