import { createConnection, DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Client } from './entities/Client'
import { Banker } from './entities/Banker'
import { Transaction } from './entities/Transaction'
import express from 'express'
import { createClientRouter } from './routes/create_client'
import { createBankerRouter } from './routes/create_banker'
import { createTransactionRouter } from './routes/create_transaction'
import { fetchClients } from './routes/fetch_clients'
import { fetchBankers } from './routes/fetch_bankers'
import { fetchBankerById } from './routes/fetch_banker_by_id'
import { fetchClientById } from './routes/fetch_client_by_id'
import { fetchTransactions } from './routes/fetch_transactions'

dotenv.config()

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbDatabase = process.env.DB_DATABASE
const secret = process.env.SECRET
const hostPort = process.env.HOST_PORT

const app = express()
const main = async () => {
  try {
    await createConnection({
      type: 'postgres',
      host: dbHost,
      port: 5433,
      username: dbUser,
      password: dbPassword,
      database: dbDatabase,
      entities: [Client, Banker, Transaction],
      synchronize: true,
    })
    console.log('Connected to postgres database')
    app.use(express.json())
    app.use(createClientRouter)
    app.use(createBankerRouter)
    app.use(createTransactionRouter)
    app.use(fetchClients)
    app.use(fetchBankers)
    app.use(fetchBankerById)
    app.use(fetchClientById)
    app.use(fetchTransactions)

    app.listen(hostPort ?? 4000, () => {
      console.log(`App is running on ${hostPort}`)
    })
  } catch (error) {
    console.log(error)
    throw new Error('Unable to connect to postgres database')
  }
}

main()
