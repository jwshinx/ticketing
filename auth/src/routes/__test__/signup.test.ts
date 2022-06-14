import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
});

it('returns a 400 with an invalid email', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'wfwefwefwef',
      password: 'password'
    })
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({
      email: 'aaa@aaa.com',
      password: 'e'
    })
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({ email: 'sdf@sdf.com' })
    .expect(400);
  await request(app)
    .post('/api/users/signup')
    .send({ password: 'sdfsdfsdf' })
    .expect(400);
});

it('disallows duplicate signup emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'aaa@aaa.com',
      password: 'aaaaaa'   
    })
    .expect(201)
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'aaa@aaa.com',
      password: 'aaaaaa'   
    })
    .expect(400)
});

it('sets a cookie after successful signup', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'aaa@aaa.com',
      password: 'aaaaaa'   
    })
    .expect(201)
  // console.log("+++> res:", res);
  expect(res.get('Set-Cookie')).toBeDefined();
});
