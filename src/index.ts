import dotenv from 'dotenv'
import express from 'express'
import bankerRouter from './routes/banker.routes'
import clientRouter from './routes/client.routes'
import transactionRouter from './routes/transaction.routes'
import { db } from './db'
dotenv.config()

const hostPort = process.env.HOST_PORT

const app = express()
const main = async () => {
  try {
    db.initialize()
      .then(() => {
        console.log(`Data Source has been initialized`)
      })
      .catch((err: any) => {
        console.error(`Data Source initialization error`, err)
      })

    console.log('Connected to postgres database')
    app.use(express.json())
    app.use(clientRouter)
    app.use(transactionRouter)
    app.use(bankerRouter)

    app.listen(hostPort ?? 4000, () => {
      console.log(`App is running on ${hostPort}`)
    })
  } catch (error) {
    console.log(error)
    throw new Error('Unable to connect to postgres database')
  }
}

main()
