import { Injectable, Logger } from '@nestjs/common';
import { CreateVacancyDto } from '../dto/create-vacancy.dto';

@Injectable()
export class HeadHunterScraper {
  private readonly logger = new Logger(HeadHunterScraper.name);

  async parseVacancies(textOrUrl: string): Promise<CreateVacancyDto[]> {
    this.logger.log(`Parsing HH.ru target: ${textOrUrl}`);

    // Simulated parsing result / API integration endpoint structure
    const sampleVacancies: CreateVacancyDto[] = [
      {
        externalId: 'hh-9823120',
        source: 'headhunter',
        title: 'Senior Frontend Developer (React / TypeScript)',
        company: 'ООО ФОРТЕХ',
        description: 'Разработка SPA-приложений и Chrome Extensions на React, Next.js, Redux Toolkit, SCSS Modules.',
        country: 'Россия',
        region: 'Ростовская область',
        city: 'Ростов-на-Дону',
        workFormat: 'remote',
        salaryMin: 200000,
        salaryMax: 280000,
        currency: 'RUB',
        skills: ['React', 'TypeScript', 'Next.js', 'Redux Toolkit', 'SCSS', 'Ant Design', 'Git'],
        grade: 'Senior',
        employmentType: 'full-time',
        englishLevel: 'C1',
        url: textOrUrl.startsWith('http') ? textOrUrl : 'https://hh.ru/vacancy/9823120',
        publishedAt: new Date().toISOString(),
      },
      {
        externalId: 'hh-8712391',
        source: 'headhunter',
        title: 'Fullstack Engineer (NestJS / React)',
        company: 'Apex Tech Inc.',
        description: 'Создание высокое нагруженных микросервисных платформ на NestJS, TypeORM, SQLite/Postgres и Next.js.',
        country: 'Россия',
        region: 'Москва',
        city: 'Москва',
        workFormat: 'hybrid',
        salaryMin: 220000,
        salaryMax: 320000,
        currency: 'RUB',
        skills: ['NestJS', 'TypeORM', 'SQLite', 'React', 'TypeScript', 'Docker', 'Swagger'],
        grade: 'Middle',
        employmentType: 'full-time',
        englishLevel: 'B2',
        url: 'https://hh.ru/vacancy/8712391',
        publishedAt: new Date().toISOString(),
      }
    ];

    return sampleVacancies;
  }
}
