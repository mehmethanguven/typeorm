import express from 'express'
import { createQueryBuilder } from 'typeorm'
import { Banker } from '../entities/Banker'

const router = express.Router()

router.get('/api/bankers', async (req, res) => {
  const bankers = await createQueryBuilder('banker')
    .select(['banker_id', 'banker.first_name', 'banker.last_name'])
    .from(Banker, 'banker')
    .getMany()
  return res.json(bankers)
})

export { router as fetchBankers }
