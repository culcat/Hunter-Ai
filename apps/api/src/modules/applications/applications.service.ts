import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobApplicationEntity } from './entities/job-application.entity';
import { FavoriteVacancyEntity } from './entities/favorite-vacancy.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationStatusDto } from './dto/update-application-status.dto';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(JobApplicationEntity)
    private readonly applicationRepository: Repository<JobApplicationEntity>,
    @InjectRepository(FavoriteVacancyEntity)
    private readonly favoriteRepository: Repository<FavoriteVacancyEntity>,
  ) {}

  // Applications
  async findApplicationsByUser(userId: string): Promise<JobApplicationEntity[]> {
    return this.applicationRepository.find({
      where: { userId },
      order: { appliedAt: 'DESC' },
    });
  }

  async createApplication(userId: string, dto: CreateApplicationDto): Promise<JobApplicationEntity> {
    const existing = await this.applicationRepository.findOne({
      where: { userId, vacancyId: dto.vacancyId },
    });

    if (existing) {
      throw new ConflictException('You have already applied to this vacancy');
    }

    const application = this.applicationRepository.create({
      userId,
      vacancyId: dto.vacancyId,
      resumeId: dto.resumeId,
      status: 'applied',
      coverLetter: dto.coverLetter,
      notes: dto.notes,
    });

    return this.applicationRepository.save(application);
  }

  async updateApplicationStatus(id: string, userId: string, dto: UpdateApplicationStatusDto): Promise<JobApplicationEntity> {
    const application = await this.applicationRepository.findOne({ where: { id, userId } });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    application.status = dto.status;
    if (dto.notes !== undefined) {
      application.notes = dto.notes;
    }

    return this.applicationRepository.save(application);
  }

  async deleteApplication(id: string, userId: string): Promise<{ success: boolean }> {
    const application = await this.applicationRepository.findOne({ where: { id, userId } });
    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    await this.applicationRepository.remove(application);
    return { success: true };
  }

  // Favorites
  async findFavoritesByUser(userId: string): Promise<FavoriteVacancyEntity[]> {
    return this.favoriteRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async addFavorite(userId: string, vacancyId: string): Promise<FavoriteVacancyEntity> {
    const existing = await this.favoriteRepository.findOne({ where: { userId, vacancyId } });
    if (existing) {
      return existing;
    }

    const favorite = this.favoriteRepository.create({ userId, vacancyId });
    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: string, vacancyId: string): Promise<{ success: boolean }> {
    const favorite = await this.favoriteRepository.findOne({ where: { userId, vacancyId } });
    if (favorite) {
      await this.favoriteRepository.remove(favorite);
    }
    return { success: true };
  }
}
