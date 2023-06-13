import Joi from 'joi'

export const validateLoginData = (login: {
  email: string
  password: string
}) => {
  const loginSchema = Joi.object({
    email: Joi.string().email(),
    password: Joi.string().min(6).max(32).required(),
  })
  return loginSchema.validate(login)
}

export const validateRegister = (userData: {
  email: string
  password: string
  confirmPassword: string
  lastName: string
  firstName: string
  phoneNumber: string
}) => {
  const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(32).required(),
    confirmPassword: Joi.ref('password'),
    lastName: Joi.string(),
    firstName: Joi.string(),
    phoneNumber: Joi.string(),
  })
  return registerSchema.validate(userData)
}
