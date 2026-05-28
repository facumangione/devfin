import { useTransactionStore } from '../../store/transaction.store'
import { TransactionFilters, TransactionType } from '../../types/transaction.types'
import { cn } from '../../lib/utils'

interface Props {
  onFilterChange: (filters: TransactionFilters) => void
}

export default function TransactionFiltersBar({ onFilterChange }: Props) {
  const { filters, categories } = useTransactionStore()

  const handleTypeChange = (type: TransactionType | undefined) => {
    const newFilters = { ...filters, type, page: 1 }
    onFilterChange(newFilters)
  }

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = { ...filters, categoryId: categoryId || undefined, page: 1 }
    onFilterChange(newFilters)
  }

  const handleDateChange = (field: 'from' | 'to', value: string) => {
    const newFilters = {
      ...filters,
      [field]: value ? new Date(value).toISOString() : undefined,
      page: 1,
    }
    onFilterChange(newFilters)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Type filter */}
      <div className="flex rounded-lg overflow-hidden border border-slate-700 text-xs">
        {([undefined, 'EXPENSE', 'INCOME'] as const).map((type) => (
          <button
            key={type ?? 'all'}
            onClick={() => handleTypeChange(type)}
            className={cn(
              'px-3 py-1.5 font-medium transition-colors',
              filters.type === type
                ? 'bg-slate-700 text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            {type === undefined ? 'All' : type === 'EXPENSE' ? '↓ Expenses' : '↑ Income'}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <select
        value={filters.categoryId ?? ''}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/50"
      >
        <option value="">All categories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.icon} {cat.name}
          </option>
        ))}
      </select>

      {/* Date range */}
      <input
        type="date"
        onChange={(e) => handleDateChange('from', e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/50"
      />
      <span className="text-slate-500 text-xs">to</span>
      <input
        type="date"
        onChange={(e) => handleDateChange('to', e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/50"
      />
    </div>
  )
}
