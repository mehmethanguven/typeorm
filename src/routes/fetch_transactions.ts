import express from 'express'
import { createQueryBuilder } from 'typeorm'
import { Transaction } from '../entities/Transaction'

const router = express.Router()

router.get('/api/transactions', async (req, res) => {
  const transactions = await createQueryBuilder('transaction')
    .select([
      'transaction.id',
      'transaction.type',
      'transaction.amount',
      'transaction.created_at',
      'transaction.client',
    ])
    .from(Transaction, 'transaction')
    .leftJoinAndSelect('transaction.client', 'client')
    .select(['transaction', 'client.email'])
    //.leftJoinAndSelect('transaction.transactions', 'transaction')
    .getMany()
  return res.json(transactions)
})

export { router as fetchTransactions }
