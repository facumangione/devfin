# DevFin

Personal finance tracker built with React, Node.js, and PostgreSQL. Track income and expenses, visualize spending patterns, and stay on top of your monthly balance.

>**Active development** — see [CHANGELOG](./CHANGELOG.md) for progress.

## Features

- **Authentication** — JWT-based auth with refresh token rotation
- **Transactions** — Create, edit, and categorize income/expenses *(Sprint 2)*
- **Dashboard** — Monthly balance, category breakdown, spending trends *(Sprint 3)*
- **Export** — Download transactions as CSV *(Sprint 4)*

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Backend | Node.js, Express, TypeScript |
| ORM | Prisma |
| Database | PostgreSQL |
| Deploy | Vercel + Railway + Supabase |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or a [Supabase](https://supabase.com) project)

### Setup

```bash
# Clone the repo
git clone https://github.com/your-username/devfin.git
cd devfin

# Install dependencies
npm run install:all

# Configure environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env
# Edit both files with your values

# Run database migrations and seed
cd server
npm run db:migrate
npm run db:seed

# Start development servers
cd ..
npm run dev
```

The app runs on:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

## Project Structure

```
devfin/
├── client/               # React app (Vite)
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Route-level pages
│       ├── store/        # Zustand stores
│       └── lib/          # Utilities and API client
├── server/               # Express API
│   ├── prisma/           # Schema and migrations
│   └── src/
│       ├── controllers/  # Route handlers
│       ├── middleware/    # Auth, validation
│       ├── routes/       # Route definitions
│       └── lib/          # Shared utilities
└── docs/                 # Architecture diagrams
```

## API Reference

```
POST   /api/auth/register   Create account
POST   /api/auth/login      Sign in
POST   /api/auth/refresh    Rotate refresh token
POST   /api/auth/logout     Revoke refresh token
GET    /api/auth/me         Get current user
```

*(More endpoints added in Sprint 2)*

## License

MIT
