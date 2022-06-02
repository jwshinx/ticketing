import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { requireAuth, validateRequest } from '@jslamela/common'

const router = express.Router()

router.post(
  '/app/tickets',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('price must be greate than 0')
  ],
  validateRequest,
  (req: Request, res: Response) => {
  res.sendStatus(200)
})

export { router as createTicketRouter }
