import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { VacanciesModule } from './modules/vacancies/vacancies.module';
import { AiMatchModule } from './modules/ai-match/ai-match.module';
import { CoverLettersModule } from './modules/cover-letters/cover-letters.module';
import { ApplicationsModule } from './modules/applications/applications.module';
import { CompaniesModule } from './modules/companies/companies.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    ResumesModule,
    VacanciesModule,
    AiMatchModule,
    CoverLettersModule,
    ApplicationsModule,
    CompaniesModule,
  ],
})
export class AppModule {}

