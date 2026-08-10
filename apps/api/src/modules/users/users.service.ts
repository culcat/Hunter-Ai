import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { UserSettingsEntity } from './entities/user-settings.entity';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserSettingsRequestDto, TestCookiesRequestDto } from './dto/user-settings.dto';
import { PlaywrightScraper } from '../vacancies/scrapers/playwright.scraper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserSettingsEntity)
    private readonly settingsRepository: Repository<UserSettingsEntity>,
    private readonly playwrightScraper: PlaywrightScraper,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string, includePassword = false): Promise<UserEntity | null> {
    const query = this.userRepository.createQueryBuilder('user').where('user.email = :email', { email });
    if (includePassword) {
      query.addSelect('user.passwordHash');
    }
    return query.getOne();
  }

  async create(data: { email: string; passwordHash: string; firstName?: string; lastName?: string }): Promise<UserEntity> {
    const existing = await this.findByEmail(data.email);
    if (existing) {
      throw new ConflictException(`User with email ${data.email} already exists`);
    }

    const user = this.userRepository.create(data);
    const savedUser = await this.userRepository.save(user);

    // Initialize default user settings
    const defaultSettings = this.settingsRepository.create({
      userId: savedUser.id,
      dailyAutoApplyLimit: 20,
      autoApplyMinMatchScore: 70,
      hhAutoApplyEnabled: false,
      habrAutoApplyEnabled: false,
    });
    await this.settingsRepository.save(defaultSettings);

    return savedUser;
  }

  async createUserFromDto(dto: CreateUserRequestDto): Promise<UserEntity> {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    return this.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
  }

  async getUserSettings(userId: string): Promise<UserSettingsEntity> {
    let settings = await this.settingsRepository.findOne({ where: { userId } });
    if (!settings) {
      settings = this.settingsRepository.create({
        userId,
        dailyAutoApplyLimit: 20,
        autoApplyMinMatchScore: 70,
        hhAutoApplyEnabled: false,
        habrAutoApplyEnabled: false,
      });
      settings = await this.settingsRepository.save(settings);
    }
    return settings;
  }

  async updateUserSettings(userId: string, dto: UpdateUserSettingsRequestDto): Promise<UserSettingsEntity> {
    const settings = await this.getUserSettings(userId);
    Object.assign(settings, dto);
    return this.settingsRepository.save(settings);
  }

  async testCookies(dto: TestCookiesRequestDto, userId?: string): Promise<{ isValid: boolean; platform: 'hh' | 'habr'; username?: string; message: string }> {
    let cookiesStr = dto.cookies;
    let userAgent = dto.userAgent;

    // If cookies were not explicitly passed in payload, attempt to load saved cookies from user settings
    if (!cookiesStr && userId) {
      const settings = await this.getUserSettings(userId);
      if (dto.platform === 'hh') {
        cookiesStr = settings.hhCookies;
        userAgent = settings.hhUserAgent;
      } else {
        cookiesStr = settings.habrCookies;
        userAgent = settings.habrUserAgent;
      }
    }

    const result = await this.playwrightScraper.verifySessionCookies(dto.platform, cookiesStr, userAgent);
    return {
      platform: dto.platform,
      isValid: result.isValid,
      username: result.username,
      message: result.message,
    };
  }
}
