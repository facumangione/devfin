import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { useStatsStore } from '../../store/stats.store'
import { useTransactionStore } from '../../store/transaction.store'
import TransactionItem from '../../components/transactions/TransactionItem'
import MonthlyChart from '../../components/charts/MonthlyChart'
import CategoryChart from '../../components/charts/CategoryChart'
import DateRangeFilter from '../../components/charts/DateRangeFilter'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { summary, monthly, byCategory, isLoading, fetchStats } = useStatsStore()
  const { transactions, fetchTransactions, fetchCategories } = useTransactionStore()

  useEffect(() => {
    fetchStats()
    fetchCategories()
    fetchTransactions({ limit: 5, page: 1 })
  }, [])

  const cards = [
    { label: 'Balance', value: summary?.balance ?? 0, icon: '⚖️', positive: (summary?.balance ?? 0) >= 0 },
    { label: 'Ingresos', value: summary?.income ?? 0, icon: '↑', positive: true },
    { label: 'Egresos', value: summary?.expenses ?? 0, icon: '↓', positive: false },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <h1 className="text-xl font-semibold text-lavender-800 dark:text-white">
            Hola, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-lavender-400 dark:text-lavender-200/60 mt-0.5">
            {summary?.month ?? 'Este mes'}
          </p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-lavender-400 dark:text-lavender-200/70">{card.label}</p>
              <span className="text-lg">{card.icon}</span>
            </div>
            <p className={`text-2xl font-semibold ${card.positive ? 'text-mint-400 dark:text-emerald-300' : 'text-peach-400 dark:text-rose-300'}`}>
              {isLoading ? '—' : `$${Math.abs(card.value).toLocaleString('es-AR')}`}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-2xl p-5">
          <MonthlyChart data={monthly} />
        </div>
        <div className="glass rounded-2xl p-5">
          <CategoryChart data={byCategory} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-lavender-800 dark:text-white text-sm">Movimientos recientes</h2>
          <Link to="/transactions" className="text-sm text-lavender-400 dark:text-lavender-200 hover:text-lavender-600 dark:hover:text-white transition-colors">
            Ver todos →
          </Link>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">🧾</p>
              <p className="text-lavender-400 dark:text-lavender-200/70 text-sm">Todavía no hay movimientos</p>
              <Link to="/transactions" className="mt-3 inline-block text-lavender-600 dark:text-lavender-200 hover:underline text-sm font-medium">
                Agregar el primero →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/40 dark:divide-white/5">
              {transactions.map((transaction) => (
                <TransactionItem key={transaction.id} transaction={transaction} onEdit={() => {}} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
