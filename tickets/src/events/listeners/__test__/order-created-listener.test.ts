import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@jslamela/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);
  const ticket = Ticket.build({
    title: 'play',
    price: 80,
    userId: 'ssss'
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'sdfsdf',
    expiresAt: 'wggweg',
    ticket: {
      id: ticket.id,
      price: ticket.price
    }
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { listener, ticket, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessage(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);
  
  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket update event', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  // // @ts-ignore
  // console.log(natsWrapper.client.publish.mock.calls);
  // // @ts-ignore
  // console.log(natsWrapper.client.publish.mock.calls[0][1]);

  // better way to get typescript to be ok
  const jsonPayload = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(jsonPayload.orderId);
});
