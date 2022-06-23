import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@jslamela/common'

import { createTicketRouter } from './routes/new'
import { showTicketRouter } from './routes/show'
import { indexTicketRouter } from './routes/index'
import { updateTicketRouter } from './routes/update'

const app = express()
app.set('trust proxy', true)
app.use(json())

let secureValue = false
if (process.env.JOEL_ENVIRONMENT === 'development') {
  secureValue = true
}

console.log('+++> tickets app.ts 6/23 1138am process.env.NODE_ENV:', process.env.NODE_ENV)
console.log('+++> tickets app.ts 6/23 1138am JOEL_ENVIRONMENT:', process.env.JOEL_ENVIRONMENT)
console.log('+++> tickets app.ts 6/23 1138am secureValue:', secureValue)

app.use(
  cookieSession({
    signed: false,
    secure: secureValue
    // secure: false
    // secure: process.env.NODE_ENV !== 'test',
  })
)

app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

// use "all" -- includes get, post, etc.
app.all('*', async (req, res, next) => {
  // next(new NotFoundError())
  console.log('+++> tickets.app.ts: route not found')
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }