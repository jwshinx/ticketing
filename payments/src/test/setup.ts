import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
// import request from 'supertest';
import { app } from '../app';
import jwt from 'jsonwebtoken'

declare global {
  // var signin: () => Promise<string[]>
  var signin: (id?: string) => string[]
}

jest.mock('../nats-wrapper')

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'sdkfsdf';

  mongo = new MongoMemoryServer();
  // added per q&a re "incorrect state for operation new" test failure
  await mongo.start()
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

// if id is provided, use that - otherwise autogen
global.signin = (id?: string) => {
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com'
  }
  const token = jwt.sign(payload, process.env.JWT_KEY!)
  const session = { jwt: token }
  const sessionJSON = JSON.stringify(session)
  const base64 = Buffer.from(sessionJSON).toString('base64')
  return [`session=${base64}`]
};
