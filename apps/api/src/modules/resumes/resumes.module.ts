import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResumeEntity } from './entities/resume.entity';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ResumeEntity])],
  providers: [ResumesService],
  controllers: [ResumesController],
  exports: [ResumesService],
})
export class ResumesModule {}
