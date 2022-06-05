import express, { Request, Response } from 'express';
// import { Ticket } from '../models/ticket';
// import { NotFoundError } from '@jslamela/common';

const router = express.Router();

router.get('/api/orders', async (req: Request, res: Response) => {
  // list out only tickets which havent been purchased
  // const tickets = await Ticket.find({
  //   orderId: undefined
  // });
  // const tickets = await Ticket.find({})

  // res.send(tickets);
  res.send({})
});

export { router as indexOrderRouter };
