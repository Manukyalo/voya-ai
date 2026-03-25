import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const GuestSchema = Type.Object({
  full_name: Type.String(),
  email: Type.Optional(Type.String({ format: 'email' })),
  phone: Type.Optional(Type.String()),
  nationality: Type.Optional(Type.String()),
});

const guestsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', fastify.authenticate);

  // GET / - list all guests
  fastify.get('/', async (request, reply) => {
    const { data, error } = await fastify.supabase
      .from('guests')
      .select('*')
      .eq('lodge_id', request.lodge_id)
      .order('created_at', { ascending: false });

    if (error) return reply.code(500).send({ error: true, message: error.message, code: 500 });
    return data;
  });

  // GET /:id - single guest profile
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { data, error } = await fastify.supabase
      .from('guests')
      .select('*, bookings(*)')
      .eq('id', id)
      .eq('lodge_id', request.lodge_id)
      .single();

    if (error) return reply.code(404).send({ error: true, message: 'Guest not found', code: 404 });
    return data;
  });

  // POST / - create a guest
  fastify.post('/', {
    schema: { body: GuestSchema }
  }, async (request, reply) => {
    const body = request.body as any;
    const { data, error } = await fastify.supabase
      .from('guests')
      .insert([{ ...body, lodge_id: request.lodge_id }])
      .select()
      .single();

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return reply.code(201).send(data);
  });
};

export default guestsRoutes;
