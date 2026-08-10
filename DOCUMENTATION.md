# Project Documentation & Architecture Overview

Welcome to the **Hunter-Ai** monorepository project documentation. This document provides a comprehensive overview of the full-stack architecture, repository structure, developer workflows, and AI agent guidelines.

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
| **Backend App (`apps/api`)** | NestJS (v10+) | Feature-based modules, Dependency Injection |
| **Database & ORM** | SQLite + TypeORM | Relational database with typed entities |
| **Validation** | `class-validator` + `class-transformer` | Global DTO validation pipe |
| **API Documentation** | Swagger / OpenAPI | Automated API spec available at `/api/docs` |
| **Shared Packages (`packages/*`)** | `@hunter-ai/types`, `@hunter-ai/tsconfig` | Reusable DTOs, interfaces, and TS rules |

---

## 🛠 Useful Monorepo Commands

Run these commands from the root directory of the monorepo:

### Workspace-wide Commands
- **Start All Dev Servers**: `yarn dev`
- **Build All Apps & Packages**: `yarn build`
- **Type Check Workspace**: `yarn type-check`
- **Lint Workspace**: `yarn lint`
- **Run Tests Workspace**: `yarn test`

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
