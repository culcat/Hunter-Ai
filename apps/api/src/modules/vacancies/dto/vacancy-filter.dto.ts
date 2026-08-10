import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { GradeLevel, EnglishLevel, WorkFormat, EmploymentType } from '@hunter-ai/types';

export class VacancyFilterDto {
  @ApiPropertyOptional({ example: 'Россия' })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiPropertyOptional({ example: 'Ростовская область' })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiPropertyOptional({ example: 'Ростов-на-Дону' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ enum: ['remote', 'office', 'hybrid'] })
  @IsString()
  @IsOptional()
  workFormat?: WorkFormat;

  @ApiPropertyOptional({ example: 100000, description: 'Min salary threshold' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  salaryFrom?: number;

  @ApiPropertyOptional({ example: 300000, description: 'Max salary threshold' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  salaryTo?: number;

  @ApiPropertyOptional({ example: ['React', 'TypeScript'], description: 'Comma separated or array of tech stack' })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(s => s.trim()).filter(Boolean);
    }
    return value;
  })
  @IsOptional()
  techStack?: string[];

  @ApiPropertyOptional({ enum: ['Intern', 'Junior', 'Middle', 'Senior', 'Lead'] })
  @IsString()
  @IsOptional()
  grade?: GradeLevel;

  @ApiPropertyOptional({ example: 'ФОРТЕХ' })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiPropertyOptional({ enum: ['full-time', 'part-time', 'contract', 'project'] })
  @IsString()
  @IsOptional()
  employmentType?: EmploymentType;

  @ApiPropertyOptional({ enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'] })
  @IsString()
  @IsOptional()
  englishLevel?: EnglishLevel;

  @ApiPropertyOptional({ example: '2026-08-01', description: 'ISO date filter' })
  @IsString()
  @IsOptional()
  publishedAfter?: string;

  @ApiPropertyOptional({ example: true, description: 'Return only vacancies with salary specified' })
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  onlyWithSalary?: boolean;

  @ApiPropertyOptional({ example: 'Frontend React Developer' })
  @IsString()
  @IsOptional()
  searchQuery?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, default: 20 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;
}
