import express, { Request, Response } from 'express'
import { Client } from '../entities/Client'
import asyncHandler from 'express-async-handler'
import { createQueryBuilder } from 'typeorm'

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
    const clients = await createQueryBuilder('client')
      .select(['client.id', 'client.first_name', 'client.last_name'])
      .from(Client, 'client')
      .leftJoinAndSelect('client.transactions', 'transaction')
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
  },
)
