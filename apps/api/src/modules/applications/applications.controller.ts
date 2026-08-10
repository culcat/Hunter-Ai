import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get('applications')
  @ApiOperation({ summary: 'Get all job applications for user' })
  getApplications(@CurrentUser('id') userId: string) {
    return this.applicationsService.findApplicationsByUser(userId);
  }

  @Post('applications')
  @ApiOperation({ summary: 'Create new job application record' })
  createApplication(@CurrentUser('id') userId: string, @Body() dto: CreateApplicationDto) {
    return this.applicationsService.createApplication(userId, dto);
  }

  @Patch('applications/:id/status')
  @ApiOperation({ summary: 'Update job application status in Kanban pipeline' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateApplicationStatusDto,
  ) {
    return this.applicationsService.updateApplicationStatus(id, userId, dto);
  }

  @Delete('applications/:id')
  @ApiOperation({ summary: 'Delete application record' })
  deleteApplication(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.applicationsService.deleteApplication(id, userId);
  }

  @Get('favorites')
  @ApiOperation({ summary: 'Get user favorite vacancies' })
  getFavorites(@CurrentUser('id') userId: string) {
    return this.applicationsService.findFavoritesByUser(userId);
  }

  @Post('favorites/:vacancyId')
  @ApiOperation({ summary: 'Add vacancy to favorites' })
  addFavorite(@CurrentUser('id') userId: string, @Param('vacancyId', ParseUUIDPipe) vacancyId: string) {
    return this.applicationsService.addFavorite(userId, vacancyId);
  }

  @Delete('favorites/:vacancyId')
  @ApiOperation({ summary: 'Remove vacancy from favorites' })
  removeFavorite(@CurrentUser('id') userId: string, @Param('vacancyId', ParseUUIDPipe) vacancyId: string) {
    return this.applicationsService.removeFavorite(userId, vacancyId);
  }
}
