import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const RateSchema = Type.Object({
  id: Type.Optional(Type.String()),
  room_id: Type.String(),
  season: Type.Union([Type.Literal('peak'), Type.Literal('offpeak'), Type.Literal('standard')]),
  price_per_night: Type.Number(),
  currency: Type.Optional(Type.String()),
  valid_from: Type.Optional(Type.String()),
  valid_to: Type.Optional(Type.String()),
});

const ratesRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', fastify.authenticate);

  // GET / - fetch all rates for the lodge
  fastify.get('/', async (request, reply) => {
    const { data, error } = await fastify.supabase
      .from('rates')
      .select('*')
      .eq('lodge_id', request.lodge_id);

    if (error) return reply.code(500).send({ error: true, message: error.message, code: 500 });
    return data;
  });

  // POST / - create new rate
  fastify.post('/', {
    schema: { body: RateSchema }
  }, async (request, reply) => {
    const body = request.body as any;
    const { data, error } = await fastify.supabase
      .from('rates')
      .insert([{ ...body, lodge_id: request.lodge_id }])
      .select()
      .single();

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return reply.code(201).send(data);
  });

  // PUT /:id - update rate
  fastify.put('/:id', {
    schema: { body: RateSchema }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    const { data, error } = await fastify.supabase
      .from('rates')
      .update(body)
      .eq('id', id)
      .eq('lodge_id', request.lodge_id) // Ensure multi-tenant isolation
      .select()
      .single();

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    if (!data) return reply.code(404).send({ error: true, message: 'Rate not found', code: 404 });
    
    return data;
  });

  // DELETE /:id - delete rate
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { error } = await fastify.supabase
      .from('rates')
      .delete()
      .eq('id', id)
      .eq('lodge_id', request.lodge_id);

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return reply.code(204).send();
  });
};

export default ratesRoutes;
