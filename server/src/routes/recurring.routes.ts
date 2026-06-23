import { Router } from 'express'
import {
  getRecurringPayments,
  createRecurringPayment,
  updateRecurringPayment,
  deleteRecurringPayment,
} from '../controllers/recurring.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/', getRecurringPayments)
router.post('/', createRecurringPayment)
router.patch('/:id', updateRecurringPayment)
router.delete('/:id', deleteRecurringPayment)

export default router
