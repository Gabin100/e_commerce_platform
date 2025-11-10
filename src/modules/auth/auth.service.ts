import * as bcrypt from 'bcrypt';
import db from '../../../drizzle/db';
import { NewUser, User, users } from '../../../drizzle/schema';
import { eq, or } from 'drizzle-orm';

const SALT_ROUNDS = 10;

/**
 * Checks if a username or email already exists in the database.
 * @returns {string | null} An error message if a conflict is found, otherwise null.
 */
export async function checkUniqueness(
  username: string,
  email: string
): Promise<string | null> {
  const existingUser = await db
    .select()
    .from(users)
    .where(or(eq(users.username, username), eq(users.email, email)))
    .limit(1);

  if (existingUser.length > 0 && existingUser[0]) {
    if (existingUser[0].email === email) {
      return 'Email address is already registered.';
    }
    if (existingUser[0].username === username) {
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
