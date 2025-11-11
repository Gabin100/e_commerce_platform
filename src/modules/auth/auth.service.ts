import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import db from '../../../drizzle/db';
import { NewUser, User, users } from '../../../drizzle/schema';
import { eq, or } from 'drizzle-orm';
import envVars from '../../../env';
import { create } from 'domain';

const SALT_ROUNDS = 10;

/**
 * Checks if a username or email already exists in the database.
 * @param username The username to check.
 * @param email The email to check.
 * @returns {string | null} An error message if a conflict is found, otherwise null.
 */
export async function checkUniqueness(
  username: string,
  email: string
): Promise<string | null> {
  const [existingUser] = await db
    .select()
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1);

  if (existingUser) {
    if (existingUser.email === email) {
      return 'Email address is already registered.';
    }
    if (existingUser.username === username) {
      return 'Username is already taken.';
    }
  }
  return null;
}

/**
 * Hashes the password and saves the new user to the database.
 * @param data The user registration data.
 * @returns {Omit<User, 'password'>} The created user object without the password hash.
 */
export async function registerUser(data: {
  username: string;
  email: string;
  role: string;
  password: string;
}): Promise<Omit<User, 'password'>> {
  // Hash the password
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const newUser: NewUser = {
    username: data.username,
    email: data.email,
    role: data.role,
    password: passwordHash,
  };

  // Insert into the database
  const [createdUser] = await db.insert(users).values(newUser).returning({
    id: users.id,
    username: users.username,
    email: users.email,
    role: users.role,
    createdAt: users.createdAt,
  });

  if (!createdUser) {
    throw new Error('User registration failed.');
  }

  return createdUser;
}

interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

/**
 * Authenticates a user and generates a JWT upon success.
 * @param email The user's email.
 * @param password The user's password.
 * @returns {string | null} The generated JWT token, or null if authentication fails.
 */
export async function authenticateUserAndGenerateToken(
  email: string,
  password: string
): Promise<string | null> {
  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    // User not found
    return null;
  }

  // Compare the submitted password with the stored hash
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    // Password does not match
    return null;
  }

  // Successful authentication: Generate JWT
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(payload, envVars.JWT_SECRET_KEY, { expiresIn: '1d' }); // Token expires in 1 day

  return token;
}
