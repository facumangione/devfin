import { create } from 'zustand'
import { api } from '../lib/api'

interface MonthlyData {
  month: string
  income: number
  expenses: number
  balance: number
}

interface CategoryData {
  name: string
  icon: string
  color: string
  total: number
}

interface Summary {
  income: number
  expenses: number
  balance: number
  month: string
}

interface StatsState {
  monthly: MonthlyData[]
  byCategory: CategoryData[]
  summary: Summary | null
  isLoading: boolean
  fetchStats: (from?: string, to?: string) => Promise<void>
}

export const useStatsStore = create<StatsState>((set) => ({
  monthly: [],
  byCategory: [],
  summary: null,
  isLoading: false,

  fetchStats: async (from, to) => {
    set({ isLoading: true })

    try {
      const params = new URLSearchParams()
      if (from) params.append('from', from)
      if (to) params.append('to', to)
      const query = params.toString() ? `?${params.toString()}` : ''

      const [monthlyRes, categoryRes, summaryRes] = await Promise.all([
        api.get(`/stats/monthly${query}`),
        api.get(`/stats/by-category${query}`),
        api.get(`/stats/summary${query}`),
      ])

      set({
        monthly: monthlyRes.data.data,
        byCategory: categoryRes.data.data,
        summary: summaryRes.data.data,
      })
    } finally {
      set({ isLoading: false })
    }
  },
}))
