import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

const createSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required').max(255),
  type: z.enum(['INCOME', 'EXPENSE']),
  date: z.string().datetime(),
  categoryId: z.string().min(1, 'Category is required'),
})

const updateSchema = createSchema.partial()

const querySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
  categoryId: z.string().optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
})

export async function getTransactions(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const result = querySchema.safeParse(req.query)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { page, limit, type, categoryId, from, to } = result.data
  const skip = (page - 1) * limit

  const where = {
    userId,
    ...(type && { type }),
    ...(categoryId && { categoryId }),
    ...(from || to
      ? {
          date: {
            ...(from && { gte: new Date(from) }),
            ...(to && { lte: new Date(to) }),
          },
        }
      : {}),
  }

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: true },
      orderBy: { date: 'desc' },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ])

  res.json({
    data: transactions,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function getTransaction(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const { id } = req.params

  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
    include: { category: true },
  })

  if (!transaction) {
    res.status(404).json({ error: 'Transaction not found' })
    return
  }

  res.json({ data: transaction })
}

export async function createTransaction(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const result = createSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { amount, description, type, date, categoryId } = result.data

  const category = await prisma.category.findUnique({ where: { id: categoryId } })
  if (!category) {
    res.status(400).json({ error: 'Invalid category' })
    return
  }

  const transaction = await prisma.transaction.create({
    data: {
      amount,
      description,
      type,
      date: new Date(date),
      categoryId,
      userId,
    },
    include: { category: true },
  })

  res.status(201).json({ data: transaction })
}

export async function updateTransaction(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const { id } = req.params
  const result = updateSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const existing = await prisma.transaction.findFirst({ where: { id, userId } })
  if (!existing) {
    res.status(404).json({ error: 'Transaction not found' })
    return
  }

  const { date, ...rest } = result.data

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...rest,
      ...(date && { date: new Date(date) }),
    },
    include: { category: true },
  })

  res.json({ data: transaction })
}

export async function deleteTransaction(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const { id } = req.params

  const existing = await prisma.transaction.findFirst({ where: { id, userId } })
  if (!existing) {
    res.status(404).json({ error: 'Transaction not found' })
    return
  }

  await prisma.transaction.delete({ where: { id } })
  res.status(204).send()
}
