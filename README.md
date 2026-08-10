<div align="center">

# 🎯 Hunter-AI

**Интеллектуальная платформа автоматизации поиска работы, парсинга вакансий и AI-генерации сопроводительных писем**

[![Turborepo](https://img.shields.io/badge/Turborepo-v2.4.0-ef4444?style=for-the-badge&logo=turborepo)](https://turbo.build/)
[![Next.js](https://img.shields.io/badge/Next.js-v15.1-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v19.0-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-v10.4-e0234e?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.7-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Ant Design](https://img.shields.io/badge/Ant%20Design-v5.24-0170fe?style=for-the-badge&logo=antdesign)](https://ant.design/)

[Возможности](#-основные-возможности) • [Архитектура](#-архитектура-проекта) • [Быстрый запуск](#-быстрый-запуск) • [Скрапинг](#-парсинг-вакансий-и-компаний) • [Документация](#-документация)

</div>

---

## 🌟 О проекте

**Hunter-AI** — это современная full-stack платформа для соискателей в IT-сфере, объединяющая умный скрапинг вакансий с крупнейших карьерных порталов и сайтов IT-компаний России, автоматический разбор резюме (PDF parser) и искусственный интеллект для сопоставления навыков (AI Match) и генерации индивидуальных сопроводительных писем.

---

## ✨ Основные возможности

- 🕷️ **Умный Playwright Scraper Engine**: Автоматический сбор вакансий с **HeadHunter (`hh.ru`)**, **Хабр Карьера**, **GetMatch** и прямых карьерных порталов IT-гигантов (Яндекс, VK, Сбер, Т-Банк, Авито, Ozon Tech, Selectel и др.).
- 📄 **Разбор резюме (PDF Resume Parser)**: Быстрая загрузка PDF резюме с помощью `pdf-parse`, автоматическое выявление стека технологий, опыта работы, роли и уровня (Junior / Middle / Senior / Lead).
- 🧠 **AI Job Matching**: Анализ соответствия вашего резюме выбранным вакансиям с расчетом процента совпадения, списка сильных сторон и пропущенных хард-скиллов.
- ✍️ **AI Cover Letter Generator**: Автоматическое создание 3 типов адаптивных сопроводительных писем:
  - ⚡ *Short & Direct* (Краткое и по делу)
  - 🛠️ *Technical & Detailed* (С акцентом на стек и опыт)
  - 🚀 *Product & Impact Focus* (С ориентацией на бизнес-результаты)
- 🍪 **Управление Cookie-сессиями**: Поддержка проверки авторизации через Playwright и работа с защищенными страницами.
- 📊 **Дашборд и Аналитика**: Наглядные метрики откликов, статистика по подходящим вакансиям и статус авто-откликов.

---

## 🏗 Архитектура Проекта

Проект реализован в виде монорепозитория на основе **Yarn Workspaces** и **Turborepo**:

```text
Hunter-Ai/
├── 📁 apps/
│   ├── 🌐 web/                 # Frontend: Next.js 15, React 19, Ant Design, Redux Toolkit, SCSS
│   └── ⚙️ api/                 # Backend: NestJS, SQLite, TypeORM, Playwright Scraper, Swagger
├── 📁 packages/
│   ├── 📦 types/               # Общие TypeScript интерфейсы и DTO (@hunter-ai/types)
│   └── 🛠️ tsconfig/            # Общие базовые конфигурации TypeScript (@hunter-ai/tsconfig)
├── 📁 .agents/                 # Правила архитектуры и навыки AI-ассистентов
├── 📄 DOCUMENTATION.md         # Полная техническая документация архитектуры
└── 📄 turbo.json               # Конфигурация пайплайна Turborepo
```

### 💻 Технологический стек

| Слой | Технология | Описание |
| :--- | :--- | :--- |
| **Monorepo Engine** | Yarn Workspaces + Turborepo | Кэширование сборки, параллельный запуск скриптов |
| **Frontend** | Next.js 15 (App Router) + React 19 | SSR, AntD Registry, SCSS Modules |
| **State & Data Fetching** | Redux Toolkit & RTK Query | Централизованный стор, авто-инвалидация тегов |
| **UI Components** | Ant Design 5 + @ant-design/icons | Темная тема (`ConfigProvider`), адаптивные компоненты |
| **Backend** | NestJS 10 (TypeScript) | Модульная архитектура, Swagger (`/api/docs`), JWT Auth |
| **Database & ORM** | SQLite + TypeORM | Локальная реляционная база данных |
| **Scraping & Parsing** | Playwright + `pdf-parse` | Автоматизация браузера Chromium, парсинг PDF |

---

## 🏢 Парсинг вакансий и компаний

В платформу предустановлена интеграция со скрапингом вакансий следующих ведущих IT-компаний и агрегаторов:

- 🟡 **Яндекс** (`yandex.ru/jobs`)
- 🔵 **VK** (`team.vk.company`)
- 🟢 **Сбер / SberTech** (`rabota.sber.ru`)
- 🟡 **Т-Банк** (`tbank.ru/career`)
- 🟣 **Авито** (`career.avito.ru`)
- 🔵 **Ozon Tech** (`job.ozon.ru`)
- 🔴 **Альфа-Банк** (`job.alfabank.ru`)
- 🛡️ **Лаборатория Касперского** (`careers.kaspersky.ru`)
- 🌐 **Selectel** (`selectel.ru/careers`)
- 🛡️ **Positive Technologies** (`ptsecurity.com`)
- 🟦 **Хабр Карьера** (`career.habr.com`)
- 🔴 **HeadHunter** (`hh.ru`)

---

## 🚀 Быстрый запуск

### Требования
- **Node.js**: `>= 18.0.0`
- **Yarn**: `>= 1.22.22`

### 1. Клонирование и установка зависимостей

```bash
git clone https://github.com/culcat/Hunter-Ai.git
cd Hunter-Ai
yarn install
```

### 2. Запуск в режиме разработки

Запустить все приложения (Frontend + Backend) параллельно:

```bash
yarn dev
```

После запуска приложения доступны по адресам:
- 🌐 **Frontend App**: `http://localhost:3000`
- ⚙️ **Backend API**: `http://localhost:3001`
- 📚 **Swagger API Docs**: `http://localhost:3001/api/docs`

### 3. Таргетированный запуск компонентов

```bash
# Запустить только Frontend (Next.js)
yarn dev --filter=@hunter-ai/web

# Запустить только Backend (NestJS)
yarn dev --filter=@hunter-ai/api
```

### 4. Проверка и сборка проекта

```bash
# Проверка типов TypeScript во всем монорепозитории
yarn type-check

# Линтинг кода
yarn lint

# Сборка production-версии
yarn build
```

---

## 📖 Документация

Подробная архитектурная документация, структура сущностей базы данных, схемы DTO и гайдлайны по разработке содержатся в файле [`DOCUMENTATION.md`](DOCUMENTATION.md).

---

<div align="center">
  <sub>Hunter-AI Monorepo © 2026. All rights reserved.</sub>
</div>
