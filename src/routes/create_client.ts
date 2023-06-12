import express from 'express'
import { Client } from '../entities/Client'

const router = express.Router()

router.post('/api/client', async (req, res) => {
  const { firstName, lastName, email, cardNumber, balance } = req.body

  try {
    const client = Client.create({
      first_name: firstName,
      last_name: lastName,
      email: email,
      card_number: cardNumber,
      balance: balance,
    })
    await client.save()
    return res.json(client)
  } catch (error) {
    return res.json(error.detail).status(500)
  }
})

export { router as createClientRouter }
