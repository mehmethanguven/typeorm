import express from 'express'

import {
  createClient,
  deleteClient,
  fetchClientById,
  fetchClients,
} from '../controller/client.controller'
import { isAuth } from '../middleware/auth'

const router = express.Router()

router.post('/api/client', isAuth, createClient)
router.get('/api/clients/:clientId', isAuth, fetchClientById)
router.get('/api/clients', isAuth, fetchClients)
router.delete('/api/clients/:clientId', isAuth, deleteClient)

export default router
