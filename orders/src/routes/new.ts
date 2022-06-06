import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { 
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError
} from '@jslamela/common';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

// set expiration interval delay
const EXPIRATION_WINDOW_SECONDS = 1 * 60; // 1 MINUTE
router.post(
  '/api/orders', 
  requireAuth, 
  [
    // custom is optional. may not want coupling to mongodb id format
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('+++> orders: /api/orders - create order 0')
    const { ticketId } = req.body;
    const ticket = await Ticket.findById(ticketId);

    console.log('+++> orders: /api/orders - create order 1')
    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    // console.log('---> isReserved:', isReserved);
    if (isReserved) {
      throw new BadRequestError('Ticket not available');
    }

    console.log('+++> orders: /api/orders - create order 2')
    // order expires in 1 minute
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS
    );

    console.log('+++> orders: /api/orders - create order 3')
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });
    console.log('+++> orders: /api/orders - create order 4')
    await order.save();

    console.log('+++> orders: /api/orders - create order 5')
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      version: order.version,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
