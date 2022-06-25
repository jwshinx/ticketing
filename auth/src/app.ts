import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'

import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError } from '@jslamela/common'

import { currentUserRouter } from './routes/current-user'
import { signinRouter } from './routes/signin'
import { signoutRouter } from './routes/signout'
import { signupRouter } from './routes/signup'

const app = express()
app.set('trust proxy', true)
app.use(json())

// secure value...
//   local test: false
//   ci/cd test: ???
//   prod: false
//   dev: true

let secureValue = false
if (process.env.NODE_ENV === 'development') {
  secureValue = true
}
console.log('+++> auth app.ts 6/25 1120am process.env.NODE_ENV:', process.env.NODE_ENV)
console.log('+++> auth app.ts 6/25 1120am JOEL_ENVIRONMENT:', process.env.JOEL_ENVIRONMENT)
console.log('+++> auth app.ts 6/25 1120am secureValue:', secureValue)

app.use(
  cookieSession({
    signed: false,
    secure: secureValue
    // secure: false
    // secure: process.env.NODE_ENV !== 'test',
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

export { app }