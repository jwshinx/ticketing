import nats, { Message } from 'node-nats-streaming';
// import { randomBytes } from 'crypto'
import uniqid from 'uniqid';
// import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear();

const clientid = uniqid();
// var uniqid = require('uniqid');
const stan = nats.connect('ticketing', clientid, {
  url: 'http://localhost:4222',
});

// @ts-ignore
stan.on('connect', () => {
  console.log('Listener connected to nats');

  // @ts-ignore
  stan.on('close', () => {
    console.log('nats connection closed!');
    // @ts-ignore
    process.exit();
  });
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)

  const subscription = stan.subscribe(
    'ticket:created',
    'fooListenerQueueGroup',
    options
  )

  // @ts-ignore
  subscription.on('message', (msg: Message) => {
    const data = msg.getData()
    if (typeof data === 'string') {
      console.log(`received event #${msg.getSequence()}, data: ${data}`)  
    }
    // console.log('message received')
    msg.ack()
  })

  // new TicketCreatedListener(stan).listen();
});

// @ts-ignore
process.on('SIGINT', () => stan.close()); // interrupt
// @ts-ignore
process.on('SIGTERM', () => stan.close()); // terminate
