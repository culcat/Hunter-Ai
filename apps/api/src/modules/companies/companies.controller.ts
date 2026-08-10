import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all Russian IT companies and career site configurations' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details for a specific IT company by ID or code' })
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new company career site entry' })
  create(@Body() dto: CreateCompanyDto) {
    return this.companiesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update company configuration, credentials, or scraping selectors' })
  update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
    return this.companiesService.update(id, dto);
  }

  @Post('scrape-all')
  @ApiOperation({ summary: 'Trigger Playwright scraping across all active Russian IT companies' })
  scrapeAll() {
    return this.companiesService.scrapeAllCompanies();
  }

  @Post(':id/scrape')
  @ApiOperation({ summary: 'Trigger Playwright scraping for a single target company career site' })
  scrapeCompany(@Param('id') id: string) {
    return this.companiesService.scrapeCompany(id);
  }
}
