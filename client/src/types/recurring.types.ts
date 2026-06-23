export interface RecurringPayment {
  id: string
  description: string
  amount: string
  type: 'INCOME' | 'EXPENSE'
  totalInstallments: number | null
  paidInstallments: number
  nextDueDate: string
  active: boolean
  createdAt: string
  categoryId: string
  userId: string
  category: {
    id: string
    name: string
    icon: string
    color: string
    type: string
  }
}

export interface CreateRecurringInput {
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  categoryId: string
  totalInstallments?: number | null
  nextDueDate: string
}
