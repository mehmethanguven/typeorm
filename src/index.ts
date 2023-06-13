import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import path from 'path'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes'
import bankerRouter from './routes/banker.routes'
import clientRouter from './routes/client.routes'
import transactionRouter from './routes/transaction.routes'
import { db } from './db'
import errors from './middleware/error.middleware'
// import deserializeUser from './middleware/deserialize'

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

    app.use(cors())
    app.use(cookieParser())
    app.use(express.json())
    // app.use(deserializeUser)
    app.use(express.urlencoded({ extended: false }))
    app.use(authRouter)
    app.use(clientRouter)
    app.use(transactionRouter)
    app.use(bankerRouter)

    app.use(morgan('dev'))
    app.use('/images', express.static(path.join(__dirname, 'images')))

    app.use(errors.internalError)
    app.use(errors.notFoundError)

    app.listen(hostPort ?? 4000, () => {
      console.log(`App is running on ${hostPort}`)
    })
  } catch (error) {
    console.log(error)
    throw new Error('Unable to connect to postgres database')
  }
}

main()
