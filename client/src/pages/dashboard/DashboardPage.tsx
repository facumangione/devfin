import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStatsStore } from '../../store/stats.store'
import { useTransactionStore } from '../../store/transaction.store'
import TransactionItem from '../../components/transactions/TransactionItem'
import MonthlyChart from '../../components/charts/MonthlyChart'
import CategoryChart from '../../components/charts/CategoryChart'
import DateRangeFilter from '../../components/charts/DateRangeFilter'

export default function DashboardPage() {
  const { summary, monthly, byCategory, isLoading, fetchStats } = useStatsStore()
  const { transactions, fetchTransactions, fetchCategories } = useTransactionStore()

  useEffect(() => {
    fetchStats()
    fetchCategories()
    fetchTransactions({ limit: 5, page: 1 })
  }, [])

  const cards = [
    { label: 'Balance', value: summary?.balance ?? 0, positive: (summary?.balance ?? 0) >= 0 },
    { label: 'Ingresos', value: summary?.income ?? 0, positive: true },
    { label: 'Egresos', value: summary?.expenses ?? 0, positive: false },
  ]

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pt-2">
        <div>
          <h1 className="text-xl font-semibold text-lavender-800 dark:text-white">Resumen</h1>
          <p className="text-sm text-lavender-400 dark:text-lavender-200/60 mt-0.5">
            {summary?.month ?? 'Todo el historial'}
          </p>
        </div>
        <DateRangeFilter />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {cards.map((card) => (
          <div key={card.label} className="glass rounded-2xl p-5">
            <p className="text-xs text-lavender-400 dark:text-lavender-200/60 mb-3 uppercase tracking-wide">
              {card.label}
            </p>
            <p className={`text-2xl font-semibold ${
              card.label === 'Balance'
                ? (card.positive ? 'text-lavender-800 dark:text-white' : 'text-lavender-800 dark:text-white')
                : card.positive
                ? 'text-lavender-800 dark:text-white'
                : 'text-lavender-800 dark:text-white'
            }`}>
              {isLoading ? '—' : `$${Math.abs(card.value).toLocaleString('es-AR')}`}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-2xl p-5 overflow-x-auto">
          <MonthlyChart data={monthly} />
        </div>
        <div className="glass rounded-2xl p-5 overflow-x-auto">
          <CategoryChart data={byCategory} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-medium text-lavender-800 dark:text-white text-sm">Movimientos recientes</h2>
          <Link
            to="/transactions"
            className="text-xs text-lavender-400 dark:text-lavender-200/60 hover:text-lavender-800 dark:hover:text-white transition-colors"
          >
            Ver todos →
          </Link>
        </div>

        <div className="glass rounded-2xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lavender-400 dark:text-lavender-200/60 text-sm">Sin movimientos</p>
              <Link
                to="/transactions"
                className="mt-2 inline-block text-lavender-600 dark:text-lavender-200 hover:underline text-xs"
              >
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