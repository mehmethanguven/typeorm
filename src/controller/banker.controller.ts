import express, { Request, Response } from 'express'
import { Client } from '../entities/Client'
import { Banker } from '../entities/Banker'
import asyncHandler from 'express-async-handler'
import { createQueryBuilder } from 'typeorm'

export const connectBankerToClient = asyncHandler(
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { bankerId, clientId } = req.params

      const banker = await Banker.findOne({
        where: { id: parseInt(bankerId) },
        relations: ['clients'],
      })
      const client = await Client.findOne({ where: { id: parseInt(clientId) } })

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
      const banker = Banker.create({
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
      const bankers = await createQueryBuilder('banker')
        .select(['banker.id', 'banker.first_name', 'banker.last_name'])
        .from(Banker, 'banker')
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
      const banker = await Banker.findOne({
        where: { id: parseInt(bankerId) },
        relations: ['clients'],
      })
      return res.json(banker)
    } catch (error) {
      return res
        .json({ msg: 'An error occured while fetchBankerById ' })
        .status(500)
    }
  },
)
