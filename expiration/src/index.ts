// import express from 'express'
// import 'express-async-errors'
// import { json } from 'body-parser'
// import cookieSession from 'cookie-session'
// import { errorHandler, NotFoundError, currentUser } from '@jslamela/common'

import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listener'

// const app = express()
// app.set('trust proxy', true)
// app.use(json())
// app.use(
//   cookieSession({
//     signed: false,
//     secure: true
//   })
// )

// app.use(currentUser)

// // use "all" -- includes get, post, etc.
// app.all('*', async (req, res, next) => {
//   // next(new NotFoundError())
//   console.log('+++> tickets.index.ts: route not found')
//   throw new NotFoundError()
// })

// app.use(errorHandler)

const start = async () => {
  console.log('+++> expiration 6/25 345pm')
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
  }

  try {
    // see nats-depl: (1) cid 'ticketing'
    // (2) nats-srv
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    )
    natsWrapper.client.on('close', () => {
      console.log('>>> nats connection closed!!')
      process.exit()
    })
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch(err) {
    console.log(err)
  }
}

start()