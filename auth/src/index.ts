import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@jslamela/common'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
)

app.use(currentUserRouter)
app.use(signinRouter)
app.use(signupRouter)
app.use(signoutRouter)

// use "all" -- includes get, post, etc.
app.all('*', async (req, res, next) => {
  // next(new NotFoundError())
  throw new NotFoundError()
})

app.use(errorHandler)

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
  }

  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('connected to auth mongodb')
  } catch(err) {
    console.log(err)
  }
  app.listen(3000, () => {
    console.log('listening on port 3000!!!')
  })
}

start()