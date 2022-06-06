import express from 'express'
import { currentUser } from '@jslamela/common'

const router = express.Router()

router.get('/api/users/currentuser', currentUser, (req, res) => {
  console.log('+++> auth router.get app/users/currentuser 0')
  // send proper payload or null, not undefined
  res.send({ currentUser: req.currentUser || null })
})

export { router as currentUserRouter }
