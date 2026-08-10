import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { GradeLevel, EnglishLevel, WorkFormat, EmploymentType } from '@hunter-ai/types';

export class CreateVacancyDto {
  @ApiPropertyOptional({ example: '1234567' })
  @IsString()
  @IsOptional()
  externalId?: string;

  @ApiProperty({ example: 'headhunter', enum: ['headhunter', 'habr', 'getmatch', 'custom'] })
  @IsString()
  @IsNotEmpty()
  source!: 'headhunter' | 'habr' | 'getmatch' | 'custom';

  @ApiProperty({ example: 'Frontend React / Next.js Developer' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ example: 'ООО ФОРТЕХ' })
  @IsString()
  @IsNotEmpty()
  company!: string;

  @ApiProperty({ example: 'We are looking for a Senior Frontend Engineer...' })
  @IsString()
  @IsNotEmpty()
  description!: string;

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

  @ApiProperty({ example: 'remote', enum: ['remote', 'office', 'hybrid'] })
  @IsString()
  @IsNotEmpty()
  workFormat!: WorkFormat;

  @ApiPropertyOptional({ example: 180000 })
  @IsInt()
  @IsOptional()
  salaryMin?: number;

  @ApiPropertyOptional({ example: 250000 })
  @IsInt()
  @IsOptional()
  salaryMax?: number;

  @ApiPropertyOptional({ example: 'RUB', default: 'RUB' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ example: ['React', 'TypeScript', 'Redux', 'Next.js'] })
  @IsArray()
  skills!: string[];

  @ApiProperty({ example: 'Middle', enum: ['Intern', 'Junior', 'Middle', 'Senior', 'Lead'] })
  @IsString()
  @IsNotEmpty()
  grade!: GradeLevel;

  @ApiProperty({ example: 'full-time', enum: ['full-time', 'part-time', 'contract', 'project'] })
  @IsString()
  @IsNotEmpty()
  employmentType!: EmploymentType;

  @ApiPropertyOptional({ example: 'C1', enum: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'] })
  @IsString()
  @IsOptional()
  englishLevel?: EnglishLevel;

  @ApiProperty({ example: 'https://hh.ru/vacancy/1234567' })
  @IsUrl()
  @IsNotEmpty()
  url!: string;

  @ApiPropertyOptional({ example: '2026-08-03T13:00:00Z' })
  @IsString()
  @IsOptional()
  publishedAt?: string;
}
