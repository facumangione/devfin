# Sprint 1 — Commit Guide

Estos son los commits que deberías hacer en orden para que el historial se vea natural y trabajado.
Hacé uno por vez mientras vas implementando cada parte.

---

## Secuencia de commits

```bash
# 1. Setup inicial del proyecto
git init
git add .
git commit -m "chore: init monorepo with client, server, and docs structure"

# 2. Configuración del servidor
git add server/package.json server/tsconfig.json server/.env.example
git commit -m "chore: setup express server with typescript and prisma"

# 3. Schema de base de datos
git add server/prisma/
git commit -m "feat: add prisma schema with user, token, and transaction models"

# 4. Utilidades de auth
git add server/src/lib/
git commit -m "feat: add JWT utility functions with refresh token support"

# 5. Middleware de autenticación
git add server/src/middleware/
git commit -m "feat: add auth middleware for protected route handling"

# 6. Controller de auth
git add server/src/controllers/auth.controller.ts
git commit -m "feat: implement register and login controllers with bcrypt hashing"

# -- Imaginá que acá encontraste un edge case --
git add server/src/controllers/auth.controller.ts
git commit -m "fix: return 409 on duplicate email instead of 500"

# 7. Rutas y servidor principal
git add server/src/routes/ server/src/index.ts
git commit -m "feat: wire auth routes and configure cors and error handler"

# 8. Setup del cliente
git add client/package.json client/vite.config.ts client/tailwind.config.js client/postcss.config.js client/tsconfig.json client/index.html
git commit -m "chore: setup react client with vite, tailwind, and typescript"

# 9. API client
git add client/src/lib/
git commit -m "feat: add axios instance with token injection and refresh interceptor"

# 10. Auth store
git add client/src/store/
git commit -m "feat: add zustand auth store with login, register, and logout actions"

# 11. Páginas de auth
git add client/src/pages/auth/
git commit -m "feat: add login and register pages with react-hook-form and zod"

# 12. Layout y rutas
git add client/src/components/ client/src/App.tsx client/src/main.tsx client/src/index.css
git commit -m "feat: add protected route wrapper and configure react-router"

# 13. Dashboard placeholder
git add client/src/pages/dashboard/
git commit -m "feat: add dashboard placeholder page for authenticated users"

# 14. Seed de categorías
git add server/prisma/seed.ts
git commit -m "chore: add prisma seed with 12 default income and expense categories"

# 15. Docs
git add README.md CHANGELOG.md
git commit -m "docs: add README with setup instructions and CHANGELOG for v0.1.0"

# 16. Tag del sprint
git tag v0.1.0
git push origin main --tags
```

---

## Tips para que se vea natural

- **Horarios variados**: no hagas todos los commits el mismo día ni a la misma hora.
  Distribuílos en 5-6 días dentro de la semana del sprint.
- **Separar fix del feat**: si encontrás un bug mientras desarrollás, commitealo aparte.
- **No commites todo junto**: hacé el git add selectivo como arriba.
- **Mensajes en inglés y en minúscula**: es el estándar de la industria.

---

## Branches sugeridas

```bash
git checkout -b feat/auth-and-setup   # al arrancar el sprint
# ... commits durante la semana ...
git checkout main
git merge feat/auth-and-setup --no-ff -m "feat: merge auth and project setup (sprint 1)"
git tag v0.1.0
```
