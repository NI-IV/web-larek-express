import { Router } from 'express';
import { getAllProducts, createProduct } from '../controllers/products';
import {createProductValidation} from "../middlewares/validations";

const router = Router();

router.get('/', getAllProducts);
router.post('/', createProductValidation, createProduct);

export default router;
