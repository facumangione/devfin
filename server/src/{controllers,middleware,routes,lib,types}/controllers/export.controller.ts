import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

const querySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  type: z.enum(['INCOME', 'EXPENSE']).optional(),
})

export async function exportTransactions(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const result = querySchema.safeParse(req.query)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { from, to, type } = result.data

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      ...(type && { type }),
      ...(from || to
        ? {
            date: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          }
        : {}),
    },
    include: { category: true },
    orderBy: { date: 'desc' },
  })

  const rows = [
    ['Date', 'Description', 'Type', 'Category', 'Amount'],
    ...transactions.map((t) => [
      new Date(t.date).toLocaleDateString('en-US'),
      `"${t.description.replace(/"/g, '""')}"`,
      t.type,
      t.category.name,
      t.type === 'EXPENSE'
        ? `-${parseFloat(t.amount.toString()).toFixed(2)}`
        : parseFloat(t.amount.toString()).toFixed(2),
    ]),
  ]

  const csv = rows.map((r) => r.join(',')).join('\n')
  const filename = `devfin-transactions-${new Date().toISOString().slice(0, 10)}.csv`

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
  res.send(csv)
}
