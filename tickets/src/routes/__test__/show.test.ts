import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});

xit('returns the ticket if the ticket is found', async () => {
  const title = 'band';
  const price = 200;

  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title, price
    })
    .expect(201);
  
  // console.log("+++> 1", resp.body);
  const ticketResp = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);
  
  // console.log("+++> 2", ticketResp.body);
  expect(ticketResp.body.title).toEqual(title);
  expect(ticketResp.body.price).toEqual(price);
});
