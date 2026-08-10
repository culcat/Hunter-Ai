# Project Documentation & Architecture Overview

Welcome to the **Hunter-Ai** monorepository project documentation. This document provides a comprehensive overview of the full-stack architecture, repository structure, backend services, developer workflows, and AI agent guidelines.

---

## 🏗 Monorepo Architecture Overview

The repository is structured as a TypeScript monorepo using **Yarn Workspaces** and **Turborepo**:

```
Hunter-Ai/
├── apps/
│   ├── web/                   # Next.js 15 + React 19 + Ant Design + RTK Query + SCSS Modules
│   └── api/                   # NestJS API + SQLite + TypeORM + class-validator + Swagger
├── packages/
│   ├── types/                 # Shared TypeScript interfaces & API DTO contracts (@hunter-ai/types)
│   └── tsconfig/              # Shared base tsconfig setups (@hunter-ai/tsconfig)
├── .agents/                   # AI Assistant skills & architecture rules
├── package.json               # Root monorepo workspace configuration
├── turbo.json                 # Turborepo task pipeline configuration
└── DOCUMENTATION.md           # Master project documentation
```

---

## 💻 Technical Stack Matrix

| Layer | Technology | Key Features |
| :--- | :--- | :--- |
| **Monorepo Manager** | Yarn Workspaces + Turborepo | Parallel task runner, caching, cross-package linking |
| **Frontend App (`apps/web`)** | Next.js 15 + React 19 | App Router, SSR, AntD Registry integration |
| **UI Library** | Ant Design (`antd` v5+) | `ConfigProvider` theme customization, custom UI components |
| **Frontend State & Fetching** | Redux Toolkit & RTK Query | Centralized store & API mutation caching |
| **Frontend Styling** | SCSS Modules | Scoped component styles (`*.module.scss`) |
| **Backend Framework (`apps/api`)** | NestJS (v10+) | Feature-based modules, Dependency Injection, Clean Architecture |
| **Database & ORM** | SQLite + TypeORM | Relational database with multi-indexed entities (`User`, `Resume`, `Vacancy`, `JobApplication`, `FavoriteVacancy`) |
| **Document Processing & Scrapers** | `pdf-parse`, `playwright` | PDF resume parsing, automated scrapers for HeadHunter, Habr Career, GetMatch, corporate portals |
| **Authentication** | JWT (`@nestjs/jwt`), `bcrypt`, Passport | Bearer token authorization, `@CurrentUser()` decorator, `JwtAuthGuard` |
| **Validation & Docs** | `class-validator` + Swagger | Global DTO validation pipe, OpenAPI interactive UI at `/api/docs` |
| **Shared Packages (`packages/*`)** | `@hunter-ai/types`, `@hunter-ai/tsconfig` | Reusable DTOs, interfaces, filter contracts, and TS rules |

---

## 🚀 Backend System Architecture (`apps/api`)

The backend is built as a domain-driven NestJS server following Clean Architecture:

```
apps/api/src/
├── database/                   # DatabaseModule registering TypeORM SQLite setup
├── modules/
│   ├── auth/                   # JWT Auth, Register, Login, CurrentUser decorator, JwtAuthGuard
│   ├── users/                  # User entity & account services
│   ├── resumes/                # PDF upload, PDF text extraction, structured JSON parser, manual editing CRUD
│   ├── vacancies/              # Multi-parameter filter engine, HeadHunter, Habr, GetMatch & Playwright scrapers
│   ├── ai-match/               # Resume vs Vacancy matching engine (% score, strengths, weaknesses, missing skills)
│   ├── cover-letters/          # Multi-variant cover letter generator (Short, Tech-detailed, Product-impact)
│   └── applications/           # Kanban job application status tracking pipeline & job favorites
├── app.module.ts               # Root module aggregating feature modules
└── main.ts                     # NestJS bootstrap, Swagger OpenAPI docs, validation pipe
```

### Key API Endpoints & Capabilities

#### 1. Authentication & Users (`/api/auth`, `/api/users`)
- `POST /api/auth/register` --- User account creation with password hashing (`bcrypt`).
- `POST /api/auth/login` --- JWT token issuance.
- `GET /api/auth/me` --- Returns current user profile.

#### 2. Resumes & PDF Parsing (`/api/resumes`)
- `POST /api/resumes/upload` --- Multipart PDF file upload & automatic structured JSON extraction (`position`, `grade`, `totalExperienceMonths`, `skills`, `education`, `englishLevel`, `projects`, `workExperience`, `summary`).
- `GET /api/resumes`, `GET /api/resumes/:id` --- Retrieve candidate resumes.
- `PUT /api/resumes/:id` --- Manual editing of parsed JSON resume fields.

#### 3. Vacancies & Parsing Engine (`/api/vacancies`)
- `GET /api/vacancies` --- Multi-parameter filter query engine:
  - Location: `country`, `region`, `city`
  - Work Format: `remote`, `office`, `hybrid`
  - Salary range: `salaryFrom`, `salaryTo`, `onlyWithSalary`
  - Stack & Grade: `techStack`, `grade`, `company`, `employmentType`, `englishLevel`
  - Date & Search: `publishedAfter`, `searchQuery`
- `POST /api/vacancies/parse` --- Triggers scraping and parsing from HeadHunter, Habr Career, GetMatch, or Playwright dynamic web page scraper.

#### 4. AI Match Engine (`/api/ai-match`)
- `POST /api/ai-match/evaluate` --- Evaluates resume vs vacancy compatibility returning match score %, strengths, weaknesses, missing skills, and strategic recommendations.

#### 5. Cover Letter Generator (`/api/cover-letters`)
- `POST /api/cover-letters/generate` --- Generates 3 tailored cover letter variants:
  1. *Short & Direct*
  2. *Technical & Detailed*
  3. *Product & Impact Focus*

#### 6. Job Applications & Favorites (`/api/applications`, `/api/favorites`)
- `GET /api/applications`, `POST /api/applications` --- Application tracking pipeline.
- `PATCH /api/applications/:id/status` --- Updates Kanban status (`applied`, `screening`, `interview`, `offer`, `rejected`).
- `GET /api/favorites`, `POST /api/favorites/:vacancyId`, `DELETE /api/favorites/:vacancyId` --- Job bookmarking.

---

## 🛠 Useful Monorepo Commands

Run these commands from the root directory of the monorepo:

### Workspace-wide Commands
- **Start All Dev Servers**: `yarn dev`
- **Build All Apps & Packages**: `yarn build`
- **Type Check Workspace**: `yarn type-check`
- **Lint Workspace**: `yarn lint`

### Targeted App Commands
- **Start Web App Only**: `yarn dev --filter=@hunter-ai/web`
- **Start API Server Only**: `yarn dev --filter=@hunter-ai/api`
- **Build Shared Types**: `yarn workspace @hunter-ai/types build`
- **Type Check API Server**: `yarn workspace @hunter-ai/api type-check`
- **Build API Server**: `yarn workspace @hunter-ai/api build`

---

## 🤖 AI Agent Roles & Skills

The workspace contains customized agent skill definitions in `.agents/`:
- **Frontend Skill** (`.agents/skills/frontend-next-antd/SKILL.md`): Best practices for Next.js 15, AntD v5, SCSS Modules, RTK Query, and i18n localization.
- **Backend Skill** (`.agents/skills/backend-nest-sqlite-typeorm/SKILL.md`): Architectural rules for NestJS feature modules, TypeORM SQLite entities, DTO validation, and Swagger docs.
- **Global Rules** (`.agents/AGENTS.md`): Explicit guidelines (strict TypeScript, granular Git commits, no `any`, no inline styles).
