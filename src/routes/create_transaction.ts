import express from 'express'
import { Client } from '../entities/Client'
import { Transaction, TransactionType } from '../entities/Transaction'

const router = express.Router()

router.post('/api/client/:clientId/transaction', async (req, res) => {
  const { clientId } = req.params

  const { type, amount } = req.body

  const client = await Client.findOne({
    where: { id: parseInt(clientId) },
    relations: ['transactions'],
  })

  if (!client) {
    return res.json({
      msg: 'client not found',
    })
  }

  const transaction = Transaction.create({
    amount,
    type,
    client,
  })

  console.log('client.transactions', client.transactions)
  if (!client.transactions) {
    client.transactions = []
  }
  client.transactions.push(transaction)
  await transaction.save()
  if (type === TransactionType.DEPOSIT) {
    client.balance = +client.balance + parseInt(amount)
  } else if (type === TransactionType.WITHDRAW) {
    client.balance = client.balance - amount
  }

  await client.save()

  return res.json(client)
})

export { router as createTransactionRouter }
