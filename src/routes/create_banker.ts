import express from 'express'
import { Banker } from '../entities/Banker'

const router = express.Router()

router.post('/api/banker', async (req, res) => {
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
})

export { router as createBankerRouter }
