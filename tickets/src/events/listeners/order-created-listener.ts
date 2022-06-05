import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@jslamela/common";
import { queueGroupName } from './queue-group-name'
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated
  queueGroupName = queueGroupName

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    console.log('+++> tickets:order-created-listener 0')
    const ticket = await Ticket.findById(data.ticket.id);

    console.log('+++> tickets:order-created-listener 1 ticket:', ticket)
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: data.id });
    await ticket.save();
    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      title: ticket.title,
      userId: ticket.userId,
      orderId: ticket.orderId,
      version: ticket.version,
    })

    msg.ack();
  }
}