import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@jslamela/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('xxx order not found xxx');
    }

    // TODO: order-updated-event may be needed. order, by its nature
    // only gets created then completed. just two state. so "version"
    // isnt important. however there may be a future use case where 
    // orders may need updating
    // (see lecture titled "marking an order as complete")
    order.set({
      status: OrderStatus.Complete,
    });
    await order.save();

    msg.ack();
  }
}
