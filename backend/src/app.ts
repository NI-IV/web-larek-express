import 'dotenv/config';
import cors from 'cors';
import path from 'path';
import mongoose from 'mongoose';
import express from 'express';
import productsRouter from './routes/products';

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

app.use('/', productsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
