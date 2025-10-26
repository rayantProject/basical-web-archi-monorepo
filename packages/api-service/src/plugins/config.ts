import dotenv from 'dotenv';
dotenv.config();

import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';

export const NodeEnv = z.enum(['development', 'test', 'production']);

const ConfigSchema = z.object({
  NODE_ENV: NodeEnv,
  LOG_LEVEL: z.string().default('info'),
  API_HOST: z.string().default('0.0.0.0'),
  API_PORT: z.string().default('3000'),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('27017'),
  DB_NAME: z.string().default('fastifymini-mongo'),
  DB_USER: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

const configPlugin: FastifyPluginAsync = async (server) => {
  try {
    const config = ConfigSchema.parse(process.env);
    server.decorate('config', config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      server.log.error({ error: error.format() }, '❌ .env file validation failed');
      throw new Error('.env file validation failed');
    }
    throw error;
  }
};

declare module 'fastify' {
  interface FastifyInstance {
    config: Config;
  }
}

export default fp(configPlugin);
