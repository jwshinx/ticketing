import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderStatus, ExpirationCompleteEvent } from '@jslamela/common';

import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';
import { Order } from '../../../models/order';

const makeTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'recital',
    price: 10,
  });
  
  await ticket.save();
  return ticket;
};

const makeCreatedOrderAndTicket = async () => {
  const ticket = await makeTicket();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'sdfsdfs',
    expiresAt: new Date(),
    ticket
  });
  await order.save();
  return { ticket, order};
};

const makeCompleteOrderAndTicket  = async () => {
  const ticket = await makeTicket();

  const order = Order.build({
    status: OrderStatus.Complete,
    userId: 'sdfsdfs',
    expiresAt: new Date(),
    ticket
  });
  await order.save();
  return { ticket, order};
};

const createdOrderSetup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const { ticket, order } = await makeCreatedOrderAndTicket();
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, ticket, data, msg };
};

const completeOrderSetup = async () => {
  const listener = new ExpirationCompleteListener(natsWrapper.client);
  const { ticket, order } = await makeCompleteOrderAndTicket();
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, order, ticket, data, msg };
};

it('does not update order status to cancelled when already complete', async () => {
  const { listener, order, data, msg } = await completeOrderSetup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Complete);
});

it('updates the order status to cancelled', async () => {
  const { listener, order, data, msg } = await createdOrderSetup();
  await listener.onMessage(data, msg);
  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
  const { listener, order, data, msg } = await createdOrderSetup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);
});

it('ack the message', async () => {
  const { listener, data, msg } = await createdOrderSetup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
