import { Publisher, Subjects, TicketCreatedEvent } from '@jslamela/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  // ts, this way, doesnt allow us to change subject
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
