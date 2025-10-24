import { FastifyPluginAsync } from 'fastify';
import exempleUserRoutes from './exempleUser';

const routes: FastifyPluginAsync = async (server) => {
  server.get('/', async function (request, reply) {
    return reply.redirect('/public/readme.html');
  });
  server.register(exempleUserRoutes);
};

export default routes;
