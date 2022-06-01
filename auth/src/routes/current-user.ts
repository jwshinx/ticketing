import express from 'express'
import { requireAuth } from '../middlewares/require-auth'

import { currentUser } from '../middlewares/current-user'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res) => {
  // send proper payload or null, not undefined
  res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
