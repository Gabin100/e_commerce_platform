import { Router } from 'express';
import { registerController } from './auth.controller';
import { validateRegister } from './auth.validation';

const authRouter = Router();

// Endpoint: POST /auth/register
authRouter.post('/register', validateRegister, registerController);

export default authRouter;
