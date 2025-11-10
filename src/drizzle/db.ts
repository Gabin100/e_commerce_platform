import { drizzle } from 'drizzle-orm/node-postgres';
import envVars from '../env';

const db = drizzle({ connection: envVars.DATABASE_URL, casing: 'snake_case' });

export type db = typeof db;

export default db;
