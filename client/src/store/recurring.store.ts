import { create } from 'zustand'
import { api } from '../lib/api'
import { RecurringPayment, CreateRecurringInput } from '../types/recurring.types'

interface RecurringState {
  payments: RecurringPayment[]
  isLoading: boolean
  isSubmitting: boolean
  fetchPayments: () => Promise<void>
  createPayment: (data: CreateRecurringInput) => Promise<void>
  updatePayment: (id: string, data: Partial<CreateRecurringInput & { active: boolean }>) => Promise<void>
  deletePayment: (id: string) => Promise<void>
}

export const useRecurringStore = create<RecurringState>((set, get) => ({
  payments: [],
  isLoading: false,
  isSubmitting: false,

  fetchPayments: async () => {
    set({ isLoading: true })
    try {
      const { data } = await api.get('/recurring')
      set({ payments: data.data })
    } finally {
      set({ isLoading: false })
    }
  },

  createPayment: async (input) => {
    set({ isSubmitting: true })
    try {
      await api.post('/recurring', input)
      await get().fetchPayments()
    } finally {
      set({ isSubmitting: false })
    }
  },

  updatePayment: async (id, input) => {
    set({ isSubmitting: true })
    try {
      await api.patch(`/recurring/${id}`, input)
      await get().fetchPayments()
    } finally {
      set({ isSubmitting: false })
    }
  },

  deletePayment: async (id) => {
    await api.delete(`/recurring/${id}`)
    set((state) => ({ payments: state.payments.filter((p) => p.id !== id) }))
  },
}))