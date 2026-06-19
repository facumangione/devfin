import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

const dateRangeSchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

export async function getMonthlyStats(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const result = dateRangeSchema.safeParse(req.query)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { from, to } = result.data

  const fromDate = from ? new Date(from) : new Date(new Date().setMonth(new Date().getMonth() - 5))
  const toDate = to ? new Date(to) : new Date()

  // Set to start/end of day
  fromDate.setDate(1)
  fromDate.setHours(0, 0, 0, 0)
  toDate.setHours(23, 59, 59, 999)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: fromDate, lte: toDate },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: { date: 'asc' },
  })

  // Group by month
  const monthlyMap: Record<string, { month: string; income: number; expenses: number }> = {}

  for (const tx of transactions) {
    const date = new Date(tx.date)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const label = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })

    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: label, income: 0, expenses: 0 }
    }

    const amount = parseFloat(tx.amount.toString())
    if (tx.type === 'INCOME') {
      monthlyMap[key].income += amount
    } else {
      monthlyMap[key].expenses += amount
    }
  }

  // Fill missing months in range
  const current = new Date(fromDate)
  while (current <= toDate) {
    const key = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
    if (!monthlyMap[key]) {
      const label = current.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      monthlyMap[key] = { month: label, income: 0, expenses: 0 }
    }
    current.setMonth(current.getMonth() + 1)
  }

  const data = Object.entries(monthlyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => ({
      ...value,
      income: parseFloat(value.income.toFixed(2)),
      expenses: parseFloat(value.expenses.toFixed(2)),
      balance: parseFloat((value.income - value.expenses).toFixed(2)),
    }))

  res.json({ data })
}

export async function getCategoryStats(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const result = dateRangeSchema.safeParse(req.query)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { from, to } = result.data

  const fromDate = from
    ? new Date(from)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const toDate = to ? new Date(to) : new Date()

  fromDate.setHours(0, 0, 0, 0)
  toDate.setHours(23, 59, 59, 999)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      type: 'EXPENSE',
      date: { gte: fromDate, lte: toDate },
    },
    include: { category: true },
  })

  const categoryMap: Record<
    string,
    { name: string; icon: string; color: string; total: number }
  > = {}

  for (const tx of transactions) {
    const { id, name, icon, color } = tx.category
    if (!categoryMap[id]) {
      categoryMap[id] = { name, icon, color, total: 0 }
    }
    categoryMap[id].total += parseFloat(tx.amount.toString())
  }

  const data = Object.values(categoryMap)
    .map((c) => ({ ...c, total: parseFloat(c.total.toFixed(2)) }))
    .sort((a, b) => b.total - a.total)

  res.json({ data })
}

export async function getSummary(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  startOfMonth.setHours(0, 0, 0, 0)
  now.setHours(23, 59, 59, 999)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startOfMonth, lte: now },
    },
    select: { amount: true, type: true },
  })

  const income = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

  const expenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

  res.json({
    data: {
      income: parseFloat(income.toFixed(2)),
      expenses: parseFloat(expenses.toFixed(2)),
      balance: parseFloat((income - expenses).toFixed(2)),
      month: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    },
  })
}
