import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'play',
    price: 30
  });
  await ticket.save();
  return ticket;
}

it('fetches for a particular user', async () => {
  const t1 = await buildTicket();
  const t2 = await buildTicket();
  const t3 = await buildTicket();

  const u1 = global.signin();
  const u2 = global.signin();

  await request(app)
    .post('/api/orders')
    .set('Cookie', u1)
    .send({ ticketId: t1.id })
    .expect(201);
  
  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', u2)
    .send({ ticketId: t2.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', u2)
    .send({ ticketId: t3.id })
    .expect(201);

  const resp = await request(app)
    .get('/api/orders')
    .set('Cookie', u2)
    .expect(200);

  // console.log('+++> o1:', o1);
  // console.log('+++> resp:', resp.body);
  expect(resp.body.length).toEqual(2);
  expect(resp.body[0].id).toEqual(order1.id);
  expect(resp.body[1].id).toEqual(order2.id);
  expect(resp.body[0].ticket.id).toEqual(t2.id);
  expect(resp.body[1].ticket.id).toEqual(t3.id);
});

// it('returns an error if the ticket does not exist', async () => {
//   const ticketId = mongoose.Types.ObjectId();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId })
//     .expect(404);
// });

// it('returns an error if the ticket is already reserved', async () => {
//   const ticket = Ticket.build({
//     title: 'rem',
//     price: 100
//   });

//   await ticket.save();
//   const order = Order.build({
//     ticket,
//     userId: 'sdfsdfsdf',
//     status: OrderStatus.Created,
//     expiresAt: new Date()
//   });

//   await order.save();
//   const isReserved = await ticket.isReserved();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(400);
// });

// it.todo('emits and order created event');
