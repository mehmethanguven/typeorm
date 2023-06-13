/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import { User } from '../entities/User'
import { generateRefreshToken, generateToken } from '../utils/functions'
import { validateLoginData, validateRegister } from '../utils/validation'
import { JwtPayload } from 'jsonwebtoken'
import jwt from 'jsonwebtoken'
import { db } from '../db'

export const refresh = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh } = req.body
    console.log('refresh', refresh)
    try {
      //verify
      const decoded = jwt.verify(
        refresh,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        process.env.JWT_SECRET!,
      ) as JwtPayload

      // Get user from the token
      const user = await db
        .getRepository(User)
        .findOne({ where: { id: parseInt(decoded.id) } })
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        res.status(201).json({
          accessToken: generateToken(user.id),
          refreshToken: generateRefreshToken(user.id),
        })
      } else {
        const error = new Error('user not found')
        res.status(404)
        return next(error)
      }
    } catch (err) {
      console.log('err', err)
      const error = new Error('internal error')
      res.status(500)
      return next(error)
    }
  },
)

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = validateRegister(req.body)
    if (validation.error) {
      const err = new Error('invalid user data provided')
      res.status(400)
      return next(err)
    }
    const { firstName, lastName, email, password, phoneNumber } = req.body

    // check if user exist
    const existUser = await db.getRepository(User).findOne({ where: { email } })
    if (existUser) {
      const err = new Error('user already exist')
      res.status(409)
      return next(err)
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = User.create({
      first_name: firstName,
      last_name: lastName,
      password: hashedPassword,
      email,
      phone_number: phoneNumber,
    })
    await user.save()
    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.first_name,
        lastname: user.last_name,
        email: user.email,
        imageUrl: user.image_url,
        accessToken: generateToken(user.id),
        refreshToken: generateRefreshToken(user.id),
      })
    } else {
      const err = new Error('internal error')
      res.status(500)
      return next(err)
    }
  },
)

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // console.log('loginUser is called')
    try {
      const validation = validateLoginData(req.body)
      // console.log(validation)
      if (validation.error) {
        const err = new Error('Email or password is incorrect')
        res.status(400)
        return next(err)
      }

      const { email, password } = req.body

      if (!password && !email) {
        const error = new Error('some fields missing')
        res.status(409)
        return next(error)
      }

      let user
      if (email) {
        user = await db.getRepository(User).findOne({
          where: { email },
        })
        // console.log(user)
      }

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const isPasswordValid = bcrypt.compare(password, user.password!)
        if (!isPasswordValid) {
          const error = new Error('Auth error')
          res.status(400)
          return next(error)
        } else {
          res.status(201).json({
            id: user.id,
            name: user.first_name,
            lastname: user.last_name,
            email: user.email,
            imageUrl: user.image_url,
            phoneNumber: user.phone_number,
            token: generateToken(user.id),
            accessToken: generateToken(user.id),
            refreshToken: generateRefreshToken(user.id),
          })
        }
      } else {
        const error = new Error('user not found')
        res.status(400)
        return next(error)
      }
    } catch (err) {
      console.log('err', err)
      const error = new Error('internal error')
      res.status(500)
      return next(error)
    }
  },
)

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token
      if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
      ) {
        //console.log('token', req.headers.authorization)
        try {
          // get token from request headers
          token = req.headers.authorization.split(' ')[1]

          //verify
          const decoded = jwt.verify(
            token,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            process.env.JWT_SECRET!,
          ) as JwtPayload

          // Get user from the token
          const user = await db.getRepository(User).findOne({
            where: { id: parseInt(decoded.id) },
            select: {
              id: true,
              email: true,
              first_name: true,
              last_name: true,
              phone_number: true,
              image_url: true,
            },
          })

          if (user) {
            res.json(user)
          }
        } catch (error) {
          const err = new Error('Not authorized')
          res.status(400)
          return next(err)
        }
      } else {
        const err = 'Invalid credentials - Not Authorized'
        res.status(401)
        return next(err)
      }
    } catch (error) {
      //return next(error)
    }
  },
)
