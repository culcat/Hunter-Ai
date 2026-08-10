import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('resumes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all resumes for authenticated user' })
  findAll(@CurrentUser('id') userId: string) {
    return this.resumesService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single resume by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.resumesService.findOneByUser(id, userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create resume manually' })
  create(@CurrentUser('id') userId: string, @Body() dto: CreateResumeDto) {
    return this.resumesService.create(userId, dto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload and parse PDF resume into structured JSON' })
  async upload(
    @CurrentUser('id') userId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('PDF file is required');
    }
    if (file.mimetype !== 'application/pdf' && !file.originalname.endsWith('.pdf')) {
      throw new BadRequestException('Only PDF files are supported');
    }
    return this.resumesService.parseAndSavePdf(userId, file.buffer, file.originalname);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update/edit resume structured JSON' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumesService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete resume' })
  delete(@Param('id', ParseUUIDPipe) id: string, @CurrentUser('id') userId: string) {
    return this.resumesService.delete(id, userId);
  }
}
