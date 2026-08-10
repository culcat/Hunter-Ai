import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entities/user.entity';
import { CreateUserRequestDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
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
    return this.userRepository.save(user);
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
}
