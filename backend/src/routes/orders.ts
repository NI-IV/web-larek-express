import { Router } from 'express';
import { createOrder } from '../controllers/orders';
import { createOrderValidation } from "../middlewares/validations";

const router = Router();

router.post('/', createOrderValidation, createOrder);

export default router;
