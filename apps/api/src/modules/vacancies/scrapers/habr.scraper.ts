import { Injectable, Logger } from '@nestjs/common';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';

@Injectable()
export class HabrCareerScraper {
  private readonly logger = new Logger(HabrCareerScraper.name);

  async parseVacancies(textOrUrl: string): Promise<CreateVacancyDto[]> {
    this.logger.log(`Parsing Habr Career target: ${textOrUrl}`);

    const sampleVacancies: CreateVacancyDto[] = [
      {
        externalId: 'habr-1000045',
        source: 'habr',
        title: 'Middle / Senior React Developer',
        company: 'Cloud Innovations',
        description: 'Ищем Frontend-разработчика в команду продуктовой веб-платформы. Опыт работы с React, Redux, SCSS, TypeScript от 2 лет.',
        country: 'Россия',
        city: 'Санкт-Петербург',
        workFormat: 'remote',
        salaryMin: 180000,
        salaryMax: 260000,
        currency: 'RUB',
        skills: ['React', 'TypeScript', 'Redux', 'Vite', 'CSS3', 'HTML5'],
        grade: 'Middle',
        employmentType: 'full-time',
        englishLevel: 'B1',
        url: textOrUrl.startsWith('http') ? textOrUrl : 'https://career.habr.com/vacancies/1000045',
        publishedAt: new Date().toISOString(),
      }
    ];

    return sampleVacancies;
  }
}
