import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const BookingSchema = Type.Object({
  room_id: Type.String(),
  guest_id: Type.String(),
  check_in: Type.String({ format: 'date' }),
  check_out: Type.String({ format: 'date' }),
  status: Type.Optional(Type.Union([Type.Literal('pending'), Type.Literal('confirmed'), Type.Literal('cancelled')])),
  total_amount: Type.Number(),
});

const bookingsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', fastify.authenticate);

  // GET / - list all bookings for the lodge
  fastify.get('/', {
    schema: {
      querystring: Type.Object({
        status: Type.Optional(Type.String()),
        search: Type.Optional(Type.String()),
        page: Type.Optional(Type.Number({ minimum: 1 })),
        pageSize: Type.Optional(Type.Number({ minimum: 1, maximum: 100 }))
      })
    }
  }, async (request, reply) => {
    const { status, search, page = 1, pageSize = 20 } = request.query as {
      status?: string;
      search?: string;
      page?: number;
      pageSize?: number;
    };
    
    let query = fastify.supabase
      .from('bookings')
      .select('*, guests(*)')
      .eq('lodge_id', request.lodge_id)
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (status) {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.ilike('guests.full_name', `%${search}%`);
    }

    const { data, error } = await query;

    if (error) return reply.code(500).send({ error: true, message: error.message, code: 500 });
    return data;
  });

  // GET /:id - get single booking
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { data, error } = await fastify.supabase
      .from('bookings')
      .select('*, guests(*)')
      .eq('id', id)
      .eq('lodge_id', request.lodge_id)
      .single();

    if (error) return reply.code(404).send({ error: true, message: 'Booking not found', code: 404 });
    return data;
  });

  // POST / - create booking
  fastify.post('/', {
    schema: { body: BookingSchema }
  }, async (request, reply) => {
    const body = request.body as any;
    const { data, error } = await fastify.supabase
      .from('bookings')
      .insert([{ ...body, lodge_id: request.lodge_id }])
      .select()
      .single();

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return reply.code(201).send(data);
  });

  // PUT /:id - update booking details
  fastify.put('/:id', {
    schema: { body: BookingSchema }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as any;

    const { data, error } = await fastify.supabase
      .from('bookings')
      .update(body)
      .eq('id', id)
      .eq('lodge_id', request.lodge_id)
      .select('*, guests(*)')
      .single();

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return data;
  });

  // PUT /:id/status - update booking status
  fastify.put('/:id/status', {
    schema: {
      body: Type.Object({
        status: Type.Union([Type.Literal('pending'), Type.Literal('confirmed'), Type.Literal('cancelled')])
      })
    }
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const { status } = request.body as { status: string };

    const { data, error } = await fastify.supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .eq('lodge_id', request.lodge_id)
      .select()
      .single();

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return data;
  });

  // DELETE /:id - remove booking
  fastify.delete('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { error } = await fastify.supabase
      .from('bookings')
      .delete()
      .eq('id', id)
      .eq('lodge_id', request.lodge_id);

    if (error) return reply.code(400).send({ error: true, message: error.message, code: 400 });
    return reply.code(204).send();
  });
};

export default bookingsRoutes;
