import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST
  }
});

// process a job after defined x time lapses
expirationQueue.process(async (job) => {
  console.log(
    '+++> expiration: publishing expiration:complete event orderId:',
    job.data.orderId
  )
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId
  })
});

export { expirationQueue };
