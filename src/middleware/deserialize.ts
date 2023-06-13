/* eslint-disable no-console */
import asyncHandler from 'express-async-handler'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../entities/User'
import { db } from '../db'

type JwtPayload = {
  id: string
}

export const deserializeUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //console.log('token', req.headers.authorization)
      try {
        // get token from request headers
        token = req.headers.authorization.split(' ')[1]
        console.log('refresh token', token)

        //verify
        const decoded = jwt.verify(
          token,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          process.env.JWT_SECRET!,
        ) as JwtPayload

        // Get user from the token
        const user = await db.getRepository(User).findOne({
          where: { id: parseInt(decoded.id) },
        })

        res.locals.user = user
        next()
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
  },
)

export default deserializeUser
