import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { faker } from '@faker-js/faker';
import Product from '../models/product';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';
import InternalServerError from '../errors/internal-server-error';

// Валидация Email
const isValidEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

// Валидация телефона
const isValidPhone = (phone: string) => /^\+7\d{10}$/.test(phone);

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const {
    payment, email, phone, address, total, items,
  } = req.body;
  const phoneFormatted: string = phone.replace(/[^\d+]/g, '');

  try {
    if (!['card', 'online'].includes(payment)) {
      return next(new BadRequestError('Invalid payment method'));
    }
    if (!isValidEmail(email)) {
      return next(new BadRequestError('Invalid email'));
    }
    if (!isValidPhone(phoneFormatted)) {
      return next(new BadRequestError(`Invalid phone number ${phoneFormatted}`));
    }
    if (!address) {
      return next(new BadRequestError('Address is required'));
    }
    if (!Array.isArray(items) || items.length === 0) {
      return next(new BadRequestError('Items array is required and cannot be empty'));
    }
    if (typeof total !== 'number' || total <= 0) {
      return next(new BadRequestError('Invalid total amount'));
    }

    const products = await Product.find({ _id: { $in: items } });

    if (products.length !== items.length) {
      return next(new BadRequestError('One or more items do not exist'));
    }

    const productsTotal = products.reduce((sum, product) => {
      if (product.price != null) {
        return sum + product.price;
      }
      return sum;
    }, 0);

    if (productsTotal !== total) {
      return next(new BadRequestError('Total amount does not match sum of items prices'));
    }

    const orderId = faker.string.uuid();

    return res.status(200).send({
      id: orderId,
      total: productsTotal,
    });
  } catch (error) {
    if (error instanceof MongooseError.ValidationError) {
      return next(new BadRequestError(error.message));
    }
    if (error instanceof Error && error.message.includes('E11000')) {
      return next(new ConflictError('Duplicate field value error'));
    }
    return next(new InternalServerError(error instanceof Error ? error.message : 'Unknown error occurred'));
  }
};

export default createOrder;
