import { create } from 'zustand'
import { api } from '../lib/api'
import {
  Transaction,
  Category,
  TransactionFilters,
  CreateTransactionInput,
  PaginatedResponse,
} from '../types/transaction.types'

interface TransactionState {
  transactions: Transaction[]
  categories: Category[]
  total: number
  totalPages: number
  currentPage: number
  isLoading: boolean
  isSubmitting: boolean
  filters: TransactionFilters
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>
  fetchCategories: () => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  updateTransaction: (id: string, data: Partial<CreateTransactionInput>) => Promise<void>
  deleteTransaction: (id: string) => Promise<void>
  setFilters: (filters: TransactionFilters) => void
}

export const useTransactionStore = create<TransactionState>((set, get) => ({
  transactions: [],
  categories: [],
  total: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  isSubmitting: false,
  filters: { page: 1, limit: 20 },

  fetchTransactions: async (filters) => {
    const activeFilters = filters ?? get().filters
    set({ isLoading: true, filters: activeFilters })

    try {
      const params = new URLSearchParams()
      Object.entries(activeFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value))
        }
      })

      const { data } = await api.get<PaginatedResponse<Transaction>>(
        `/transactions?${params.toString()}`
      )

      set({
        transactions: data.data,
        total: data.meta.total,
        totalPages: data.meta.totalPages,
        currentPage: data.meta.page,
      })
    } finally {
      set({ isLoading: false })
    }
  },

  fetchCategories: async () => {
    const { data } = await api.get<{ data: Category[] }>('/categories')
    set({ categories: data.data })
  },

  createTransaction: async (input) => {
    set({ isSubmitting: true })
    try {
      await api.post('/transactions', input)
      await get().fetchTransactions()
    } finally {
      set({ isSubmitting: false })
    }
  },

  updateTransaction: async (id, input) => {
    set({ isSubmitting: true })
    try {
      await api.patch(`/transactions/${id}`, input)
      await get().fetchTransactions()
    } finally {
      set({ isSubmitting: false })
    }
  },

  deleteTransaction: async (id) => {
    await api.delete(`/transactions/${id}`)
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
      total: state.total - 1,
    }))
  },

  setFilters: (filters) => {
    set({ filters })
  },
}))
