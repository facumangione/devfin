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
    fetchTransactions,
    fetchCategories,
  } = useTransactionStore()

  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)

  useEffect(() => {
    fetchCategories()
    fetchTransactions()
  }, [])

  const handleFilterChange = (filters: TransactionFilters) => {
    fetchTransactions(filters)
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
    fetchTransactions({ page })
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Transactions</h1>
          <p className="text-sm text-slate-400 mt-0.5">{total} total</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-400 text-slate-950 font-semibold rounded-lg px-4 py-2 text-sm transition-colors"
        >
          + Add transaction
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <TransactionFiltersBar onFilterChange={handleFilterChange} />
      </div>

      {/* List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">💸</p>
            <p className="text-slate-400 text-sm">No transactions yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-green-400 hover:text-green-300 text-sm font-medium"
            >
              Add your first one
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-green-500 text-slate-950'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onClose={handleCloseForm}
        />
      )}
    </div>
  )
}
