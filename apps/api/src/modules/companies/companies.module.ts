import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyEntity } from './entities/company.entity';
import { VacancyEntity } from '../vacancies/entities/vacancy.entity';
import { CompaniesService } from './companies.service';
import { CompaniesController } from './companies.controller';
import { PlaywrightScraper } from '../vacancies/scrapers/playwright.scraper';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity, VacancyEntity])],
  controllers: [CompaniesController],
  providers: [CompaniesService, PlaywrightScraper],
  exports: [CompaniesService],
})
export class CompaniesModule {}
