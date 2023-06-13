import express from 'express'
import { isAuth } from '../middleware/auth'
import {
  createTransaction,
  fetchTransactions,
} from '../controller/transaction.controller'

const router = express.Router()

router.post('/api/client/:clientId/transaction', isAuth, createTransaction)
router.get('/api/transactions', isAuth, fetchTransactions)

export default router
