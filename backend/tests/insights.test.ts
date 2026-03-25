import { describe, it, expect, vi, beforeAll } from 'vitest';
import Fastify from 'fastify';
import insightsRoutes from '../src/routes/insights.js';

const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  single: vi.fn(() => Promise.resolve({ data: { occupancy_rate: 75.5 }, error: null })),
};

describe('Insights API', () => {
  let fastify: any;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.decorate('supabase', mockSupabase);
    fastify.decorate('authenticate', async (request: any) => {
      request.lodge_id = 'test-lodge-123';
    });
    fastify.register(insightsRoutes);
  });

  it('GET /revenue - should return revenue summary', async () => {
    (mockSupabase as any).then = vi.fn((cb: any) => cb({ 
        data: [{ total_amount: 1000, room_id: 'R1' }], 
        error: null 
    }));

    const response = await fastify.inject({
      method: 'GET',
      url: '/revenue'
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).totalRevenue).toBe(1000);
  });

  it('GET /occupancy - should return occupancy rate', async () => {
    const response = await fastify.inject({
      method: 'GET',
      url: '/occupancy'
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).occupancyRate).toBe(75.5);
  });
});
