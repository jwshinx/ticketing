import { Subjects, Publisher, PaymentCreatedEvent } from '@jslamela/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
