import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  environment: 'dev' | 'prod';
  mongodbUri?: string | undefined;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  environment: process.env.ENVIRONMENT === 'prod' ? 'prod' : 'dev',
  mongodbUri: process.env.MONGODB_URI,
};

export default config;
