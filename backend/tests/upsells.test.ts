import { describe, it, expect, vi, beforeAll } from 'vitest';
import Fastify from 'fastify';
import upsellsRoutes from '../src/routes/upsells.js';

const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  single: vi.fn(() => Promise.resolve({ data: null, error: null })),
};

describe('Upsells API', () => {
  let fastify: any;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.decorate('supabase', mockSupabase);
    fastify.decorate('authenticate', async (request: any) => {
      request.lodge_id = 'test-lodge-123';
    });
    fastify.register(upsellsRoutes);
  });

  it('GET / - should list upsells', async () => {
    (mockSupabase as any).then = vi.fn((cb: any) => cb({ data: [], error: null }));

    const response = await fastify.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
  });

  it('GET /stats - should return upsell stats', async () => {
    (mockSupabase as any).then = vi.fn((cb: any) => cb({ 
        data: [{ status: 'accepted', price: 50 }, { status: 'offered', price: 100 }], 
        error: null 
    }));

    const response = await fastify.inject({
      method: 'GET',
      url: '/stats'
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.totalUpsells).toBe(2);
    expect(body.revenueGenerated).toBe(50);
  });
});
