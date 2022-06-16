import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
// import { Order, OrderStatus } from '../../models/order';

it('fetches an order', async () => {
  const t = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'play',
    price: 30
  });
  await t.save();

  const u = global.signin();
  
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', u)
    .send({ ticketId: t.id })
    .expect(201);

  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', u)
    .send()
    .expect(200);

  // console.log('+++> o.userId:', o.userId);
  // console.log('+++> fetchedOrder.userId:', fetchedOrder.userId);
  // console.log('+++> resp.body.userId:', resp.body[0].userId);
  expect(fetchedOrder.id).toEqual(order.id);
  expect(fetchedOrder.userId).toEqual(order.userId);
});

it('returns \'not authorized\' error when fetching another user\'s order', async () => {
  const t = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'play',
    price: 30
  });
  await t.save();

  const u1 = global.signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', u1)
    .send({ ticketId: t.id })
    .expect(201);

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', global.signin())
    .send()
    .expect(401);
});
