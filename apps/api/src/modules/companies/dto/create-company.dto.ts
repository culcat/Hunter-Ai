import { IsString, IsNotEmpty, IsUrl, IsOptional, IsBoolean, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuthConfig, ScrapingConfig } from '@hunter-ai/types';

export class CreateCompanyDto {
  @ApiProperty({ example: 'Яндекс', description: 'Name of the IT company' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'yandex', description: 'Unique slug identifier for company' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: 'https://yandex.ru', description: 'Main corporate website URL' })
  @IsUrl()
  @IsNotEmpty()
  websiteUrl!: string;

  @ApiProperty({ example: 'https://yandex.ru/jobs/vacancies', description: 'Official career site URL' })
  @IsUrl()
  @IsNotEmpty()
  careerUrl!: string;

  @ApiPropertyOptional({ example: 'https://yandex.ru/logo.png', description: 'Company logo image URL' })
  @IsUrl()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'Ведущая российская IT-компания', description: 'Short company overview' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Whether authorization is required to access vacancies' })
  @IsBoolean()
  @IsOptional()
  requiresAuth?: boolean;

  @ApiPropertyOptional({ description: 'Authentication credentials and CSS selectors config' })
  @IsObject()
  @IsOptional()
  authConfig?: AuthConfig;

  @ApiPropertyOptional({ description: 'Scraping target selectors and settings' })
  @IsObject()
  @IsOptional()
  scrapingConfig?: ScrapingConfig;

  @ApiPropertyOptional({ example: true, default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
