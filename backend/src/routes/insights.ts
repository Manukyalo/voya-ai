import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const insightsRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', fastify.authenticate);

  // GET /revenue - total revenue, breakdown by room
  fastify.get('/revenue', async (request, reply) => {
    const { data: bookings, error } = await fastify.supabase
      .from('bookings')
      .select('total_amount, room_id, created_at')
      .eq('lodge_id', request.lodge_id)
      .eq('payment_status', 'paid');

    if (error) return reply.code(500).send({ error: true, message: error.message, code: 500 });

    const totalRevenue = bookings.reduce((sum, b) => sum + Number(b.total_amount), 0);
    
    // Simple breakdown by room
    const byRoom = bookings.reduce((acc: any, b) => {
      acc[b.room_id] = (acc[b.room_id] || 0) + Number(b.total_amount);
      return acc;
    }, {});

    return {
      totalRevenue,
      byRoom
    };
  });

  // GET /occupancy - basic occupancy %
  fastify.get('/occupancy', async (request, reply) => {
    // In a real app, this would check room availability vs bookings
    // For now, we calculate from the stats view or simple count
    const { data: stats, error } = await fastify.supabase
      .from('lodge_stats')
      .select('occupancy_rate')
      .eq('lodge_id', request.lodge_id)
      .single();

    if (error) return { occupancyRate: 0 };
    return { occupancyRate: stats.occupancy_rate };
  });

  // GET /summary - KPIs
  fastify.get('/summary', async (request, reply) => {
    const [rev, occ, bookingsCount] = await Promise.all([
      fastify.supabase.from('bookings').select('total_amount').eq('lodge_id', request.lodge_id).eq('payment_status', 'paid'),
      fastify.supabase.from('lodge_stats').select('occupancy_rate').eq('lodge_id', request.lodge_id).single(),
      fastify.supabase.from('bookings').select('id', { count: 'exact' }).eq('lodge_id', request.lodge_id)
    ]);

    const totalRevenue = rev.data?.reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;
    
    return {
      revenueMTD: totalRevenue,
      occupancyRate: occ.data?.occupancy_rate || 0,
      totalBookings: bookingsCount.count || 0
    };
  });
};

export default insightsRoutes;
