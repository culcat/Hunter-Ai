import { Module } from '@nestjs/common';
import { ResumesModule } from '../resumes/resumes.module';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { CoverLettersService } from './cover-letters.service';
import { CoverLettersController } from './cover-letters.controller';

@Module({
  imports: [ResumesModule, VacanciesModule],
  providers: [CoverLettersService],
  controllers: [CoverLettersController],
  exports: [CoverLettersService],
})
export class CoverLettersModule {}
