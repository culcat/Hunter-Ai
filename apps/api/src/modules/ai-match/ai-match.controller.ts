import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AiMatchService } from './ai-match.service';
import { EvaluateMatchDto } from './dto/evaluate-match.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('ai-match')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai-match')
export class AiMatchController {
  constructor(private readonly aiMatchService: AiMatchService) {}

  @Post('evaluate')
  @ApiOperation({ summary: 'Calculate AI Match score, strengths, weaknesses, and missing skills' })
  evaluate(@CurrentUser('id') userId: string, @Body() dto: EvaluateMatchDto) {
    return this.aiMatchService.evaluateMatch(userId, dto.resumeId, dto.vacancyId);
  }
}
