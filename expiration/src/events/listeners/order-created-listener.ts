import { Listener, OrderCreatedEvent, Subjects } from '@jslamela/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log("wait milliseconds to process job:", delay);

    // create new job and queue it up
    await expirationQueue.add({
      orderId: data.id
    },
    {
      delay, // add delay before we receive job from expiration-queue.ts
    });

    msg.ack();
  }
}