import { Request, Response, Router } from 'express';

import authRouter from './auth/auth.routes';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Application API Working Successfully  - 👋🌎🌍🌏',
  });
});

// Integrate the Auth module routes
router.use('/auth', authRouter);

export { router as applicationRouters };
