import { Request, Response } from 'express';
import Product from '../models/product';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).send({ items: products, total: products.length });
  } catch (error) {
    res.status(500).send({ message: 'Error getting products' });
  }
};

export const createProduct = (req: Request, res: Response) => {
  const {
    title, image, category, description, price,
  } = req.body;

  // Валидация входных данных
  if (!title || !image.fileName || !image.originalName || !category) {
    return res.send({ message: 'No required fields' });
  }
  return Product.create({
    title, image, category, description, price,
  })
    .then((product) => res.status(201).json(product))
    .catch((error) => res.send({ message: error.message }));
};
