import { useEffect, useState } from 'react'
import { useTransactionStore } from '../../store/transaction.store'
import { Transaction, TransactionFilters } from '../../types/transaction.types'
import TransactionItem from '../../components/transactions/TransactionItem'
import TransactionForm from '../../components/transactions/TransactionForm'
import TransactionFiltersBar from '../../components/transactions/TransactionFilters'

export default function TransactionsPage() {
  const {
    transactions,
    total,
    totalPages,
    currentPage,
    isLoading,
    filters,
    fetchTransactions,
    fetchCategories,
    deleteAllTransactions,
  } = useTransactionStore()

  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isDeletingAll, setIsDeletingAll] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchTransactions()
  }, [])

  const handleFilterChange = (newFilters: TransactionFilters) => {
    fetchTransactions(newFilters)
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  const handlePageChange = (page: number) => {
    fetchTransactions({ ...filters, page })
  }

  const handleDeleteAll = async () => {
    if (total === 0) return
    const confirmed = confirm(
      `¿Borrar las ${total} transacciones? Esta acción no se puede deshacer.`
    )
    if (!confirmed) return

    setIsDeletingAll(true)
    try {
      await deleteAllTransactions()
    } finally {
      setIsDeletingAll(false)
    }
  }

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const params = new URLSearchParams()
      if (filters.type) params.append('type', filters.type)
      if (filters.from) params.append('from', filters.from)
      if (filters.to) params.append('to', filters.to)

      const token = localStorage.getItem('accessToken')
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3001/api'}/export/transactions?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `devfin-transactions-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 pt-2">
        <div>
          <h1 className="text-xl font-semibold text-lavender-800 dark:text-white">Movimientos</h1>
          <p className="text-sm text-lavender-400 dark:text-lavender-200/60 mt-0.5">{total} en total</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting || transactions.length === 0}
            className="glass disabled:opacity-40 disabled:cursor-not-allowed text-lavender-600 dark:text-lavender-200 rounded-xl px-4 py-2 text-sm font-medium transition-colors hover:bg-white/50 dark:hover:bg-white/10"
          >
            {isExporting ? 'Exportando...' : '↓ Exportar CSV'}
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={isDeletingAll || total === 0}
            className="bg-peach-50 hover:bg-peach-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-peach-600 dark:text-rose-300 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          >
            {isDeletingAll ? 'Borrando...' : '🗑️ Borrar todas'}
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl px-4 py-2 text-sm transition-colors"
          >
            + Agregar movimiento
          </button>
        </div>
      </div>

      <div className="mb-4">
        <TransactionFiltersBar onFilterChange={handleFilterChange} />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">💸</p>
            <p className="text-lavender-400 dark:text-lavender-200/70 text-sm">Todavía no hay movimientos</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-lavender-600 dark:text-lavender-200 hover:underline text-sm font-medium"
            >
              Agregar el primero →
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/40 dark:divide-white/5">
            {transactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-gold-500 text-white'
                  : 'text-lavender-400 dark:text-lavender-200/60 hover:text-lavender-700 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
