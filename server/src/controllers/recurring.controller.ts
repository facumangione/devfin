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

  // Calculate final nextDueDate (after all installments if finite, or same date if indefinite)
  let finalNextDueDate = new Date(startDate)
  if (installments) {
    finalNextDueDate = new Date(startDate)
    finalNextDueDate.setMonth(finalNextDueDate.getMonth() + installments)
  }

  // Create the recurring payment record
  const payment = await prisma.recurringPayment.create({
    data: {
      description,
      amount,
      type,
      categoryId,
      userId,
      totalInstallments: installments,
      paidInstallments: installments ?? 0,
      nextDueDate: finalNextDueDate,
      active: installments ? false : true, // if finite, mark as completed; if indefinite, keep active
    },
    include: { category: true },
  })

  // Generate all transactions immediately
  const transactionsToCreate = []
  const count = installments ?? 1 // for indefinite, create 1 future transaction

  for (let i = 0; i < count; i++) {
    const txDate = new Date(startDate)
    txDate.setMonth(txDate.getMonth() + i)

    transactionsToCreate.push({
      amount,
      description: installments
        ? `${description} (cuota ${i + 1}/${installments})`
        : description,
      type,
      date: txDate,
      userId,
      categoryId,
    })
  }

  await prisma.transaction.createMany({ data: transactionsToCreate })

  res.status(201).json({ data: payment })
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