import { Request, Response } from 'express';
import * as authService from './auth.service';
import { sendBaseError, sendBaseSuccess } from '../../utils/response';

export async function registerController(req: Request, res: Response) {
  const { username, email, password } = req.body;

  try {
    // 1. Check for uniqueness (DB level check)
    const uniquenessError = await authService.checkUniqueness(username, email);
    if (uniquenessError) {
      return sendBaseError(
        res,
        [uniquenessError],
        'Conflict',
        400,
        'AUTH_CONTROLLER_REGISTER'
      );
    }

    // 2. Register the user (hashes password and saves)
    const safeUser = await authService.registerUser({
      username,
      email,
      password,
    });

    // 3. Success Response: 201 Created
    return sendBaseSuccess(
      res,
      {
        id: safeUser.id,
        username: safeUser.username,
        email: safeUser.email,
      },
      'Registration successful.',
      201
    );
  } catch (error) {
    return sendBaseError(
      res,
      [`${(error as Error).message}`],
      'An internal server error occurred during registration.',
      500,
      'AUTH_CONTROLLER_REGISTER'
    );
  }
}
