import { useState } from 'react'
import { useStatsStore } from '../../store/stats.store'

export default function DateRangeFilter() {
  const { fetchStats } = useStatsStore()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const handleApply = () => {
    const fromISO = from ? new Date(from).toISOString() : undefined
    const toISO = to ? new Date(to + 'T23:59:59').toISOString() : undefined
    fetchStats(fromISO, toISO)
  }

  const handleClear = () => {
    setFrom('')
    setTo('')
    fetchStats()
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => setFrom(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/50"
      />
      <span className="text-slate-500 text-xs">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-green-500/50"
      />
      <button
        onClick={handleApply}
        disabled={!from && !to}
        className="bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-semibold rounded-lg px-3 py-1.5 text-xs transition-colors"
      >
        Apply
      </button>
      {(from || to) && (
        <button
          onClick={handleClear}
          className="text-slate-400 hover:text-slate-200 text-xs transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  )
}
