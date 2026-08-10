import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ParsedResumeData } from '@hunter-ai/types';

export class CreateResumeDto {
  @ApiProperty({ example: 'Frontend Developer Resume', description: 'Resume Title' })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({ description: 'Structured JSON data of parsed resume' })
  @IsObject()
  parsedData!: ParsedResumeData;

  @ApiPropertyOptional({ default: false, description: 'Is primary resume for matches' })
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;
}
