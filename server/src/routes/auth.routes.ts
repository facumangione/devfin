import { Router } from 'express'
import {
  register,
  login,
  refresh,
  logout,
  me,
  updateProfile,
  updatePassword,
  updateEmailPreferences,
} from '../controllers/auth.controller'
import { authenticate } from '../middleware/auth.middleware'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.get('/me', authenticate, me)
router.patch('/profile', authenticate, updateProfile)
router.patch('/password', authenticate, updatePassword)
router.patch('/email-preferences', authenticate, updateEmailPreferences)

export default router