import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@jslamela/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // const ticket = await Ticket.findByPreviousEvent(data);
    const ticket = await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error('xxx ticket not found xxx');
    }
    const { title, price, version } = data;
    ticket.set({ title, price, version });
    await ticket.save();
    msg.ack();
  }
}
