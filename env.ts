import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import * as Joi from 'joi';

// Load environment variables from .env file
config();
expand(config());

// Define environment variable schema with clear and concise descriptions
const EnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .default('development')
    .description('Application environment (development, production, etc.)'),
  PORT: Joi.number()
    .default(4000)
    .required()
    .description('Port number for the server'),
  JWT_SECRET_KEY: Joi.string().required().description('Secret key for JWT'),
  DATABASE_URL: Joi.string().required().description('Database connection URL'),
}).options({ allowUnknown: true });

// Validate environment variables and handle errors
const { error, value: envVars } = EnvSchema.validate(process.env, {
  abortEarly: false,
}) as {
  value: {
    NODE_ENV: string;
    PORT: number;
    JWT_SECRET_KEY: string;
    DATABASE_URL: string;
  };
  error?: Joi.ValidationError;
};

if (error) {
  const errorMessage =
    'Missing required environment variables:\n' +
    error.details.map((detail) => `- ${detail.path[0]}`).join('\n');
  throw new Error(errorMessage);
}

export default envVars;
