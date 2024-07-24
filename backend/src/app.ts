import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import { errors } from 'celebrate';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import errorHandler from "./middlewares/error-handler";
import notFoundHandler from "./middlewares/not-found-handler";
import {requestLogger, errorLogger} from "./middlewares/logger";

const PORT = process.env.PORT || 3000;
const { DB_ADDRESS } = process.env;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

if (!DB_ADDRESS) {
  throw new Error('DB_ADDRESS is not defined in .env file');
}

mongoose.connect(DB_ADDRESS)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.use(requestLogger);

app.use('/product', productsRouter);
app.use('/order', ordersRouter);

app.use(notFoundHandler);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
