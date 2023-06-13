import express from 'express'

import {
  createTransaction,
  fetchTransactions,
} from '../controller/transaction.controller'

const router = express.Router()

router.post('/api/client/:clientId/transaction', createTransaction)
router.get('/api/transactions', fetchTransactions)

export default router
