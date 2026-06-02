# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-06-02

### Added
- CSV export endpoint with date range and type filters
- Export CSV button on transactions page
- Full production deploy: Vercel (frontend) + Railway (backend) + Supabase (database)

### Fixed
- JWT expiresIn TypeScript overload error on build
- import.meta.env TypeScript compatibility for Vite
- CORS configuration for production domain

## [0.3.0] - 2026-05-31

### Added
- Stats controller with monthly balance aggregation (income vs expenses per month)
- Stats controller with expenses breakdown by category
- Monthly summary endpoint for current month totals
- Monthly overview line chart with income, expenses, and balance lines (Recharts)
- Expenses by category donut chart (Recharts)
- Date range filter on dashboard to update charts dynamically
- Zustand stats store with monthly and category state

### Changed
- Dashboard updated with summary cards pulling from API
- Dashboard layout reorganized with charts grid

## [0.2.0] - 2026-05-28

### Added
- Transaction CRUD endpoints with server-side pagination
- Category endpoint returning all available categories
- Input validation with Zod on all transaction routes
- TypeScript types for transaction and category entities
- Zustand transaction store with CRUD actions and filter state
- Transaction form modal with type toggle and category selector
- Transaction list item with inline edit and delete actions
- Filter bar for type, category, and date range
- App layout with sidebar navigation
- Transactions page with list, filters, and pagination
- Dashboard summary cards: balance, income, expenses

## [0.1.0] - 2026-05-25

### Added
- Project scaffolding: monorepo structure with client/, server/, docs/
- Backend setup with Express, TypeScript, and Prisma ORM
- PostgreSQL schema: users, refresh_tokens, categories, transactions
- JWT authentication with access token (15m) and refresh token (7d) strategy
- Auth endpoints: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout, GET /auth/me
- Input validation with Zod on all auth routes
- Frontend setup with React 18, Vite, TypeScript, and Tailwind CSS
- Login and Register pages with react-hook-form and Zod validation
- Global auth state management with Zustand
- Axios interceptor for automatic token refresh on 401
- Protected route wrapper with redirect logic
- Default category seed: 12 categories (income + expense)