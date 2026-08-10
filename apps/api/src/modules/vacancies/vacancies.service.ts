import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacancyEntity } from './entities/vacancy.entity';
import { VacancyFilterDto } from './dto/vacancy-filter.dto';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { HeadHunterScraper } from './scrapers/hh.scraper';
import { HabrCareerScraper } from './scrapers/habr.scraper';
import { GetMatchScraper } from './scrapers/getmatch.scraper';
import { PlaywrightScraper } from './scrapers/playwright.scraper';

@Injectable()
export class VacanciesService {
  private readonly logger = new Logger(VacanciesService.name);

  constructor(
    @InjectRepository(VacancyEntity)
    private readonly vacancyRepository: Repository<VacancyEntity>,
    private readonly hhScraper: HeadHunterScraper,
    private readonly habrScraper: HabrCareerScraper,
    private readonly getMatchScraper: GetMatchScraper,
    private readonly playwrightScraper: PlaywrightScraper,
  ) {}

  async findAll(filter: VacancyFilterDto): Promise<{ items: VacancyEntity[]; total: number; page: number; limit: number }> {
    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const query = this.vacancyRepository.createQueryBuilder('vacancy');

    if (filter.country) {
      query.andWhere('vacancy.country LIKE :country', { country: `%${filter.country}%` });
    }

    if (filter.region) {
      query.andWhere('vacancy.region LIKE :region', { region: `%${filter.region}%` });
    }

    if (filter.city) {
      query.andWhere('vacancy.city LIKE :city', { city: `%${filter.city}%` });
    }

    if (filter.workFormat) {
      query.andWhere('vacancy.workFormat = :workFormat', { workFormat: filter.workFormat });
    }

    if (filter.salaryFrom !== undefined) {
      query.andWhere('(vacancy.salaryMax >= :salaryFrom OR vacancy.salaryMin >= :salaryFrom)', { salaryFrom: filter.salaryFrom });
    }

    if (filter.salaryTo !== undefined) {
      query.andWhere('(vacancy.salaryMin <= :salaryTo OR vacancy.salaryMax <= :salaryTo)', { salaryTo: filter.salaryTo });
    }

    if (filter.onlyWithSalary) {
      query.andWhere('(vacancy.salaryMin IS NOT NULL OR vacancy.salaryMax IS NOT NULL)');
    }

    if (filter.grade) {
      query.andWhere('vacancy.grade = :grade', { grade: filter.grade });
    }

    if (filter.company) {
      query.andWhere('vacancy.company LIKE :company', { company: `%${filter.company}%` });
    }

    if (filter.employmentType) {
      query.andWhere('vacancy.employmentType = :employmentType', { employmentType: filter.employmentType });
    }

    if (filter.englishLevel) {
      query.andWhere('vacancy.englishLevel = :englishLevel', { englishLevel: filter.englishLevel });
    }

    if (filter.publishedAfter) {
      query.andWhere('vacancy.publishedAt >= :publishedAfter', { publishedAfter: new Date(filter.publishedAfter) });
    }

    if (filter.searchQuery) {
      query.andWhere(
        '(vacancy.title LIKE :q OR vacancy.description LIKE :q OR vacancy.company LIKE :q)',
        { q: `%${filter.searchQuery}%` },
      );
    }

    if (filter.techStack && filter.techStack.length > 0) {
      filter.techStack.forEach((tech, idx) => {
        query.andWhere(`vacancy.skills LIKE :tech_${idx}`, { [`tech_${idx}`]: `%${tech}%` });
      });
    }

    query.orderBy('vacancy.publishedAt', 'DESC').addOrderBy('vacancy.createdAt', 'DESC');

    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<VacancyEntity> {
    const vacancy = await this.vacancyRepository.findOne({ where: { id } });
    if (!vacancy) {
      throw new NotFoundException(`Vacancy with ID ${id} not found`);
    }
    return vacancy;
  }

  async create(dto: CreateVacancyDto): Promise<VacancyEntity> {
    const existing = await this.vacancyRepository.findOne({ where: { url: dto.url } });
    if (existing) {
      Object.assign(existing, dto);
      return this.vacancyRepository.save(existing);
    }

    const vacancy = this.vacancyRepository.create({
      ...dto,
      publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : new Date(),
    });

    return this.vacancyRepository.save(vacancy);
  }

  async parseAndSaveVacancies(target: string, source?: 'headhunter' | 'habr' | 'getmatch' | 'custom'): Promise<VacancyEntity[]> {
    this.logger.log(`Parsing request for target: ${target}, source: ${source}`);

    let parsedDtos: CreateVacancyDto[] = [];

    if (source === 'headhunter' || target.includes('hh.ru')) {
      parsedDtos = await this.hhScraper.parseVacancies(target);
    } else if (source === 'habr' || target.includes('habr.com')) {
      parsedDtos = await this.habrScraper.parseVacancies(target);
    } else if (source === 'getmatch' || target.includes('getmatch.ru')) {
      parsedDtos = await this.getMatchScraper.parseVacancies(target);
    } else {
      parsedDtos = await this.playwrightScraper.scrapeCorporatePage(target);
    }

    const savedVacancies: VacancyEntity[] = [];
    for (const dto of parsedDtos) {
      const saved = await this.create(dto);
      savedVacancies.push(saved);
    }

    return savedVacancies;
  }
}
