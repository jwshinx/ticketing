import express from 'express'
import { currentUser } from '../middlewares/current-user'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
  // send proper payload or null, not undefined
  res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
