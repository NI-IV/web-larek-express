import 'dotenv/config';
import cors from 'cors';
import mongoose from 'mongoose';

import express from 'express';

const PORT = process.env.PORT || 3000;
const { DB_ADDRESS } = process.env;

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
