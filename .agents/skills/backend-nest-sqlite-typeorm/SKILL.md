---
name: backend-nest-sqlite-typeorm
description: Architecture rules, TypeORM SQLite database mappings, DTO validation, and API development guidelines for Backend development using NestJS, TypeScript, SQLite, and TypeORM.
---

# Backend Agent Skill: NestJS + TypeORM + SQLite (Model: Gemini 3.6)

This skill governs all backend server application development (`apps/api`). As a worker sub-agent operating on **Gemini 3.6**, you MUST follow strict NestJS architecture standards, create dedicated git feature branches (`feature/backend-<task-name>`), execute automated tests (`yarn test`, `yarn lint`, `yarn type-check`), and submit Pull Requests for review by the **Code-Reviewer Agent (Opus 4.6)**.

---

## 🔄 Sub-Agent Execution Pipeline

1. **Branch Creation**: Create a unique task branch before modifying code: `git checkout -b feature/backend-<task-name>`.
2. **Implementation**: Implement NestJS modules, TypeORM SQLite entities, Playwright scrapers, DTOs, and controllers.
3. **Verification**: Run `yarn workspace @hunter-ai/api test` and `yarn type-check` to verify code correctness.
4. **Pull Request**: Generate PR description using `.agents/templates/pr_template.md`.
5. **Code Review Handoff**: Submit PR to **Code-Reviewer Agent (Opus 4.6)** for quality verification.

## 🛠 Technology Stack

- **Framework**: NestJS (v10+)
- **Language**: TypeScript (Strict Mode required)
- **Database**: SQLite (file-based or `:memory:` for testing)
- **ORM**: TypeORM (`@nestjs/typeorm` + `typeorm` + `sqlite3` / `better-sqlite3`)
- **Validation**: `class-validator` + `class-transformer`
- **Documentation**: `@nestjs/swagger` + `swagger-ui-express`

---

## 📁 Directory Structure & Feature Module Layout

```
src/
├── app.module.ts               # Root application module (Database config, imports)
├── main.ts                     # NestJS Bootstrap, global pipes, filters, Swagger
├── common/                     # Cross-cutting concerns
│   ├── decorators/             # Custom decorators (@CurrentUser(), @Public())
│   ├── filters/                # Global exception filters (http-exception.filter.ts)
│   ├── interceptors/           # Response transform interceptor (transform.interceptor.ts)
│   ├── guards/                 # Auth & role guards (jwt-auth.guard.ts)
│   └── dto/                    # Pagination DTOs, base responses
├── config/                     # Environment configuration (typeorm.config.ts)
└── modules/                    # Feature modules (Domain-driven structure)
    ├── users/
    │   ├── dto/
    │   │   ├── create-user.dto.ts
    │   │   └── update-user.dto.ts
    │   ├── entities/
    │   │   └── user.entity.ts
    │   ├── users.controller.ts
    │   ├── users.service.ts
    │   └── users.module.ts
    └── auth/
        ├── auth.controller.ts
        ├── auth.service.ts
        └── auth.module.ts
```

---

## 🗄 SQLite & TypeORM Configuration

### 1. `AppModule` Database Registration

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { User } from './modules/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_FILE || 'data/app.sqlite',
      entities: [User],
      synchronize: process.env.NODE_ENV !== 'production', // Use migrations in production
      logging: process.env.NODE_ENV === 'development',
    }),
    UsersModule,
  ],
})
export class AppModule {}
```

### 2. Entity Definition Example (`User`)

Always use explicit column types and UUID/Auto-increment primary keys:

```typescript
// src/modules/users/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index('idx_user_email')
  email: string;

  @Column({ select: false })
  passwordHash: string;

  @Column({ type: 'varchar', default: UserRole.USER })
  role: UserRole;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 📥 DTO Validation & `class-validator`

All incoming request payloads MUST be validated using DTO classes with `class-validator` decorators.

```typescript
// src/modules/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Unique user email' })
  @IsEmail({}, { message: 'Invalid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ example: 'Password123!', description: 'User account password' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
```

---

## 🎮 Controllers & Services Pattern

### Controller (`users.controller.ts`)

```typescript
// src/modules/users/users.controller.ts
import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}
```

### Service (`users.service.ts`)

```typescript
// src/modules/users/users.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existing) {
      throw new ConflictException('User with this email already exists');
    }

    const user = this.userRepository.create({
      email: createUserDto.email,
      passwordHash: createUserDto.password, // Ensure password is hashed before saving!
      role: createUserDto.role,
    });

    return this.userRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
```

---

## 🚀 Main Bootstrap (`main.ts`)

Configure global validation, exceptions, and Swagger documentation:

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Enable Global DTO Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Setup Swagger OpenAPI Docs
  const config = new DocumentBuilder()
    .setTitle('Application API')
    .setDescription('NestJS + TypeORM + SQLite API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 Application running on http://localhost:${port}`);
  console.log(`📚 Swagger docs available on http://localhost:${port}/api/docs`);
}

bootstrap();
```

---

## 📜 Key Backend Coding Standards

- ✅ **Strict Feature Modules**: Keep modules encapsulated in `src/modules/<feature>/`.
- ✅ **DTO Validation**: Every POST/PUT/PATCH endpoint MUST accept a validated DTO class decorated with `class-validator` rules.
- ✅ **Swagger Documentation**: Annotate controllers and DTO properties with `@ApiTags()`, `@ApiOperation()`, `@ApiProperty()`.
- ✅ **Entity Security**: Never expose sensitive columns like `passwordHash` by default (`{ select: false }`).
- ✅ **Proper Exceptions**: Throw built-in NestJS exceptions (`NotFoundException`, `ConflictException`, `BadRequestException`, `ForbiddenException`).
- ❌ **No Raw SQL Strings**: Use TypeORM QueryBuilder or Repository methods to prevent SQL injection vulnerabilities.
- ❌ **No `any`**: Strict return types on controller handlers and service methods.
