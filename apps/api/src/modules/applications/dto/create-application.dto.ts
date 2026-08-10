import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 'uuid-vacancy-id', description: 'Vacancy ID' })
  @IsUUID()
  @IsNotEmpty()
  vacancyId!: string;

  @ApiProperty({ example: 'uuid-resume-id', description: 'Resume ID used for application' })
  @IsUUID()
  @IsNotEmpty()
  resumeId!: string;

  @ApiPropertyOptional({ example: 'Tailored cover letter text...' })
  @IsString()
  @IsOptional()
  coverLetter?: string;

  @ApiPropertyOptional({ example: 'Submitted via company portal' })
  @IsString()
  @IsOptional()
  notes?: string;
}
