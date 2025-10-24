import fp from 'fastify-plugin';
import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import mongoose from 'mongoose';
import { exempleUserModel, ExempleUserModel } from '../models/exempleUser';

export interface Models {
  ExempleUser: ExempleUserModel;
}

export interface Db {
  models: Models;
}

declare module 'fastify' {
  interface FastifyInstance {
    db: Db;
  }
}

const dbPlugin: FastifyPluginAsync = async (server: FastifyInstance) => {
  const { DB_HOST, DB_PORT, DB_NAME } = server.config;
  const uri = `mongodb://${DB_HOST}:${DB_PORT}`;
  try {
    mongoose.connection.on('connected', () => {
      server.log.info({ actor: 'MongoDB' }, 'connected');
    });
    mongoose.connection.on('disconnected', () => {
      server.log.error({ actor: 'MongoDB' }, 'disconnected');
    });

    const models: Models = {
      ExempleUser: exempleUserModel,
    };

    server.decorate('db', { models });

    await mongoose.connect(uri, {
      dbName: DB_NAME,
    });
  } catch (error) {
    server.log.error('MongoDB connection error: ', error);
    throw error;
  }
};

export default fp(dbPlugin);
