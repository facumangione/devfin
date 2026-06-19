import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  // Estudio contable - Expense
  { name: 'Honorarios Profesionales', icon: '⚖️', color: '#7c3aed', type: 'EXPENSE' as const },
  { name: 'Gastos de Oficina', icon: '🗄️', color: '#0891b2', type: 'EXPENSE' as const },
  { name: 'Impuestos', icon: '📋', color: '#dc2626', type: 'EXPENSE' as const },
  { name: 'Sueldos', icon: '💵', color: '#ea580c', type: 'EXPENSE' as const },
  { name: 'Servicios Profesionales', icon: '🧾', color: '#0d9488', type: 'EXPENSE' as const },
  { name: 'Software y Licencias', icon: '💻', color: '#4f46e5', type: 'EXPENSE' as const },
  // Personal - Expense
  { name: 'Comida', icon: '🍔', color: '#f97316', type: 'EXPENSE' as const },
  { name: 'Transporte', icon: '🚌', color: '#3b82f6', type: 'EXPENSE' as const },
  { name: 'Vivienda', icon: '🏠', color: '#8b5cf6', type: 'EXPENSE' as const },
  { name: 'Salud', icon: '💊', color: '#ef4444', type: 'EXPENSE' as const },
  { name: 'Entretenimiento', icon: '🎬', color: '#ec4899', type: 'EXPENSE' as const },
  { name: 'Compras', icon: '🛍️', color: '#f59e0b', type: 'EXPENSE' as const },
  // Income
  { name: 'Honorarios Cobrados', icon: '💼', color: '#10b981', type: 'INCOME' as const },
  { name: 'Sueldo', icon: '💰', color: '#14b8a6', type: 'INCOME' as const },
  { name: 'Inversiones', icon: '📈', color: '#6366f1', type: 'INCOME' as const },
  { name: 'Otros Ingresos', icon: '📦', color: '#6b7280', type: 'BOTH' as const },
]

async function main() {
  console.log('🌱 Seeding database...')

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category,
    })
  }

  console.log(`✅ Seeded ${categories.length} categories`)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
