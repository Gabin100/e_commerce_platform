import { drizzle } from 'drizzle-orm/node-postgres';
import envVars from '../src/env';

const db = drizzle({ connection: envVars.DATABASE_URL, casing: 'snake_case' });

export type db = typeof db;

export default db;
