import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@jslamela/common'
import { createChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(json())
// let secureValue = false
// if (process.env.NODE_ENV === 'development') {
//   secureValue = true
// }

app.use(
  cookieSession({
    signed: false,
    // secure: secureValue
    secure: false
  })
)

app.use(currentUser)
app.use(createChargeRouter)

// use "all" -- includes get, post, etc.
app.all('*', async (req, res, next) => {
  // next(new NotFoundError())
  console.log('+++> tickets.index.ts: route not found')
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }
