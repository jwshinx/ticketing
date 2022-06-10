import express, { Request, Response } from 'express';
import { Ticket } from '../models/ticket';
// import { NotFoundError } from '@jslamela/common';

const router = express.Router();

router.get('/api/tickets', async (req: Request, res: Response) => {
  // list out only tickets which havent been purchased
  const tickets = await Ticket.find({
    orderId: undefined
  });

  res.send(tickets);
});

export { router as indexTicketRouter };
