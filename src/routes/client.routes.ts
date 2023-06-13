import express from 'express'

import {
  createClient,
  fetchClientById,
  fetchClients,
} from '../controller/client.controller'

const router = express.Router()

router.post('/api/client', createClient)
router.get('/api/clients/:clientId', fetchClientById)
router.get('/api/clients', fetchClients)

export default router
