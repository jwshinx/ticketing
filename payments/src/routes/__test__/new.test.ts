import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { OrderStatus } from '@jslamela/common';
// import { natsWrapper } from '../../nats-wrapper';

// more realistic test - supposed to hit stripe endpoint, but jest hijacks it here
import { stripe } from '../../stripe';
// jest.mock('../../stripe');

import { Payment } from '../../models/payment';

it('returns a 404 when purchasing an order that does not exist', async () => {
  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asldkfj',
      orderId: new mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin())
    .send({
      token: 'asldkfj',
      orderId: order.id,
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'asdlkfj',
    })
    .expect(400);
});

it('returns a 204 with valid inputs', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000)
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created,
  });
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', global.signin(userId))
    .send({
      orderId: order.id,
      token: 'tok_visa',
    })
    .expect(201);

  // const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]
  // expect(chargeOptions.source).toEqual('tok_visa')
  // expect(chargeOptions.amount).toEqual(20 * 100)
  // expect(chargeOptions.currency).toEqual('usd')

  const stripeCharges = await stripe.charges.list({ limit: 50 })
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price * 100
  })
  expect(stripeCharge).toBeDefined()
});

// it('with valid inputs; returns a 201, creates a payment and publishes payment completed event', async () => {
//   const userId = mongoose.Types.ObjectId().toHexString();
//   // create a random and likely unique value for check against fetch lookup
//   const price = Math.floor(Math.random() * 100000);
//   const order = Order.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     userId,
//     version: 0,
//     price,
//     status: OrderStatus.Created,
//   });
//   await order.save();

//   // mocked. does not hit stripe endpoint
//   await request(app)
//     .post('/api/payments')
//     .set('Cookie', global.signin(userId))
//     .send({
//       token: 'tok_visa',
//       orderId: order.id,
//     })
//     .expect(201);

//   // 50, just in case we run tests in parallel
//   const stripeCharges = await stripe.charges.list({ limit: 50 });
//   const stripeCharge = stripeCharges.data.find((charge) => {
//     return charge.amount === price * 100;
//   });

//   expect(stripeCharge).toBeDefined();
//   expect(stripeCharge!.currency).toEqual('usd');

//   const payment = await Payment.findOne({
//     orderId: order.id,
//     stripeId: stripeCharge!.id,
//   });
//   expect(payment).not.toBeNull();
//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
