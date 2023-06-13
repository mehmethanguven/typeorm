/* eslint-disable @typescript-eslint/no-non-null-assertion */
import jwt from 'jsonwebtoken'

export const generateToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '1d',
  })
}

export const generateRefreshToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: '14d',
  })
}
