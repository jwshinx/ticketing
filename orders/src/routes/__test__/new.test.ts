import request from 'supertest';
import { app } from '../../app';
// import mongoose, { Mongoose } from 'mongoose';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  // const ticketId = mongoose.Types.ObjectId();
  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'rem',
    price: 100
  });

  await ticket.save();
  const order = Order.build({
    ticket,
    userId: 'sdfsdfsdf',
    status: OrderStatus.Created,
    expiresAt: new Date()
  });

  await order.save();
  // const isReserved = await ticket.isReserved();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it('reserves a ticket', async () => {
  // Order.count({}).exec((err, count) => {
  //   console.log("xxx aaa ticket count 0:", count);
  // });

  // console.log("+++> order count 0.1:", Order.count.length);
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'pssfsdsdgsdgb',
    price: 40
  });

  await ticket.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

it.todo('emits and order created event')

// xit('emits and order created event', async () => { 
//   const ticket = Ticket.build({
//     id: mongoose.Types.ObjectId().toHexString(),
//     title: 'pssfsdsdgsdgb',
//     price: 40
//   });

//   await ticket.save();

//   await request(app)
//     .post('/api/orders')
//     .set('Cookie', global.signin())
//     .send({ ticketId: ticket.id })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });