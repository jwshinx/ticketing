import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketUpdatedEvent } from '@jslamela/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    // const ticket = await Ticket.findByPreviousEvent(data);
    // const ticket = await Ticket.findById(data.id);
    console.log('xxx orders TicketUpdatedListener onMsg 0')
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1
    });

    console.log('xxx orders TicketUpdatedListener onMsg 1')
    if (!ticket) {
      console.log('xxx orders TicketUpdatedListener onMsg 2')
      throw new Error('xxx ticket not found xxx');
    }
    const { title, price, version } = data;
    ticket.set({ title, price, version });
    await ticket.save();
    console.log('xxx orders TicketUpdatedListener onMsg 3')
    msg.ack();
  }
}
