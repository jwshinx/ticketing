import express, { Request, Response } from 'express';
// import { Ticket } from '../models/ticket';
// import { NotFoundError } from '@jslamela/common';

const router = express.Router();

router.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
  res.send({})
});

export { router as deleteOrderRouter };
