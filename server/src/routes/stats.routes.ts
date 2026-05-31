import { Router } from 'express'
import { getMonthlyStats, getCategoryStats, getSummary } from '../controllers/stats.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.use(authenticate)

router.get('/monthly', getMonthlyStats)
router.get('/by-category', getCategoryStats)
router.get('/summary', getSummary)

export default router
