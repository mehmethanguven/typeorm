import express from 'express'

import {
  connectBankerToClient,
  createBanker,
  fetchBankerById,
  fetchBankers,
} from '../controller/banker.controller'

const router = express.Router()

router.put('/api/banker/:bankerId/client/:clientId', connectBankerToClient)
router.post('/api/banker', createBanker)
router.get('/api/bankers/:bankerId', fetchBankerById)
router.get('/api/bankers', fetchBankers)

export default router
