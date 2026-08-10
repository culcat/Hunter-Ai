# Workspace Agent Guidelines & Architecture Rules

Welcome to the full-stack development environment. This document defines the core architecture, workflow conventions, and rules for AI agents operating on this project.

## Technology Stack Overview

- **Frontend**: Next.js, React 19 (Functional Components + Hooks), TypeScript, Ant Design (AntD), SCSS Modules, Redux Toolkit / RTK Query, i18n.
- **Backend**: NestJS, TypeScript, SQLite, TypeORM, `class-validator`, `class-transformer`, Swagger / OpenAPI.

---

## Agent Roles & Skill Triggering

### 1. Frontend Agent (`skills/frontend-next-antd`)
Triggers when implementing, refactoring, or reviewing client-side code, Next.js routes, React components, Ant Design UI elements, Redux store, or SCSS styling.

### 2. Backend Agent (`skills/backend-nest-sqlite-typeorm`)
Triggers when building or modifying backend modules, NestJS controllers/services, TypeORM database entities, SQLite configurations, DTO validations, or REST API endpoints.

---

## Global Rules & Dos & Don'ts

### ✅ Dos
- **Strict TypeScript**: Always use explicit types and interfaces. Define shared types under `src/types/`.
- **Functional Components**: Use React functional components with hooks exclusively.
- **SCSS Modules**: Style components using `*.module.scss`. Keep styles scoped and clean.
- **Modular NestJS Architecture**: Enforce feature-based modules (`src/modules/<feature>/`) on the backend.
- **DTO Validation**: Use `class-validator` and `class-transformer` on all incoming request payloads.
- **Documentation**: Keep `DOCUMENTATION.md` up to date with major system changes.
- **Git Commit Workflow**: Create granular git commits for each feature/fix (`feat: description`, `fix: description`, `refactor: description`).

### ❌ Don'ts
- ❌ Do NOT use `any` under any circumstances.
- ❌ Do NOT use inline styles in React components.
- ❌ Do NOT use `import React from 'react'` (or `'React'`). In React 19 / Next.js automatic JSX transform is enabled; import named exports directly if needed (e.g. `import { useState } from 'react'`).
- ❌ Do NOT write monolithic files. Break down large components (`src/components/ui` & `src/components/shared`) and complex business logic into custom hooks (`use*.ts`) or dedicated service methods.
- ❌ Do NOT bypass validation or leak database entities directly to the client without DTO transformation.

---

## File & Project Structure

```
.agents/
  ├── AGENTS.md
  └── skills/
      ├── frontend-next-antd/
      │   └── SKILL.md
      └── backend-nest-sqlite-typeorm/
          └── SKILL.md
```

Refer to the individual `SKILL.md` documents in `.agents/skills/` for technical implementation details.
