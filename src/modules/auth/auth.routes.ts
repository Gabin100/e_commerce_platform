import { Router } from 'express';
import { loginController, registerController } from './auth.controller';
import { validateLogin, validateRegister } from './auth.validation';

const authRouter = Router();

// Endpoint: POST /auth/register
authRouter.post('/register', validateRegister, registerController);

// Endpoint: POST /auth/login
authRouter.post('/login', validateLogin, loginController);

export default authRouter;
