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

  // Find oldest transaction to set default start date
  const oldest = await prisma.transaction.findFirst({
    where: { userId },
    orderBy: { date: 'asc' },
    select: { date: true },
  })

  const fromDate = from
    ? new Date(from)
    : oldest
    ? new Date(oldest.date.getFullYear(), oldest.date.getMonth(), 1)
    : new Date(new Date().getFullYear(), 0, 1)

  const toDate = to ? new Date(to) : new Date()

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

  const monthlyMap: Record<string, { month: string; income: number; expenses: number }> = {}

  for (const tx of transactions) {
    const date = new Date(tx.date)
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
    const label = `${date.toLocaleString('es-AR', { month: 'short', timeZone: 'UTC' })} ${date.getUTCFullYear()}`

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
    const key = `${current.getUTCFullYear()}-${String(current.getUTCMonth() + 1).padStart(2, '0')}`
    if (!monthlyMap[key]) {
      const label = `${current.toLocaleString('es-AR', { month: 'short', timeZone: 'UTC' })} ${current.getUTCFullYear()}`
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

  const oldest = await prisma.transaction.findFirst({
    where: { userId },
    orderBy: { date: 'asc' },
    select: { date: true },
  })

  const fromDate = from
    ? new Date(from)
    : oldest
    ? new Date(oldest.date.getFullYear(), oldest.date.getMonth(), 1)
    : new Date(new Date().getFullYear(), 0, 1)

  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const toDate = to ? new Date(to) : today

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
  const result = dateRangeSchema.safeParse(req.query)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { from, to } = result.data

  const oldest = await prisma.transaction.findFirst({
    where: { userId },
    orderBy: { date: 'asc' },
    select: { date: true },
  })

  const fromDate = from
    ? new Date(from)
    : oldest
    ? new Date(oldest.date.getUTCFullYear(), oldest.date.getUTCMonth(), 1)
    : new Date(new Date().getFullYear(), 0, 1)

  const toDate = to ? new Date(to) : new Date()

  fromDate.setHours(0, 0, 0, 0)
  toDate.setHours(23, 59, 59, 999)

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: fromDate, lte: toDate },
      status: 'confirmed',
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
      month: 'Todo el historial',
    },
  })
}