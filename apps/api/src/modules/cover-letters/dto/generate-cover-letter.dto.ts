import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class GenerateCoverLetterDto {
  @ApiProperty({ example: 'uuid-resume-id', description: 'Resume ID' })
  @IsUUID()
  @IsNotEmpty()
  resumeId!: string;

  @ApiProperty({ example: 'uuid-vacancy-id', description: 'Vacancy ID' })
  @IsUUID()
  @IsNotEmpty()
  vacancyId!: string;

  @ApiPropertyOptional({ example: 'Please emphasize my experience with Chrome Extensions and micro-frontends.', description: 'Additional instructions' })
  @IsString()
  @IsOptional()
  customNotes?: string;
}
