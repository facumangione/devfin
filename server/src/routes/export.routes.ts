import { Router } from 'express'
import { exportTransactions } from '../controllers/export.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate)
router.get('/transactions', exportTransactions)

export default router
