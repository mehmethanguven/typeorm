import { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Banker } from '../entities/Banker'
import asyncHandler from 'express-async-handler'
import { db } from '../db'

export const connectBankerToClient = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { bankerId, clientId } = req.params

      const banker = await db.getRepository(Banker).findOne({
        where: { id: parseInt(bankerId) },
        relations: ['clients'],
      })
      const client = await db
        .getRepository(Client)
        .findOne({ where: { id: parseInt(clientId) } })

      if (!banker || !client) {
        return res.json({ msg: 'Banker or Client not found' })
      }
      const isExists = await banker.clients.some(
        (client) => client.id === client.id,
      )
      if (isExists) {
        return res.json({
          msg: 'Client is already existed in Banker portfolio',
        })
      } else {
        banker.clients = [...banker.clients, client]
        await banker.save()

        return res.json(banker)
      }
    } catch (error) {
      return res.json(error).status(500)
    }
  },
)

export const createBanker = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { firstName, lastName, email, cardNumber, employeeNumber } = req.body
    try {
      const banker = db.getRepository(Banker).create({
        first_name: firstName,
        last_name: lastName,
        email: email,
        card_number: cardNumber,
        employee_number: employeeNumber,
      })
      await banker.save()
      return res.json(banker)
    } catch (error) {
      console.log(error)
      return res.json(500)
    }
  },
)

export const fetchBankers = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const bankers = await db
        .getRepository(Banker)
        .createQueryBuilder()
        .select([
          'banker.id',
          'banker.first_name',
          'banker.last_name',
          'banker.is_active',
        ])
        .from(Banker, 'banker')
        .where('banker.is_active')
        .getMany()
      return res.json(bankers)
    } catch (error) {
      return res.json({ msg: 'error' }).status(500)
    }
  },
)

export const fetchBankerById = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { bankerId } = req.params
      if (!bankerId) {
        return res.json({ msg: 'invalid' })
      }
      const banker = await db.getRepository(Banker).findOne({
        where: { id: parseInt(bankerId) },
      })
      return res.json(banker)
    } catch (error) {
      return res.json(error).status(500)
    }
  },
)

export const deleteBanker = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    const { bankerId } = req.params
    if (!bankerId) {
      return res.json({ msg: 'invalid' })
    }
    const banker = await db.getRepository(Banker).findOne({
      where: { id: parseInt(bankerId) },
      relations: ['clients'],
    })
    if (!banker) {
      return res.json({ msg: 'not found' })
    }
    if (banker.clients.length > 0) {
      return res.json({
        msg: 'banker has clients in order to delete the banker, its clients need to transfer to an active banker',
      })
    }
    banker.is_active = false
    return res.json({ msg: 'item deleted successfully' })
  },
)
