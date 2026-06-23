import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function processRecurringPayments() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const duePayments = await prisma.recurringPayment.findMany({
    where: {
      active: true,
      nextDueDate: { lte: new Date() },
    },
  })

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

    // Create transaction
    await prisma.transaction.create({
      data: {
        amount: payment.amount,
        description: payment.totalInstallments
          ? `${payment.description} (cuota ${payment.paidInstallments + 1}/${payment.totalInstallments})`
          : payment.description,
        type: payment.type,
        date: new Date(),
        userId: payment.userId,
        categoryId: payment.categoryId,
      },
    })

    // Calculate next due date (add 1 month)
    const next = new Date(payment.nextDueDate)
    next.setMonth(next.getMonth() + 1)

    const newPaid = payment.paidInstallments + 1
    const isCompleted =
      payment.totalInstallments !== null && newPaid >= payment.totalInstallments

    await prisma.recurringPayment.update({
      where: { id: payment.id },
      data: {
        paidInstallments: newPaid,
        nextDueDate: next,
        active: !isCompleted,
      },
    })

    console.log(
      `💸 Generated: ${payment.description} — $${payment.amount} (cuota ${newPaid}${payment.totalInstallments ? `/${payment.totalInstallments}` : ''})`
    )
  }

  console.log('✅ Done')
  await prisma.$disconnect()
}

processRecurringPayments().catch((e) => {
  console.error('❌ Cron failed:', e)
  prisma.$disconnect()
  process.exit(1)
})
