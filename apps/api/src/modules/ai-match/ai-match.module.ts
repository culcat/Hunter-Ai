import { Module } from '@nestjs/common';
import { ResumesModule } from '../resumes/resumes.module';
import { VacanciesModule } from '../vacancies/vacancies.module';
import { AiMatchService } from './ai-match.service';
import { AiMatchController } from './ai-match.controller';

@Module({
  imports: [ResumesModule, VacanciesModule],
  providers: [AiMatchService],
  controllers: [AiMatchController],
  exports: [AiMatchService],
})
export class AiMatchModule {}
