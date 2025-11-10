import { Request, Response, Router } from 'express';

import authRouter from './auth/auth.routes';
import productRouter from './products/product.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Application API Working Successfully  - 👋🌎🌍🌏',
  });
});

router.use('/auth', authRouter);
router.use('/products', productRouter);

export { router as applicationRouters };
