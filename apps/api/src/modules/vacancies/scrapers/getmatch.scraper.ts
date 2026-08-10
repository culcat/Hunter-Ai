import { Injectable, Logger } from '@nestjs/common';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';

@Injectable()
export class GetMatchScraper {
  private readonly logger = new Logger(GetMatchScraper.name);

  async parseVacancies(textOrUrl: string): Promise<CreateVacancyDto[]> {
    this.logger.log(`Parsing GetMatch target: ${textOrUrl}`);

    const sampleVacancies: CreateVacancyDto[] = [
      {
        externalId: 'gm-44812',
        source: 'getmatch',
        title: 'Backend Engineer (NestJS / Node.js)',
        company: 'Fintech Core Labs',
        description: 'Разработка банковских API сервисов, интеграция с TypeORM/SQLite/Postgres, проектирование архитектуры.',
        country: 'Россия',
        city: 'Москва',
        workFormat: 'hybrid',
        salaryMin: 250000,
        salaryMax: 350000,
        currency: 'RUB',
        skills: ['NestJS', 'Node.js', 'TypeScript', 'TypeORM', 'SQLite', 'Docker', 'Jest'],
        grade: 'Senior',
        employmentType: 'full-time',
        englishLevel: 'B2',
        url: textOrUrl.startsWith('http') ? textOrUrl : 'https://getmatch.ru/vacancies/44812',
        publishedAt: new Date().toISOString(),
      }
    ];

    return sampleVacancies;
  }
}
