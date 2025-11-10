import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import * as Joi from 'joi';

// Load environment variables from .env file
config();
expand(config());

// Custom Joi extension for string to boolean conversion
const stringBoolean = Joi.string()
  .valid('true', 'false')
  .default('false')
  .custom((value, helpers) => {
    return value === 'true';
  });

// Define environment variable schema with clear and concise descriptions
const EnvSchema = Joi.object({
  NODE_ENV: Joi.string()
    .default('development')
    .description('Application environment (development, production, etc.)'),
  JWT_SECRET_KEY: Joi.string().required().description('Secret key for JWT'),
  JWT_ISSUER: Joi.string().required().description('JWT issuer'),
  CRYPTO_SECRET_KEY: Joi.string()
    .required()
    .description('Secret key for cryptography'),
  DATABASE_URL: Joi.string().required().description('Database connection URL'),
}).options({ allowUnknown: true });

// Validate environment variables and handle errors
const { error, value: envVars } = EnvSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  const errorMessage =
    'Missing required environment variables:\n' +
    error.details.map((detail) => `- ${detail.path[0]}`).join('\n');
  throw new Error(errorMessage);
}

export default envVars;
