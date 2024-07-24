import { Request, Response, NextFunction } from 'express';
import Product from '../models/product';
import InternalServerError from '../errors/internal-server-error';
import BadRequestError from '../errors/bad-request-error';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({});
    res.status(200).send({ items: products, total: products.length });
  } catch (error) {
    // res.status(500).send({ message: 'Error getting products' });
    next(new InternalServerError(error instanceof Error ? error.message : 'Error getting products'));
  }
};

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const {
    title, image, category, description, price,
  } = req.body;

  // Валидация входных данных
  if (!title || !image.fileName || !image.originalName || !category) {
    return next(new BadRequestError('No required fields'));
  }
  return Product.create({
    title, image, category, description, price,
  })
    .then((product) => res.status(201).json(product))
    .catch((error) => {
      next(new BadRequestError(error instanceof Error ? error.message : 'The product was not created'));
    });
};
