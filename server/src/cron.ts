import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function processRecurringPayments() {
  const now = new Date()

  // Keep processing until all past-due installments are caught up
  let processed = 0
  let keepGoing = true

  while (keepGoing) {
    const duePayments = await prisma.recurringPayment.findMany({
      where: {
        active: true,
        nextDueDate: { lte: now },
      },
    })

    if (duePayments.length === 0) {
      keepGoing = false
      break
    }

    console.log(`🔄 Processing ${duePayments.length} due recurring payments...`)

    for (const payment of duePayments) {
      // Check if completed
      if (
        payment.totalInstallments !== null &&
        payment.paidInstallments >= payment.totalInstallments
      ) {
        await prisma.recurringPayment.update({
          where: { id: payment.id },
          data: { active: false },
        })
        console.log(`✅ Completed: ${payment.description}`)
        continue
      }

      const installmentDate = new Date(payment.nextDueDate)
      const newPaid = payment.paidInstallments + 1
      const isCompleted =
        payment.totalInstallments !== null && newPaid >= payment.totalInstallments

      // Create transaction with the exact due date of this installment
      await prisma.transaction.create({
        data: {
          amount: payment.amount,
          description: payment.totalInstallments
            ? `${payment.description} (cuota ${newPaid}/${payment.totalInstallments})`
            : payment.description,
          type: payment.type,
          date: installmentDate,
          userId: payment.userId,
          categoryId: payment.categoryId,
          recurringPaymentId: payment.id,
        },
      })

      // Advance to next month
      const next = new Date(installmentDate)
      next.setMonth(next.getMonth() + 1)

      await prisma.recurringPayment.update({
        where: { id: payment.id },
        data: {
          paidInstallments: newPaid,
          nextDueDate: next,
          active: !isCompleted,
        },
      })

      processed++
      console.log(
        `💸 ${payment.description} — cuota ${newPaid}${payment.totalInstallments ? `/${payment.totalInstallments}` : ''} — fecha: ${installmentDate.toLocaleDateString('es-AR')}`
      )
    }
  }

  console.log(`✅ Done — ${processed} transactions generated`)
  await prisma.$disconnect()
}

processRecurringPayments().catch((e) => {
  console.error('❌ Cron failed:', e)
  prisma.$disconnect()
  process.exit(1)
})