import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const categories = [
  // Expense categories
  { name: 'Food & Dining', icon: '🍔', color: '#f97316', type: 'EXPENSE' as const },
  { name: 'Transport', icon: '🚌', color: '#3b82f6', type: 'EXPENSE' as const },
  { name: 'Housing', icon: '🏠', color: '#8b5cf6', type: 'EXPENSE' as const },
  { name: 'Health', icon: '💊', color: '#ef4444', type: 'EXPENSE' as const },
  { name: 'Entertainment', icon: '🎬', color: '#ec4899', type: 'EXPENSE' as const },
  { name: 'Shopping', icon: '🛍️', color: '#f59e0b', type: 'EXPENSE' as const },
  { name: 'Education', icon: '📚', color: '#06b6d4', type: 'EXPENSE' as const },
  { name: 'Utilities', icon: '⚡', color: '#84cc16', type: 'EXPENSE' as const },
  // Income categories
  { name: 'Salary', icon: '💼', color: '#10b981', type: 'INCOME' as const },
  { name: 'Freelance', icon: '💻', color: '#14b8a6', type: 'INCOME' as const },
  { name: 'Investments', icon: '📈', color: '#6366f1', type: 'INCOME' as const },
  { name: 'Other', icon: '📦', color: '#6b7280', type: 'BOTH' as const },
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
