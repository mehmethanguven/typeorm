import express from 'express'

import {
  connectBankerToClient,
  createBanker,
  deleteBanker,
  fetchBankerById,
  fetchBankers,
} from '../controller/banker.controller'
import { isAuth } from '../middleware/auth'

const router = express.Router()

router.put(
  '/api/banker/:bankerId/client/:clientId',
  isAuth,
  connectBankerToClient,
)
router.post('/api/banker', isAuth, createBanker)
router.get('/api/bankers/:bankerId', isAuth, fetchBankerById)
router.get('/api/bankers', isAuth, fetchBankers)
router.delete('/api/bankers/:bankerId', isAuth, deleteBanker)

export default router
