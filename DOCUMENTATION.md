# Project Documentation & Architecture Overview

Welcome to the **Hunter-Ai** monorepository project documentation. This document provides a comprehensive overview of the full-stack architecture, repository structure, backend services, frontend Next.js application, developer workflows, and AI agent guidelines.

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
| **UI Library** | Ant Design (`antd` v6+) | Dark theme algorithm (`ConfigProvider`), `@ant-design/icons`, custom UI components |
| **Frontend State & Fetching** | Redux Toolkit & RTK Query | Centralized store (`baseApi.ts`) with automatic Bearer token headers & tag invalidation |
| **Backend Framework (`apps/api`)** | NestJS (v10+) | Feature-based modules, Dependency Injection, Clean Architecture |
| **Database & ORM** | SQLite + TypeORM | Relational database with multi-indexed entities (`User`, `Resume`, `Vacancy`, `JobApplication`, `FavoriteVacancy`) |
| **Document Processing & Scrapers** | `pdf-parse`, `playwright` | PDF resume parsing, automated Playwright scrapers with authorization support for HeadHunter, Habr Career, GetMatch, and Russian IT company career portals |
| **Authentication** | JWT (`@nestjs/jwt`), `bcrypt`, Passport | Bearer token authorization, `@CurrentUser()` decorator, `JwtAuthGuard` |
| **Validation & Docs** | `class-validator` + Swagger | Global DTO validation pipe, OpenAPI interactive UI at `/api/docs` |
| **Shared Packages (`packages/*`)** | `@hunter-ai/types`, `@hunter-ai/tsconfig` | Reusable DTOs, interfaces (`Company`, `Vacancy`, `Resume`), filter contracts, and TS rules |

---

## 🏢 Russian IT Companies & Playwright Career Scraper Service (`CompaniesModule`)

The platform includes a dedicated database module and Playwright scraping engine for Russian IT company career sites:

### Pre-Seeded Russian IT Companies:
1. **Яндекс** (`https://yandex.ru/jobs/vacancies`)
2. **VK** (`https://team.vk.company/vacancies/`)
3. **Сбер (SberTech)** (`https://rabota.sber.ru/search`)
4. **Т-Банк** (`https://www.tbank.ru/career/it/`)
5. **Авито** (`https://career.avito.ru/vacancies`)
6. **Ozon Tech** (`https://job.ozon.ru/vacancy/`)
7. **Альфа-Банк** (`https://job.alfabank.ru/vacancies`)
8. **Лаборатория Касперского** (`https://careers.kaspersky.ru/vacancies/`)
9. **Selectel** (`https://selectel.ru/careers/`)
10. **Positive Technologies** (`https://ptsecurity.com/ru-ru/career/`)
11. **Хабр Карьера** (`https://career.habr.com/vacancies`)
12. **HeadHunter** (`https://hh.ru/search/vacancy?text=developer`)

### Scraper Engine Capabilities:
- **Playwright Browser Automation**: Headless Chromium instance navigating dynamic SPA career portals.
- **Authorization Support**: Form-based and cookie-based authentication before scraping for gated career sites (`authConfig` with login URL, username, password, and custom selectors).
- **Background API Interception & DOM Extraction**: Intercepts JSON job APIs and parses structured DOM cards.
- **NLP Tech Stack & Grade Detection**: Extracts skills (React, TypeScript, Python, NestJS, Go, Docker, PostgreSQL), grade level (Junior/Middle/Senior/Lead), salary range, and work format (remote/office/hybrid).
- **Deduplication**: Automatically upserts vacancies into SQLite database by `url` or `externalId`.


---

## 🌐 Frontend Next.js 15 Application (`apps/web`)

The client application connects to the NestJS API via Next.js rewrites (`/api/*` -> `http://localhost:3001/api/*`) and RTK Query (`src/store/api/baseApi.ts`):

### Connected Frontend Routes:
1. **`/` (Dashboard)**: Displays live active vacancy counts, candidate application metrics, primary candidate CV alignment, and recent job recommendations.
2. **`/jobs` (Vacancy Search & AI Match)**:
   - Filter jobs by keyword, work format (`remote`/`office`/`hybrid`), and grade level.
   - **Parse New Vacancies**: Modal triggering HeadHunter, Habr Career, GetMatch, or Playwright corporate site scrapers.
   - **AI Match Analysis**: Drawer calculating score %, strengths, weaknesses, and missing skills against candidate resume.
3. **`/jobs/[id]` (Vacancy Details & Cover Letter AI)**:
   - Detailed job view with required skills and metadata.
   - **AI Cover Letter Generator**: Generates 3 tailored cover letter styles (*Short & Direct*, *Technical & Detailed*, *Product & Impact Focus*).
   - **Quick Apply**: Saves job application directly to backend Kanban pipeline.
4. **`/resumes` (PDF Parser & Profile Editor)**:
   - PDF Resume Upload zone with drag & drop (`pdf-parse`).
   - Structured JSON editor for position, grade, experience, english level, skills, and summary.
   - Set primary candidate CV toggle.
5. **`/applications` (Kanban Pipeline & Favorites)**:
   - Track application stages (`applied`, `screening`, `interview`, `offer`, `rejected`).
   - Manage application notes and bookmarked favorite jobs.

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

---

## 🤖 AI Agent Roles & Skills

The workspace contains customized agent skill definitions in `.agents/`:
- **Frontend Skill** (`.agents/skills/frontend-next-antd/SKILL.md`): Best practices for Next.js 15, AntD v5, SCSS Modules, RTK Query, and i18n localization.
- **Backend Skill** (`.agents/skills/backend-nest-sqlite-typeorm/SKILL.md`): Architectural rules for NestJS feature modules, TypeORM SQLite entities, DTO validation, and Swagger docs.
- **Global Rules** (`.agents/AGENTS.md`): Explicit guidelines (strict TypeScript, granular Git commits, no `any`, no inline styles).
