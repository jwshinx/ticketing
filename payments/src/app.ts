import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@jslamela/common'
import { createChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(json())

let secureValue = false
if (process.env.JOEL_ENVIRONMENT === 'development') {
  secureValue = true
}
console.log('+++> payment app.ts 6/22 1100am process.env.NODE_ENV:', process.env.NODE_ENV)
console.log('+++> payment app.ts 6/22 1100am JOEL_ENVIRONMENT:', process.env.JOEL_ENVIRONMENT)
console.log('+++> payment app.ts 6/22 1100am secureValue:', secureValue)

app.use(
  cookieSession({
    signed: false,
    secure: secureValue
    // secure: false
    // secure: process.env.NODE_ENV !== 'test',
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
