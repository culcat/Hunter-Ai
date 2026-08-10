import { Injectable, NotFoundException, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyEntity } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { VacancyEntity } from '../vacancies/entities/vacancy.entity';
import { PlaywrightScraper } from '../vacancies/scrapers/playwright.scraper';

const DEFAULT_RUSSIAN_IT_COMPANIES: CreateCompanyDto[] = [
  {
    name: 'Яндекс',
    code: 'yandex',
    websiteUrl: 'https://yandex.ru',
    careerUrl: 'https://yandex.ru/jobs/vacancies',
    logoUrl: 'https://yastatic.net/s3/home/2021/yandex_logo.png',
    description: 'Ведущая российская IT-компания, разработчик поисковой системы, нейросетей YandexGPT, экосистемы сервисов и облачной инфраструктуры.',
    requiresAuth: false,
  },
  {
    name: 'VK',
    code: 'vk',
    websiteUrl: 'https://vk.company',
    careerUrl: 'https://team.vk.company/vacancies/',
    logoUrl: 'https://vk.company/static/theme/img/vk_logo.svg',
    description: 'Крупнейшая технологическая компания России, создатель экосистемы ВКонтакте, VK Cloud, VK Play, Дзен, Mail.ru.',
    requiresAuth: false,
  },
  {
    name: 'Сбер',
    code: 'sber',
    websiteUrl: 'https://sber.ru',
    careerUrl: 'https://rabota.sber.ru/search',
    logoUrl: 'https://sber.ru/favicon.ico',
    description: 'Технологический гигант и финтех-лидер России, разработчик GigaChat, СберТех и цифровых банковских платформ.',
    requiresAuth: false,
  },
  {
    name: 'Т-Банк',
    code: 'tbank',
    websiteUrl: 'https://www.tbank.ru',
    careerUrl: 'https://www.tbank.ru/career/it/',
    logoUrl: 'https://www.tbank.ru/favicon.ico',
    description: 'Онлайн-экосистема и финтех-платформа с сильнейшей IT-инженерией в области Highload, ML и мобильной разработки.',
    requiresAuth: false,
  },
  {
    name: 'Авито',
    code: 'avito',
    websiteUrl: 'https://www.avito.ru',
    careerUrl: 'https://career.avito.ru/vacancies',
    logoUrl: 'https://career.avito.ru/favicon.ico',
    description: 'Самый посещаемый сервис объявлений в мире с передовой микросервисной архитектурой и технологиями машинного обучения.',
    requiresAuth: false,
  },
  {
    name: 'Ozon Tech',
    code: 'ozon',
    websiteUrl: 'https://ozon.ru',
    careerUrl: 'https://job.ozon.ru/vacancy/',
    logoUrl: 'https://job.ozon.ru/favicon.ico',
    description: 'IT-подразделение e-commerce гиганта Ozon. Разработка масштабных логистических и финансово-технических платформ.',
    requiresAuth: false,
  },
  {
    name: 'Альфа-Банк',
    code: 'alfabank',
    websiteUrl: 'https://alfabank.ru',
    careerUrl: 'https://job.alfabank.ru/vacancies',
    logoUrl: 'https://job.alfabank.ru/favicon.ico',
    description: 'Крупнейший частный банк России с фокусом на цифровизацию, AI-помощников и мобильный банкинг.',
    requiresAuth: false,
  },
  {
    name: 'Лаборатория Касперского',
    code: 'kaspersky',
    websiteUrl: 'https://kaspersky.ru',
    careerUrl: 'https://careers.kaspersky.ru/vacancies/',
    logoUrl: 'https://careers.kaspersky.ru/favicon.ico',
    description: 'Международный лидер в области кибербезопасности и защиты данных, разработчик решений Kaspersky OS и антивирусных комплексов.',
    requiresAuth: false,
  },
  {
    name: 'Selectel',
    code: 'selectel',
    websiteUrl: 'https://selectel.ru',
    careerUrl: 'https://selectel.ru/careers/',
    logoUrl: 'https://selectel.ru/favicon.ico',
    description: 'Ведущий российский провайдер облачных инфраструктурных сервисов и дата-центров.',
    requiresAuth: false,
  },
  {
    name: 'Positive Technologies',
    code: 'ptsecurity',
    websiteUrl: 'https://ptsecurity.com',
    careerUrl: 'https://ptsecurity.com/ru-ru/career/',
    logoUrl: 'https://ptsecurity.com/favicon.ico',
    description: 'Ведущий разработчик решений в сфере результативной кибербезопасности и защиты от сетевых атак.',
    requiresAuth: false,
  },
  {
    name: 'Хабр Карьера',
    code: 'habr',
    websiteUrl: 'https://career.habr.com',
    careerUrl: 'https://career.habr.com/vacancies',
    logoUrl: 'https://career.habr.com/favicon.ico',
    description: 'Специализированный карьерный портал для разработчиков, DevOps, QA и IT-менеджеров.',
    requiresAuth: false,
  },
  {
    name: 'HeadHunter',
    code: 'hh',
    websiteUrl: 'https://hh.ru',
    careerUrl: 'https://hh.ru/search/vacancy?text=developer',
    logoUrl: 'https://hh.ru/favicon.ico',
    description: 'Крупнейшая платформа по поиску работы и найму IT-специалистов в России.',
    requiresAuth: false,
  },
];

@Injectable()
export class CompaniesService implements OnModuleInit {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
    private readonly playwrightScraper: PlaywrightScraper,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDefaultCompanies();
  }

  private async seedDefaultCompanies(): Promise<void> {
    const count = await this.companyRepository.count();
    if (count === 0) {
      this.logger.log('Seeding Russian IT Companies database table...');
      for (const comp of DEFAULT_RUSSIAN_IT_COMPANIES) {
        const entity = this.companyRepository.create({
          name: comp.name,
          code: comp.code,
          websiteUrl: comp.websiteUrl,
          careerUrl: comp.careerUrl,
          logoUrl: comp.logoUrl,
          description: comp.description,
          requiresAuth: comp.requiresAuth || false,
          authConfig: comp.authConfig ? JSON.stringify(comp.authConfig) : undefined,
          scrapingConfig: comp.scrapingConfig ? JSON.stringify(comp.scrapingConfig) : undefined,
          isActive: comp.isActive !== undefined ? comp.isActive : true,
        });
        await this.companyRepository.save(entity);
      }
      this.logger.log(`Successfully seeded ${DEFAULT_RUSSIAN_IT_COMPANIES.length} Russian IT companies.`);
    }
  }

  async findAll(): Promise<CompanyEntity[]> {
    return this.companyRepository.find({ order: { name: 'ASC' } });
  }

  async findOne(idOrCode: string): Promise<CompanyEntity> {
    const company = await this.companyRepository.findOne({
      where: [{ id: idOrCode }, { code: idOrCode }],
    });
    if (!company) {
      throw new NotFoundException(`Company with identifier '${idOrCode}' not found`);
    }
    return company;
  }

  async create(dto: CreateCompanyDto): Promise<CompanyEntity> {
    const entity = this.companyRepository.create({
      ...dto,
      authConfig: dto.authConfig ? JSON.stringify(dto.authConfig) : undefined,
      scrapingConfig: dto.scrapingConfig ? JSON.stringify(dto.scrapingConfig) : undefined,
    });
    return this.companyRepository.save(entity);
  }

  async update(id: string, dto: UpdateCompanyDto): Promise<CompanyEntity> {
    const company = await this.findOne(id);
    if (dto.authConfig !== undefined) {
      company.authConfig = JSON.stringify(dto.authConfig);
      delete dto.authConfig;
    }
    if (dto.scrapingConfig !== undefined) {
      company.scrapingConfig = JSON.stringify(dto.scrapingConfig);
      delete dto.scrapingConfig;
    }
    Object.assign(company, dto);
    return this.companyRepository.save(company);
  }

  async scrapeCompany(id: string): Promise<{ company: CompanyEntity; scrapedVacanciesCount: number }> {
    const company = await this.findOne(id);
    this.logger.log(`Initiating Playwright scrape for company: ${company.name} (${company.careerUrl})`);

    const authConfig = company.authConfig ? JSON.parse(company.authConfig) : undefined;
    const scrapingConfig = company.scrapingConfig ? JSON.parse(company.scrapingConfig) : undefined;

    const scrapedDtos = await this.playwrightScraper.scrapeTarget({
      url: company.careerUrl,
      companyName: company.name,
      requiresAuth: company.requiresAuth,
      authConfig,
      scrapingConfig,
    });

    let savedCount = 0;
    for (const dto of scrapedDtos) {
      const existing = await this.vacancyRepository.findOne({ where: { url: dto.url } });
      if (existing) {
        Object.assign(existing, dto);
        await this.vacancyRepository.save(existing);
      } else {
        const newVacancy = this.vacancyRepository.create({
          ...dto,
          company: company.name,
          publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
        });
        await this.vacancyRepository.save(newVacancy);
      }
      savedCount++;
    }

    company.lastScrapedAt = new Date();
    company.vacanciesCount = await this.vacancyRepository.count({ where: { company: company.name } });
    await this.companyRepository.save(company);

    return {
      company,
      scrapedVacanciesCount: savedCount,
    };
  }

  async scrapeAllCompanies(): Promise<{ totalScraped: number; details: Record<string, number> }> {
    const companies = await this.companyRepository.find({ where: { isActive: true } });
    this.logger.log(`Starting Playwright bulk scrape for ${companies.length} Russian IT companies...`);

    let totalScraped = 0;
    const details: Record<string, number> = {};

    for (const comp of companies) {
      try {
        const result = await this.scrapeCompany(comp.id);
        totalScraped += result.scrapedVacanciesCount;
        details[comp.name] = result.scrapedVacanciesCount;
      } catch (err: any) {
        this.logger.error(`Error scraping company ${comp.name}: ${err?.message || err}`);
        details[comp.name] = 0;
      }
    }

    return { totalScraped, details };
  }
}
