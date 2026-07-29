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
      <div className="flex rounded-xl overflow-hidden glass p-1 gap-1 text-xs">
        {([undefined, 'EXPENSE', 'INCOME'] as const).map((type) => (
          <button
            key={type ?? 'all'}
            onClick={() => handleTypeChange(type)}
            className={cn(
              'px-3 py-1.5 rounded-lg font-medium transition-colors',
              filters.type === type
                ? 'bg-white/70 dark:bg-white/15 text-lavender-800 dark:text-white'
                : 'text-lavender-400 dark:text-lavender-200/60 hover:text-lavender-700 dark:hover:text-white'
            )}
          >
            {type === undefined ? 'Todos' : type === 'EXPENSE' ? '↓ Egresos' : '↑ Ingresos'}
          </button>
        ))}
      </div>

      {/* Category filter */}
      <select
        value={filters.categoryId ?? ''}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="glass rounded-xl px-3 py-1.5 text-lavender-600 dark:text-lavender-200 text-xs focus:outline-none focus:ring-2 focus:ring-lavender-400/40"
      >
        <option value="">Todas las categorías</option>
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
        className="glass rounded-xl px-3 py-1.5 text-lavender-600 dark:text-lavender-200 text-xs focus:outline-none focus:ring-2 focus:ring-lavender-400/40"
      />
      <span className="text-lavender-300 dark:text-lavender-200/50 text-xs">a</span>
      <input
        type="date"
        onChange={(e) => handleDateChange('to', e.target.value)}
        className="glass rounded-xl px-3 py-1.5 text-lavender-600 dark:text-lavender-200 text-xs focus:outline-none focus:ring-2 focus:ring-lavender-400/40"
      />
    </div>
  )
}
