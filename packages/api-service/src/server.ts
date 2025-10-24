import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import fastifyCors from '@fastify/cors';
import path from 'path';
import config from '@/plugins/config';
import routes from '@/routes';
import mongodbPlugin from '@/plugins/mongodb';

const server = fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
        ignore: 'pid,hostname',
      },
    },
  },
});
server.register(fastifyStatic, {
  root: path.join(__dirname, '../public'),
  prefix: '/public/',
});
// Enable CORS for the client running on http://localhost:3000
server.register(fastifyCors, {
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
});
server.register(config);
server.register(mongodbPlugin);
server.register(routes);

export default server;
