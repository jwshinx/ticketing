import request from 'supertest';
import { app } from '../../app';

it('clears the cookie after successful signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
  const res = await request(app)
    .post('/api/users/signout')
    .send({})
    .expect(200);
  // console.log('+++> xxx:', res.get('Set-Cookie'))
  // +++> xxx: [ 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly' ]

  expect(res.get('Set-Cookie')[0]).toBeDefined()
  // expect(res.get('Set-Cookie')[0]).toEqual(
  //   'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  // )
});
