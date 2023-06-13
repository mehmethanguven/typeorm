import express from 'express'

import {
  createClient,
  deleteClient,
  fetchClientById,
  fetchClients,
} from '../controller/client.controller'

const router = express.Router()

router.post('/api/client', createClient)
router.get('/api/clients/:clientId', fetchClientById)
router.get('/api/clients', fetchClients)
router.delete('/api/clients/:clientId', deleteClient)

export default router
