import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';
import { setOriginalNode } from 'typescript';
import { natsWrapper } from '../../nats-wrapper';

it('returns 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'acdc',
      price: 150
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'acdc',
      price: 150
    })
    .expect(401);
});

xit('returns a 401 if the user does not own the ticket', async () => {
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'aha',
      price: 50
    });

  // update as different user, call again global.signin
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'kldsfjs',
      price: 44
    })
    .expect(401);
});

xit('returns a 400 if the user provides an invalid title or price', async () => {
  const userCookie = global.signin();
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({
      title: 'sdkjhfj',
      price: 500
    });

  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: '',
      price: 44
    })
    .expect(400);
  
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: 'sdfsdfsdf',
      price: -33
    })
    .expect(400);
});

xit('updates ticket when valid inputs provided', async () => {
  const userCookie = global.signin();
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({
      title: 'dddddd',
      price: 80
    });

  const newTitle = 'new title';
  const newPrice = 100;
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: newTitle,
      price: newPrice
    })
    .expect(200);

  const ticketResp = await request(app)
    .get(`/api/tickets/${resp.body.id}`)
    .send()
    .expect(200);
  
  // console.log("+++> 2", ticketResp.body);
  expect(ticketResp.body.title).toEqual(newTitle);
  expect(ticketResp.body.price).toEqual(newPrice);
});

xit('publishes an event', async () => {
  const userCookie = global.signin();
  const resp = await request(app)
    .post('/api/tickets')
    .set('Cookie', userCookie)
    .send({
      title: 'dddddd',
      price: 80
    });

  const newTitle = 'new title';
  const newPrice = 100;
  await request(app)
    .put(`/api/tickets/${resp.body.id}`)
    .set('Cookie', userCookie)
    .send({
      title: newTitle,
      price: newPrice
    })
    .expect(200);
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

// xit('retricts update of reserved ticket', async () => {
//   const userCookie = global.signin();
//   const resp = await request(app)
//     .post('/api/tickets')
//     .set('Cookie', userCookie)
//     .send({
//       title: 'dddddd',
//       price: 80
//     });

//   const ticket = await Ticket.findById(resp.body.id);
//   ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
//   await ticket!.save();

//   await request(app)
//     .put(`/api/tickets/${resp.body.id}`)
//     .set('Cookie', userCookie)
//     .send({
//       title: 'new title',
//       price: 900
//     })
//     .expect(400);
// });
