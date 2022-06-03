import nats from 'node-nats-streaming';
// import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});

// @ts-ignore
stan.on('connect', async () => {
  console.log('Publisher connected to nats');

  // nats can only process strings
  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => {
    console.log('+++> event published. data:', data);
  });

});
