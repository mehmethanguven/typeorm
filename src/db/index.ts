import { DataSource, createConnection } from 'typeorm'

// Using environment variables
import dotenv from 'dotenv'
import { Banker } from '../entities/Banker'
import { Client } from '../entities/Client'
import { Transaction } from '../entities/Transaction'
dotenv.config()

const dbHost = process.env.DB_HOST
const dbPort = process.env.DB_PORT
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD
const dbDatabase = process.env.DB_DATABASE

dotenv.config()

// const connectDB = new DataSource({
//   type: 'postgres',
//   host: dbHost,
//   port: 5433,
//   username: dbUser,
//   password: dbPassword,
//   database: dbDatabase,
//   entities: [Client, Banker, Transaction],
//   synchronize: true,
//   // url: process.env.DATABASE_URI,
//   logging: false,
//   // extra: {
//   //   ssl: {
//   //     rejectUnauthorized: false,
//   //   },
//   // },
// })

// connectDB
//   .initialize()
//   .then(() => {
//     console.log(`Data Source has been initialized`)
//   })
//   .catch((err) => {
//     console.error(`Data Source initialization error`, err)
//   })

export const db = new DataSource({
  type: 'postgres',
  host: dbHost,
  port: 5433,
  username: dbUser,
  password: dbPassword,
  database: dbDatabase,
  entities: [Client, Banker, Transaction],
  synchronize: true,
})
