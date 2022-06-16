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
app.use(
  cookieSession({
    signed: false,
    secure: true
  })
)
console.log('+++> tickets.index 0')
app.use(currentUser)
console.log('+++> tickets.index 1')
app.use(createTicketRouter)
console.log('+++> tickets.index 2')
app.use(showTicketRouter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)
console.log('+++> tickets.index 3')

// use "all" -- includes get, post, etc.
app.all('*', async (req, res, next) => {
  // next(new NotFoundError())
  console.log('+++> tickets.index.ts: route not found')
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }