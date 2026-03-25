import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import fastifyJwt from '@fastify/jwt';

declare module 'fastify' {
  interface FastifyRequest {
    lodge_id: string;
  }
}

export default fp(async (fastify: FastifyInstance) => {
  const publicKey = process.env.CLERK_JWT_PUBLIC_KEY;

  if (!publicKey) {
    fastify.log.warn('CLERK_JWT_PUBLIC_KEY missing. Authentication will fail.');
  }

  // Register JWT plugin
  fastify.register(fastifyJwt, {
    secret: publicKey || 'dummy_secret',
    formatUser: (user: any) => ({
        lodge_id: user.metadata?.public?.lodge_id || user.public_metadata?.lodge_id
    })
  });

  // Authentication Hook
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      
      const payload = request.user as { lodge_id?: string };
      
      if (!payload.lodge_id) {
        return reply.code(403).send({ 
          error: true, 
          message: 'Access denied: No lodge_id found in token',
          code: 403 
        });
      }

      request.lodge_id = payload.lodge_id;
    } catch (err) {
      reply.code(401).send({ 
        error: true, 
        message: 'Unauthorized: Invalid or missing token',
        code: 401 
      });
    }
  });
});

declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
