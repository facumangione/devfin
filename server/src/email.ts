import { Resend } from 'resend'
import { PrismaClient } from '@prisma/client'

const resend = new Resend(process.env.RESEND_API_KEY)
const prisma = new PrismaClient()

async function sendWeeklyReport() {
  const now0 = new Date()
  const today = now0.getDay() // 0=domingo, 1=lunes ... 6=sábado
  console.log(`🕐 Corriendo a las ${now0.toISOString()} (UTC) — día calculado: ${today} (0=domingo, 1=lunes...)`)

  const users = await prisma.user.findMany({
    where: { weeklyEmailEnabled: true, weeklyEmailDay: today },
    select: { id: true, name: true, email: true },
  })

  console.log(`👥 Usuarios que matchean weeklyEmailDay=${today}: ${users.length}`)
  if (users.length === 0) {
    console.log('ℹ️ Nadie tiene el resumen activado para el día de hoy. Nada para enviar.')
  }

  const now = new Date()
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  weekAgo.setHours(0, 0, 0, 0)
  now.setHours(23, 59, 59, 999)

  let sent = 0
  let failed = 0

  for (const user of users) {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: user.id,
        status: 'confirmed',
        date: { gte: weekAgo, lte: now },
      },
      select: { amount: true, type: true },
    })

    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

    const expenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)

    const balance = income - expenses

    try {
      const { data, error } = await resend.emails.send({
        from: 'DevFin <onboarding@resend.dev>',
        to: user.email,
        subject: '📊 Tu resumen semanal — DevFin',
        html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f5f0fc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #3a3550; font-size: 22px; margin: 0;">Hola, ${user.name.split(' ')[0]} 👋</h1>
            <p style="color: #8a84a3; font-size: 14px; margin-top: 8px;">Tu resumen de la última semana</p>
          </div>

          <div style="display: grid; gap: 12px; margin-bottom: 24px;">
            <div style="background: white; border-radius: 12px; padding: 16px; text-align: center;">
              <p style="color: #8a84a3; font-size: 12px; margin: 0 0 4px;">Balance</p>
              <p style="color: ${balance >= 0 ? '#4d9b7a' : '#d97a6c'}; font-size: 24px; font-weight: 600; margin: 0;">
                $${Math.abs(balance).toLocaleString('es-AR')}
              </p>
            </div>
            <div style="display: flex; gap: 12px;">
              <div style="flex: 1; background: white; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="color: #8a84a3; font-size: 12px; margin: 0 0 4px;">↑ Ingresos</p>
                <p style="color: #4d9b7a; font-size: 18px; font-weight: 600; margin: 0;">$${income.toLocaleString('es-AR')}</p>
              </div>
              <div style="flex: 1; background: white; border-radius: 12px; padding: 16px; text-align: center;">
                <p style="color: #8a84a3; font-size: 12px; margin: 0 0 4px;">↓ Egresos</p>
                <p style="color: #d97a6c; font-size: 18px; font-weight: 600; margin: 0;">$${expenses.toLocaleString('es-AR')}</p>
              </div>
            </div>
          </div>

          <div style="text-align: center;">
            <a href="https://devfin.vercel.app" style="background: #a78bd8; color: white; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 14px;">
              Ver mi wallet →
            </a>
          </div>

          <p style="color: #c4bcd8; font-size: 11px; text-align: center; margin-top: 24px;">
            DevFin · Registro de Wallet
          </p>
        </div>
      `,
      })

      if (error) {
        failed++
        console.error(`❌ Resend rechazó el envío a ${user.email}:`, error)
        continue
      }

      sent++
      console.log(`📧 Email enviado a ${user.email} (id: ${data?.id})`)
    } catch (err) {
      failed++
      console.error(`❌ Error inesperado enviando a ${user.email}:`, err)
    }
  }

  await prisma.$disconnect()
  console.log(`✅ Terminado — ${sent} enviados, ${failed} fallidos`)
}

sendWeeklyReport().catch((e) => {
  console.error('❌ Error:', e)
  prisma.$disconnect()
  process.exit(1)
})