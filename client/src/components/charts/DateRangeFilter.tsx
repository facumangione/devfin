import { useState } from 'react'
import { useStatsStore } from '../../store/stats.store'
import { cn } from '../../lib/utils'

type Preset = 'this_month' | 'last_3' | 'last_6' | 'this_year' | 'all' | 'custom'

const presets: { label: string; value: Preset }[] = [
  { label: 'Este mes', value: 'this_month' },
  { label: '3 meses', value: 'last_3' },
  { label: '6 meses', value: 'last_6' },
  { label: 'Este año', value: 'this_year' },
  { label: 'Todo', value: 'all' },
  { label: 'Custom', value: 'custom' },
]

function getRange(preset: Preset): { from?: string; to?: string } {
  const now = new Date()
  const to = new Date(now)
  to.setHours(23, 59, 59, 999)

  switch (preset) {
    case 'this_month': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1)
      return { from: from.toISOString(), to: to.toISOString() }
    }
    case 'last_3': {
      const from = new Date(now)
      from.setMonth(from.getMonth() - 2)
      from.setDate(1)
      return { from: from.toISOString(), to: to.toISOString() }
    }
    case 'last_6': {
      const from = new Date(now)
      from.setMonth(from.getMonth() - 5)
      from.setDate(1)
      return { from: from.toISOString(), to: to.toISOString() }
    }
    case 'this_year': {
      const from = new Date(now.getFullYear(), 0, 1)
      return { from: from.toISOString(), to: to.toISOString() }
    }
    case 'all':
      return {}
    default:
      return {}
  }
}

export default function DateRangeFilter() {
  const { fetchStats } = useStatsStore()
  const [active, setActive] = useState<Preset>('all')
  const [showCustom, setShowCustom] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const handlePreset = (preset: Preset) => {
    setActive(preset)
    if (preset === 'custom') {
      setShowCustom(true)
      return
    }
    setShowCustom(false)
    const range = getRange(preset)
    fetchStats(range.from, range.to)
  }

  const handleApply = () => {
    const fromISO = from ? new Date(from).toISOString() : undefined
    const toISO = to ? new Date(to + 'T23:59:59').toISOString() : undefined
    fetchStats(fromISO, toISO)
  }

  const handleClear = () => {
    setFrom('')
    setTo('')
    setActive('all')
    setShowCustom(false)
    fetchStats()
  }

  return (
    <div className="flex flex-col gap-2 items-end">
      {/* Preset buttons */}
      <div className="flex items-center gap-1 glass rounded-xl p-1">
        {presets.map((p) => (
          <button
            key={p.value}
            onClick={() => handlePreset(p.value)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              active === p.value
                ? 'bg-lavender-400 text-white'
                : 'text-lavender-400 dark:text-lavender-200/70 hover:bg-white/30 dark:hover:bg-white/10'
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Custom date inputs */}
      {showCustom && (
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="glass rounded-lg px-3 py-1.5 text-lavender-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-lavender-400/40"
          />
          <span className="text-lavender-400 dark:text-lavender-200/70 text-xs">a</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="glass rounded-lg px-3 py-1.5 text-lavender-800 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-lavender-400/40"
          />
          <button
            onClick={handleApply}
            disabled={!from && !to}
            className="bg-lavender-400 hover:bg-lavender-600 disabled:opacity-40 text-white font-semibold rounded-lg px-3 py-1.5 text-xs transition-colors"
          >
            Aplicar
          </button>
          <button
            onClick={handleClear}
            className="text-lavender-400 dark:text-lavender-200/70 hover:text-lavender-700 dark:hover:text-white text-xs transition-colors"
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  )
}