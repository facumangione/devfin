import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/auth.store'
import { useTransactionStore } from '../../store/transaction.store'
import TransactionItem from '../../components/transactions/TransactionItem'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const { transactions, fetchTransactions, fetchCategories } = useTransactionStore()

  useEffect(() => {
    fetchCategories()
    fetchTransactions({ limit: 5, page: 1 })
  }, [])

  const income = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const expenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0)

  const balance = income - expenses

  const cards = [
    {
      label: 'Balance',
      value: balance,
      color: balance >= 0 ? 'text-green-400' : 'text-red-400',
      bg: balance >= 0 ? 'bg-green-500/10' : 'bg-red-500/10',
      icon: '⚖️',
    },
    {
      label: 'Income',
      value: income,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      icon: '↑',
    },
    {
      label: 'Expenses',
      value: expenses,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      icon: '↓',
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-100">
          Good to see you, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Here's your financial summary</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-slate-400">{card.label}</p>
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center text-sm`}>
                {card.icon}
              </div>
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>
              ${Math.abs(card.value).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-100">Recent transactions</h2>
          <Link to="/transactions" className="text-sm text-green-400 hover:text-green-300 transition-colors">
            View all →
          </Link>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-3xl mb-3">💸</p>
              <p className="text-slate-400 text-sm">No transactions yet</p>
              <Link to="/transactions" className="mt-3 inline-block text-green-400 hover:text-green-300 text-sm font-medium">
                Add your first one →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/50">
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
