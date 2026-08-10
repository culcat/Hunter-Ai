import { Controller, Get, Post, Body, Query, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VacanciesService } from './vacancies.service';
import { VacancyFilterDto } from './dto/vacancy-filter.dto';
import { CreateVacancyDto } from './dto/create-vacancy.dto';

@ApiTags('vacancies')
@Controller('vacancies')
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  @ApiOperation({ summary: 'Filter and search vacancies with rich multi-parameter filters' })
  findAll(@Query() filter: VacancyFilterDto) {
    return this.vacanciesService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single vacancy details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.vacanciesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create or update vacancy' })
  create(@Body() dto: CreateVacancyDto) {
    return this.vacanciesService.create(dto);
  }

  @Post('parse')
  @ApiOperation({ summary: 'Trigger AI / Scraper parser for target URL or career portal' })
  parse(
    @Body('target') target: string,
    @Body('source') source?: 'headhunter' | 'habr' | 'getmatch' | 'custom',
  ) {
    return this.vacanciesService.parseAndSaveVacancies(target || 'https://hh.ru', source);
  }
}
