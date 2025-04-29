import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getEnvNumber = (key: string, defaultValue?: number): number => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Invalid number for environment variable: ${key}`);
  }
  return num;
};

const config = {
  BASE_URL: getEnv('BASE_URL'),
  PORT: getEnvNumber('PORT'),
  MONGODB_URI: getEnv('MONGODB_URI'),
  JWT_SECRET: getEnv('JWT_SECRET'),
};

export default config;
