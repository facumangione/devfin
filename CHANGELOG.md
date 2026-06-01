# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0] - 2026-06-01

### Added
- Transaction CRUD endpoints with server-side pagination
- Category endpoint returning all available categories
- Input validation with Zod on all transaction routes
- Transaction list page with filters by type, category, and date range
- Transaction form modal for create and edit
- Dashboard summary cards: balance, income, expenses
- Recent transactions list on dashboard
- App layout with sidebar navigation
- TypeScript types for transactions and categories
- Zustand store for transaction state management

## [0.1.0] - 2026-05-24

### Added
- Project scaffolding: monorepo structure with client/, server/, docs/
- Backend setup with Express, TypeScript, and Prisma ORM
- PostgreSQL schema: users, refresh_tokens, categories, transactions
- JWT authentication with access token (15m) and refresh token (7d) strategy
- Auth endpoints: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout, GET /auth/me
- Input validation with Zod on all auth routes
- Frontend setup with React 18, Vite, TypeScript, and Tailwind CSS
- Auth pages: Login and Register with react-hook-form and Zod validation
- Global auth state management with Zustand
- Axios interceptor for automatic token refresh on 401
- Protected route wrapper with redirect logic
- Default category seed: 12 categories (income + expense)
