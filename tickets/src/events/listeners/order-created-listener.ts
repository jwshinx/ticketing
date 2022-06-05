import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@jslamela/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from './queue-group-name'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    
  }
}