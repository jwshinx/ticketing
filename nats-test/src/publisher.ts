import nats from 'node-nats-streaming';
// import { TicketCreatedPublisher } from './events/ticket-created-publisher';

/**
 * important
 * here, in ticketing project, i did not complete publisher implementation. 
 * below is half baked. the work has already been done in boxoffice and moved
 * to @jslamela/common. im moving on
 */

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
