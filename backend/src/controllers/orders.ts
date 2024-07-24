import { Request, Response } from 'express';
import { faker } from '@faker-js/faker';
import Product from '../models/product';

// Валидация Email
const isValidEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Валидация телефона
const isValidPhone = (phone: string) => /^\+7\d{10}$/.test(phone);

export const createOrder = async (req: Request, res: Response) => {
  const { payment, email, phone, address, total, items } = req.body;

  //Валидация входных данных
  if (!['card', 'online'].includes(payment)) {
    return res.status(400).json({ error: 'Invalid payment method' });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }
  if (!isValidPhone(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Items array is required and cannot be empty' });
  }
  if (typeof total !== 'number' || total <= 0) {
    return res.status(400).json({ error: 'Invalid total amount' });
  }

  try {
    const products = await Product.find({ '_id': { $in: items } });

    if (products.length !== items.length) {
      return res.status(400).send({error: 'Invalid items'});
    }

    const productsTotal = products.reduce((sum, product) => {
      if (product.price != null) {
        return sum + product.price;
      }
      return sum;
    }, 0);

    if (productsTotal !== total) {
      return res.status(400).send({ error: 'Total amount does not match sum of items prices' });
    }

    const orderId = faker.string.uuid();

    res.status(201).send({
      id: orderId,
      total: productsTotal
    })

  } catch (err) {
    return res.status(500).send({ error: err });
  }
};
