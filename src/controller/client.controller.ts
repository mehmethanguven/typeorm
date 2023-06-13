import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import asyncHandler from 'express-async-handler'
import { db } from '../db'

export const createClient = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
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
  },
)

export const fetchClients = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const clients = await db
      .getRepository(Client)
      .createQueryBuilder()
      .select([
        'client.id',
        'client.first_name',
        'client.last_name',
        'client.is_active',
      ])
      .from(Client, 'client')
      .leftJoinAndSelect('client.transactions', 'transaction')
      .where('client.is_active')
      .getMany()
    return res.json(clients)
  },
)

export const fetchClientById = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { clientId } = req.params
      console.log(clientId)
      if (!clientId) {
        return res.json('client id not found').status(400)
      }

      const client = await db.getRepository(Client).findOne({
        where: { id: parseInt(clientId) },
        relations: ['transactions'],
      })

      if (!client) {
        return res.json({ msg: 'client not found' }).status(404)
      }
      return res.json(client)
    } catch (error) {
      return res.json(error).status(500)
    }
  },
)

export const deleteClient = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { clientId } = req.params

      if (!clientId) {
        return res.json('client id not found').status(400)
      }

      const client = await db
        .getRepository(Client)
        .findOne({ where: { id: parseInt(clientId) } })

      // if want to delete
      // const resDelete = await Client.delete(parseInt(clientId));

      if (!client) {
        return res.json({ msg: 'client not found' }).status(404)
      }
      client.is_active = false
      await client.save()
      return res.json({ msg: 'Client is deleted successfully' })
    } catch (error) {
      return res.json(error).status(500)
    }
  },
)
