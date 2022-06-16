import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
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
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', u)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order cancelled event', async () => {
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
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', u)
    .send()
    .expect(204);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
