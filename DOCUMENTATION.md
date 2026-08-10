# Project Documentation & Architecture Overview

Welcome to the **Hunter-Ai** project documentation. This document provides a high-level overview of the system architecture, developer guidelines, agent skills, and workflow conventions.

---

## 🏗 Architecture & Stack Overview

The workspace is configured for full-stack TypeScript development:

| Component | Framework / Library | Primary Purpose |
| :--- | :--- | :--- |
| **Frontend** | Next.js + React 19 | Server-side rendering, client routing, user interface |
| **UI Library** | Ant Design (`antd` v5+) | Enterprise component framework |
| **Frontend State** | Redux Toolkit & RTK Query | Global application state management and data fetching |
| **Frontend Styling** | SCSS Modules (`*.module.scss`) | Scoped component styling |
| **Backend** | NestJS (v10+) | Modular RESTful API server |
| **Database** | SQLite | Lightweight relational database |
| **ORM** | TypeORM | Entity definitions, migrations, and database access |
| **Validation** | `class-validator` + `class-transformer` | Request DTO validation |
| **API Docs** | Swagger / OpenAPI | Automatic endpoint documentation |

---

## 🤖 Agent Roles & Skill Definitions

The project relies on `.agents` workspace configurations to guide AI assistants during coding tasks:

### 1. Global Rules (`.agents/AGENTS.md`)
- Defines strict TypeScript practices, commit conventions (`feat/fix/refactor: description`), code decomposition, and i18n requirements.
- Prohibits the use of `any` types and inline JSX styles.

### 2. Frontend Agent Skill (`.agents/skills/frontend-next-antd/SKILL.md`)
- **App Structure**: Standardized Next.js layout (`app/` or `pages/`), component hierarchy (`src/components/ui` for basic components, `src/components/shared` for domain features).
- **Ant Design**: Integrated with Next.js SSR via `AntdRegistry` and custom `ConfigProvider` themes.
- **State & Data**: RTK Query slices for API interaction and Redux Toolkit store.
- **Localization**: Structured i18n locales under `src/i18n/locales/`.

### 3. Backend Agent Skill (`.agents/skills/backend-nest-sqlite-typeorm/SKILL.md`)
- **Module Design**: Domain-driven feature modules under `src/modules/<feature>/`.
- **Database & Entities**: TypeORM entities with SQLite database configuration and migration procedures.
- **DTO Validation**: Strict request body validation using `class-validator` and `class-transformer`.
- **Swagger Documentation**: Automated OpenAPI docs setup via `@nestjs/swagger`.

---

## 🛠 Useful Commands

### Frontend
- Type Check: `yarn run tsc --noEmit`
- Linter: `yarn run eslint --fix`
- Unit Tests: `yarn run vitest run`

### Backend
- Start Server: `npm run start:dev`
- Run Migrations: `npx typeorm migration:run`
- Run Tests: `npm run test`
