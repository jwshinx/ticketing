import { Publisher, Subjects, TicketUpdatedEvent } from '@jslamela/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  // ts, this way, doesnt allow us to change subject
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
