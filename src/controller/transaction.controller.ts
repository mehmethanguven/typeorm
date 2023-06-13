import { Request, Response } from 'express'
import { Transaction, TransactionType } from '../entities/Transaction'
import asyncHandler from 'express-async-handler'
import { db } from '../db'
import { Client } from '../entities/Client'

export const createTransaction = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { clientId } = req.params

      const { type, amount } = req.body

      const client = await db.getRepository(Client).findOne({
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
    } catch (error) {
      return res.json({ msg: 'Error' }).status(500)
    }
  },
)

export const fetchTransactions = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const transactions = await db
        .getRepository(Transaction)
        .createQueryBuilder()
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
    } catch (error) {
      return res.json({ msg: 'Error' }).status(500)
    }
  },
)
