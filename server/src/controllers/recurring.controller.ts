import { Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth.middleware'

const createSchema = z.object({
  description: z.string().min(1, 'La descripción es obligatoria'),
  amount: z.number().positive('El monto debe ser mayor a 0'),
  type: z.enum(['INCOME', 'EXPENSE']),
  categoryId: z.string().min(1, 'La categoría es obligatoria'),
  totalInstallments: z.number().int().positive().optional().nullable(),
  nextDueDate: z.string().datetime(),
})

const updateSchema = createSchema.partial().extend({
  active: z.boolean().optional(),
})

export async function getRecurringPayments(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId

  const payments = await prisma.recurringPayment.findMany({
    where: { userId },
    include: { category: true },
    orderBy: { nextDueDate: 'asc' },
  })

  res.json({ data: payments })
}

export async function createRecurringPayment(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const result = createSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const { amount, description, type, categoryId, totalInstallments, nextDueDate } = result.data

  const startDate = new Date(nextDueDate)
  const installments = totalInstallments ?? null

  // Create the recurring payment starting at the first due date (this month)
  const payment = await prisma.recurringPayment.create({
    data: {
      description,
      amount,
      type,
      categoryId,
      userId,
      totalInstallments: installments,
      paidInstallments: 0,
      nextDueDate: startDate,
      active: true,
    },
    include: { category: true },
  })

  // Charge only the current installment now. The rest are scheduled: the
  // cron job (cron.ts) picks them up one by one as nextDueDate is reached.
  await prisma.transaction.create({
    data: {
      amount,
      description: installments ? `${description} (cuota 1/${installments})` : description,
      type,
      date: startDate,
      userId,
      categoryId,
      recurringPaymentId: payment.id,
    },
  })

  const isCompleted = installments !== null && installments <= 1
  const nextDate = new Date(startDate)
  nextDate.setMonth(nextDate.getMonth() + 1)

  const updatedPayment = await prisma.recurringPayment.update({
    where: { id: payment.id },
    data: {
      paidInstallments: 1,
      nextDueDate: nextDate,
      active: !isCompleted,
    },
    include: { category: true },
  })

  res.status(201).json({ data: updatedPayment })
}

export async function updateRecurringPayment(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const { id } = req.params
  const result = updateSchema.safeParse(req.body)

  if (!result.success) {
    res.status(400).json({ error: result.error.errors[0].message })
    return
  }

  const existing = await prisma.recurringPayment.findFirst({ where: { id, userId } })
  if (!existing) {
    res.status(404).json({ error: 'Pago recurrente no encontrado' })
    return
  }

  const { nextDueDate, ...rest } = result.data

  const payment = await prisma.recurringPayment.update({
    where: { id },
    data: {
      ...rest,
      ...(nextDueDate && { nextDueDate: new Date(nextDueDate) }),
    },
    include: { category: true },
  })

  // Sync the change onto the most recently generated transaction for this
  // recurring payment (e.g. if the category or amount was corrected).
  const lastTransaction = await prisma.transaction.findFirst({
    where: { recurringPaymentId: id },
    orderBy: { date: 'desc' },
  })

  if (lastTransaction && (rest.amount || rest.description || rest.type || rest.categoryId)) {
    await prisma.transaction.update({
      where: { id: lastTransaction.id },
      data: {
        ...(rest.amount !== undefined && { amount: rest.amount }),
        ...(rest.type !== undefined && { type: rest.type }),
        ...(rest.categoryId !== undefined && { categoryId: rest.categoryId }),
      },
    })
  }

  res.json({ data: payment })
}

export async function deleteRecurringPayment(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user!.userId
  const { id } = req.params

  const existing = await prisma.recurringPayment.findFirst({ where: { id, userId } })
  if (!existing) {
    res.status(404).json({ error: 'Pago recurrente no encontrado' })
    return
  }

  await prisma.recurringPayment.delete({ where: { id } })
  res.status(204).send()
}