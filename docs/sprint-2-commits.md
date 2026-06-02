# Sprint 2 — Commit Guide

Distribuí estos commits en 5-6 días. Branch: `feat/transactions`

---

## Secuencia de commits

```bash
# Día 1 — backend: transaction controller
git add server/src/controllers/transaction.controller.ts
git commit -m "feat: add transaction CRUD controller with pagination and filters"

git add server/src/controllers/category.controller.ts
git commit -m "feat: add category controller to expose available categories"
```

```bash
# Día 2 — backend: rutas y servidor
git add server/src/routes/transaction.routes.ts server/src/routes/category.routes.ts
git commit -m "feat: register transaction and category routes with auth middleware"

git add server/src/index.ts
git commit -m "chore: mount transaction and category routers on express app"
```

```bash
# Día 3 — frontend: tipos y store
git add client/src/types/transaction.types.ts
git commit -m "feat: add TypeScript types for transaction and category entities"

git add client/src/store/transaction.store.ts
git commit -m "feat: add zustand transaction store with CRUD actions and filter state"
```

```bash
# Día 4 — frontend: componentes
git add client/src/components/transactions/TransactionForm.tsx
git commit -m "feat: add transaction form modal with type toggle and category select"

git add client/src/components/transactions/TransactionItem.tsx
git commit -m "feat: add transaction list item with edit and delete actions"

git add client/src/components/transactions/TransactionFilters.tsx
git commit -m "feat: add filter bar for type, category, and date range"
```

```bash
# Día 5 — frontend: páginas y layout
git add client/src/components/layout/AppLayout.tsx
git commit -m "feat: add app layout with sidebar navigation"

git add client/src/pages/dashboard/TransactionsPage.tsx
git commit -m "feat: add transactions page with list, filters, and pagination"

git add client/src/pages/dashboard/DashboardPage.tsx
git commit -m "feat: update dashboard with summary cards and recent transactions"

git add client/src/App.tsx
git commit -m "chore: update router with transactions route and app layout"
```

```bash
# Día 6 — docs y tag
git add CHANGELOG.md
git commit -m "docs: update CHANGELOG for v0.2.0"

git tag v0.2.0
git push origin feat/transactions
git checkout main
git merge feat/transactions --no-ff -m "feat: merge transactions CRUD and dashboard (sprint 2)"
git push origin main --tags
```
