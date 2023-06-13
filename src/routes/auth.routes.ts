import express from 'express'
import {
  getCurrentUser,
  login,
  refresh,
  register,
} from '../controller/auth.controller'

const router = express.Router()

router.post('/api/auth/register', register)
router.post('/api/auth/login', login)
router.post('/api/auth/refresh', refresh)
router.get('/api/auth/me', getCurrentUser)

export default router
