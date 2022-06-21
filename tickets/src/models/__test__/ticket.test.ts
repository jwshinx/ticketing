import { Ticket } from '../ticket';

// 389. test functions cant take both a 'done' callback and return error
it('implements optimistic concurrency control', async () => {
  // create a ticket
  const ticket = Ticket.build({
    title: 'ccr',
    price: 30,
    userId: '234a'
  })

  // save to db
  await ticket.save()

  // fetch ticket twice
  const first = await Ticket.findById(ticket.id);
  const second = await Ticket.findById(ticket.id);

  // make two changes
  first!.set({ price: 40 })
  second!.set({ price: 50 })

  // save first fetched ticket
  await first!.save();


  // save second fetched ticket and get error
  // this doesnt work
  // expect(async () => {
  //   await second!.save();
  // }).toThrow();

  // 389 so workaround
  try {
    await second!.save();
  } catch(err) {
    // see 389
    // return done();
    return
  }
  throw new Error('should not get here')
});

it('increments version on each save', async () => {
  const ticket = Ticket.build({
    title: 'ccr',
    price: 30,
    userId: '234a'
  })

  await ticket.save()
  expect(ticket.version).toEqual(0);
  await ticket.save()
  expect(ticket.version).toEqual(1);
  await ticket.save()
  expect(ticket.version).toEqual(2);
});
