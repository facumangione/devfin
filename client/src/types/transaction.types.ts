export type TransactionType = 'INCOME' | 'EXPENSE'
export type CategoryType = 'INCOME' | 'EXPENSE' | 'BOTH'

export interface Category {
  id: string
  name: string
  icon: string
  color: string
  type: CategoryType
}

export interface Transaction {
  id: string
  amount: string
  description: string
  type: TransactionType
  date: string
  categoryId: string
  userId: string
  createdAt: string
  category: Category
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface TransactionFilters {
  page?: number
  limit?: number
  type?: TransactionType
  categoryId?: string
  from?: string
  to?: string
}

export interface CreateTransactionInput {
  amount: number
  description: string
  type: TransactionType
  date: string
  categoryId: string
}
