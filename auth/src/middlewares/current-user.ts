import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// lets define another property to Express::Request
//   may be defined, not so when not logged in, so set optional with "?"
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // if (!req.session || !req.session.jwt) {
  if (!req.session?.jwt) {
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    req.currentUser = payload;
  } catch (err) {
    // nothing is fine
  }
  next();
};