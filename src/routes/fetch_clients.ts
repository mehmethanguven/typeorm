import express from 'express'
import { createQueryBuilder } from 'typeorm'
import { Client } from '../entities/Client'

const router = express.Router()

router.get('/api/clients', async (req, res) => {
  const clients = await createQueryBuilder('client')
    .select(['client.id', 'client.first_name', 'client.last_name'])
    .from(Client, 'client')
    .leftJoinAndSelect('client.transactions', 'transaction')
    .getMany()
  return res.json(clients)
})

export { router as fetchClients }
