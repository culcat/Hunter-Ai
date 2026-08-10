import { IsString, IsOptional, IsBoolean, IsNumber, Min, Max, IsIn } from 'class-validator';
import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class UpdateUserSettingsRequestDto {
  @ApiPropertyOptional({ description: 'Raw cookie string or JSON array string for HeadHunter (hh.ru)' })
  @IsOptional()
  @IsString()
  hhCookies?: string;

  @ApiPropertyOptional({ description: 'Custom User-Agent header for HeadHunter' })
  @IsOptional()
  @IsString()
  hhUserAgent?: string;

  @ApiPropertyOptional({ description: 'Enable auto-apply for HeadHunter' })
  @IsOptional()
  @IsBoolean()
  hhAutoApplyEnabled?: boolean;

  @ApiPropertyOptional({ description: 'User resume ID or URL on HeadHunter' })
  @IsOptional()
  @IsString()
  hhResumeId?: string;

  @ApiPropertyOptional({ description: 'Raw cookie string or JSON array string for Habr Career (career.habr.com)' })
  @IsOptional()
  @IsString()
  habrCookies?: string;

  @ApiPropertyOptional({ description: 'Custom User-Agent header for Habr Career' })
  @IsOptional()
  @IsString()
  habrUserAgent?: string;

  @ApiPropertyOptional({ description: 'Enable auto-apply for Habr Career' })
  @IsOptional()
  @IsBoolean()
  habrAutoApplyEnabled?: boolean;

  @ApiPropertyOptional({ description: 'User resume ID or URL on Habr Career' })
  @IsOptional()
  @IsString()
  habrResumeId?: string;

  @ApiPropertyOptional({ description: 'Default cover letter template' })
  @IsOptional()
  @IsString()
  defaultCoverLetter?: string;

  @ApiPropertyOptional({ description: 'Daily limit of automated responses', default: 20 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  dailyAutoApplyLimit?: number;

  @ApiPropertyOptional({ description: 'Minimum AI match score required to auto-apply (0-100)', default: 70 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  autoApplyMinMatchScore?: number;
}

export class TestCookiesRequestDto {
  @ApiProperty({ description: 'Target platform to test', enum: ['hh', 'habr'] })
  @IsIn(['hh', 'habr'])
  platform!: 'hh' | 'habr';

  @ApiPropertyOptional({ description: 'Optional cookies string to test before saving' })
  @IsOptional()
  @IsString()
  cookies?: string;

  @ApiPropertyOptional({ description: 'Optional custom User-Agent to test' })
  @IsOptional()
  @IsString()
  userAgent?: string;
}
