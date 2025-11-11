import { Request, Response, Router } from 'express';

import authRouter from './auth/auth.routes';
import productRouter from './products/product.routes';
import orderRouter from './orders/order.routes';

const router = Router();

// Health check endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Application API Working Successfully  - 👋🌎🌍🌏',
  });
});

// Module Routers
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/orders', orderRouter);

export { router as applicationRouters };
