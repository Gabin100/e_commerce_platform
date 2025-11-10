import { defineConfig } from 'drizzle-kit';
import envVars from './src/env';

const dbUrl = envVars.DATABASE_URL;

export default defineConfig({
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: dbUrl,
  },
  verbose: envVars.NODE_ENV === 'development' ? true : false,
  strict: true,
});
