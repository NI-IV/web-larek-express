import { Request, Response, NextFunction } from 'express';
import { isCelebrateError } from 'celebrate';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from "../errors/internal-server-error";

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

  if (err instanceof BadRequestError || err instanceof NotFoundError || err instanceof ConflictError || err instanceof InternalServerError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  return res.status(500).send({ message: 'Internal Server Error' });
};

export default errorHandler;