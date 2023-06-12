import express from 'express'
import { Client } from '../entities/Client'
import { createQueryBuilder } from 'typeorm'

const router = express.Router()

router.get('/api/clients/:clientId', async (req, res) => {
  try {
    const { clientId } = req.params
    console.log(clientId)
    if (!clientId) {
      return res.json('client id not found').status(400)
    }

    const client = await createQueryBuilder('client')
      .select(['client.id', 'client.first_name', 'client.last_name'])
      .from(Client, 'client')
      .leftJoinAndSelect('client.transactions', 'transaction')
      .where('client.id = :clientId', {
        clientId: parseInt(clientId),
      })
      .getOne()

    if (!client) {
      return res.json({ msg: 'client not found' }).status(404)
    }
    return res.json(client)
  } catch (error) {
    return res.json(error).status(500)
  }
})

export { router as fetchClientById }
