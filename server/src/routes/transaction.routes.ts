import { Router } from 'express'
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transaction.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/', getTransactions)
router.get('/:id', getTransaction)
router.post('/', createTransaction)
router.patch('/:id', updateTransaction)
router.delete('/:id', deleteTransaction)

export default router
