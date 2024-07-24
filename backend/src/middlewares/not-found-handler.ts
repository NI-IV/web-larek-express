import { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/not-found-error';

const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new NotFoundError('Route not found');
  next(error);
};

export default notFoundHandler;