import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '@hunter-ai/types';

export class UpdateApplicationStatusDto {
  @ApiProperty({ example: 'interview', enum: ['applied', 'screening', 'interview', 'offer', 'rejected'] })
  @IsEnum(['applied', 'screening', 'interview', 'offer', 'rejected'])
  @IsNotEmpty()
  status!: ApplicationStatus;

  @ApiPropertyOptional({ example: 'Tech interview scheduled for Tuesday 15:00' })
  @IsString()
  @IsOptional()
  notes?: string;
}
