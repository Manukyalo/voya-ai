import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const UpsellSchema = Type.Object({
  booking_id: Type.String(),
  type: Type.Union([Type.Literal('upgrade'), Type.Literal('addon'), Type.Literal('activity')]),
  description: Type.String(),
  price: Type.Number(),
  status: Type.Optional(Type.Union([Type.Literal('offered'), Type.Literal('accepted'), Type.Literal('declined')])),
});

const upsellsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', fastify.authenticate);

  // GET / - list all upsells
  fastify.get('/', async (request, reply) => {
    const { data, error } = await fastify.supabase
      .from('upsells')
      .select('*, bookings(*)')
      .eq('lodge_id', request.lodge_id);

    if (error) return reply.code(500).send({ error: true, message: error.message, code: 500 });
    return data;
  });

  // POST / - create an upsell
  fastify.post('/', {
    schema: { body: UpsellSchema }
  }, async (request, reply) => {
    const body = request.body as any;
    const { data, error } = await fastify.supabase
      .from('upsells')
      .insert([{ ...body, lodge_id: request.lodge_id }])
      .select()
      .single();

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return reply.code(201).send(data);
  });

  // GET /stats - summary stats
  fastify.get('/stats', async (request, reply) => {
    const { data, error } = await fastify.supabase
      .from('upsells')
      .select('status, price')
      .eq('lodge_id', request.lodge_id);

    if (error) return reply.code(500).send({ error: true, message: error.message, code: 500 });

    const total = data.length;
    const accepted = data.filter(u => u.status === 'accepted').length;
    const revenue = data.filter(u => u.status === 'accepted').reduce((sum, u) => sum + Number(u.price), 0);
    const conversionRate = total > 0 ? (accepted / total) * 100 : 0;

    return {
      totalUpsells: total,
      acceptedUpsells: accepted,
      conversionRate: parseFloat(conversionRate.toFixed(2)),
      revenueGenerated: revenue
    };
  });
};

export default upsellsRoutes;
