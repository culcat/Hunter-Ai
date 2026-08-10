import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacancyEntity } from './entities/vacancy.entity';
import { VacanciesService } from './vacancies.service';
import { VacanciesController } from './vacancies.controller';
import { HeadHunterScraper } from './scrapers/hh.scraper';
import { HabrCareerScraper } from './scrapers/habr.scraper';
import { GetMatchScraper } from './scrapers/getmatch.scraper';
import { PlaywrightScraper } from './scrapers/playwright.scraper';

@Module({
  imports: [TypeOrmModule.forFeature([VacancyEntity])],
  providers: [
    VacanciesService,
    HeadHunterScraper,
    HabrCareerScraper,
    GetMatchScraper,
    PlaywrightScraper,
  ],
  controllers: [VacanciesController],
  exports: [VacanciesService, PlaywrightScraper],
})
export class VacanciesModule {}

