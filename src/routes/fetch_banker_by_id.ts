import express from 'express'
import { createQueryBuilder } from 'typeorm'
import { Banker } from '../entities/Banker'

const router = express.Router()

router.get('/api/bankers/:bankerId', async (req, res) => {
  const { bankerId } = req.params
  const banker = await Banker.findBy({ id: parseInt(bankerId) })
  return res.json(banker)
})

export { router as fetchBankerById }
