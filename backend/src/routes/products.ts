import { Router } from 'express';
import { getAllProducts, createProduct } from '../controllers/products';

const router = Router();

router.get('/product', getAllProducts);
router.post('/product', createProduct);

export default router;
