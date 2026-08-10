import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CoverLettersService } from './cover-letters.service';
import { GenerateCoverLetterDto } from './dto/generate-cover-letter.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('cover-letters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cover-letters')
export class CoverLettersController {
  constructor(private readonly coverLettersService: CoverLettersService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate multiple tailored cover letter variants for a job application' })
  generate(@CurrentUser('id') userId: string, @Body() dto: GenerateCoverLetterDto) {
    return this.coverLettersService.generate(userId, dto.resumeId, dto.vacancyId, dto.customNotes);
  }
}
