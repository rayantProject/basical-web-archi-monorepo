import fastify from 'fastify';
import { Models } from '@/plugins/mongodb';
import routes from '@/routes';
import { exempleUserModel } from '@/models/exempleUser';

const buildTestServer = () => {
  const server = fastify();
  const models: Models = {
    ExempleUser: exempleUserModel,
  };

  server.decorate('db', { models });

  server.register(routes);

  return server;
};

export default buildTestServer;
