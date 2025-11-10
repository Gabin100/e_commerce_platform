import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import db from '../../../drizzle/db';
import { NewUser, User, users } from '../../../drizzle/schema';
import { eq, or } from 'drizzle-orm';
import envVars from '../../../env';

const SALT_ROUNDS = 10;

/**
 * Checks if a username or email already exists in the database.
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
 * @returns {Omit<User, 'password'>} The created user object without the password hash.
 */
export async function registerUser(data: {
  username: string;
  email: string;
  password: string;
}): Promise<Omit<User, 'password'>> {
  // 1. Hash the password
  const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

  const newUser: NewUser = {
    username: data.username,
    email: data.email,
    password: passwordHash,
  };

  // 2. Insert into the database
  const [createdUser] = await db.insert(users).values(newUser).returning();

  if (!createdUser) {
    throw new Error('User registration failed.');
  }

  // 3. Return the user, excluding the sensitive passwordHash
  const { password: _, ...safeUser } = createdUser;
  return safeUser;
}

interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: string;
}

/**
 * Authenticates a user and generates a JWT upon success.
 * @returns {string | null} The generated JWT token, or null if authentication fails.
 */
export async function authenticateUserAndGenerateToken(
  email: string,
  password: string
): Promise<string | null> {
  // 1. Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    // User not found
    return null;
  }

  // 2. Compare the submitted password with the stored hash
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    // Password does not match
    return null;
  }

  // 3. Successful authentication: Generate JWT
  const payload: JWTPayload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: 'user', // Assuming a default role;
  };

  const token = jwt.sign(payload, envVars.JWT_SECRET_KEY, { expiresIn: '1d' }); // Token expires in 1 day

  return token;
}
