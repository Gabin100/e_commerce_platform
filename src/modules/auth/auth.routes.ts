import { Router } from 'express';
import { loginController, registerController } from './auth.controller';
import { validateLogin, validateRegister } from './auth.validation';

const authRouter = Router();

// Endpoint: POST /auth/register
// Validation: Uses the registration schema
authRouter.post('/register', validateRegister, registerController);

// Endpoint: POST /auth/login
// Validation: Uses the login schema
authRouter.post('/login', validateLogin, loginController);

export default authRouter;
