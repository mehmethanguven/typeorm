/* eslint-disable no-console */
import { Request, Response, NextFunction } from 'express'
import asyncHandler from 'express-async-handler'
import { User } from '../entities/User'
// import cloudinary from '../config/cloudinary'
import { db } from '../db'

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await db.getRepository(User).find()
      res.status(200).json({ users })
    } catch (error) {
      const err = new Error('internal error')
      res.status(500)
      return next(err)
    }
  },
)

export const getOneUser = asyncHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    try {
      const user = await db
        .getRepository(User)
        .findOne({ where: { id: parseInt(userId) } })
      if (user) res.status(200).json({ user })
      else {
        const err = new Error('user dont exist')
        res.status(400)
        return next(err)
      }
    } catch (error) {
      const err = new Error('internal error')
      res.status(500)
      return next(err)
    }
  },
)

// export const updateImage = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (!req.file) {
//         const error = new Error('No image provided')
//         res.status(400)
//         return next(error)
//       }
//       const resCloud = await cloudinary.uploader.upload(req.file.path, {
//         cloud_name: process.env.CLOUDINARY_NAME,
//         api_key: process.env.CLOUDINARY_API_KEY,
//         api_secret: process.env.CLOUDINARY_API_SECRET,
//       })
//       const userId = req.user?.id
//       const user = await User.findById(userId)
//       if (user) {
//         user.imageUrl = resCloud.secure_url
//         user.cloudinary_id = resCloud.public_id
//         await user.save()

//         res.status(201).json({
//           _id: user._id,
//           name: user.name,
//           lastname: user.lastname,
//           email: user.email,
//           username: user.username,
//           imageUrl: user.imageUrl,
//           token: generateToken(user._id),
//           accessToken: generateToken(user._id),
//         })
//       }
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       const error = new Error(err)
//       res.status(500)
//       return next(error)
//     }
//   },
// )

// export const updateUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params
//     const {
//       name,
//       lastname,
//       email,
//       username,
//       password,
//       password2,
//       currentpassword,
//     } = req.body
//     if (!id) {
//       const error = new Error('user invalid')
//       res.status(400)
//       return next(error)
//     }
//     const user = await User.findById(id)
//     if (user) {
//       const passwordMatched = await bcrypt.compare(
//         currentpassword,
//         // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//         user.password!,
//       )
//       if (!passwordMatched) {
//         const error = new Error('invalid current password')
//         res.status(400)
//         return next(error)
//       }
//       if (password && password2 && password !== password2) {
//         const error = new Error('new password validation error')
//         res.status(400)
//         return next(error)
//       }
//       const hashedNewPassword =
//         password === password2
//           ? await bcrypt.hash(password, await bcrypt.genSalt(10))
//           : user.password
//       const updatedUser = await User.updateOne(user._id, {
//         name: name || user.name,
//         lastname: lastname || user.lastname,
//         email: email || user.email,
//         username: username || user.username,
//         password: hashedNewPassword,
//       })
//       res.status(201).json(updatedUser)
//     } else {
//       const error = new Error(`User wthi id ${id} not found`)
//       res.status(400)
//       return next(error)
//     }
//   },
// )
