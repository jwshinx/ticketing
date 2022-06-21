import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@jslamela/common'

import { deleteOrderRouter } from './routes/delete'
import { indexOrderRouter } from './routes/index'
import { newOrderRouter } from './routes/new'
import { showOrderRouter } from './routes/show'

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

console.log('+++> orders.index 6/21 1017am 0')
app.use(currentUser)
app.use(newOrderRouter)
app.use(showOrderRouter)
app.use(indexOrderRouter)
app.use(deleteOrderRouter)

// use "all" -- includes get, post, etc.
app.all('*', async (req, res, next) => {
  // next(new NotFoundError())
  console.log('+++> orders.index.ts: route not found')
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }