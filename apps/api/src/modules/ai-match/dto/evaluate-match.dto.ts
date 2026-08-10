import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class EvaluateMatchDto {
  @ApiProperty({ example: 'uuid-resume-id', description: 'ID of user resume' })
  @IsUUID()
  @IsNotEmpty()
  resumeId!: string;

  @ApiProperty({ example: 'uuid-vacancy-id', description: 'ID of target vacancy' })
  @IsUUID()
  @IsNotEmpty()
  vacancyId!: string;
}
