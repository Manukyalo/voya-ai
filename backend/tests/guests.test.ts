import { describe, it, expect, vi, beforeAll } from 'vitest';
import Fastify from 'fastify';
import guestsRoutes from '../src/routes/guests.js';

const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  select: vi.fn(() => mockSupabase),
  insert: vi.fn(() => mockSupabase),
  eq: vi.fn(() => mockSupabase),
  order: vi.fn(() => mockSupabase),
  single: vi.fn(() => Promise.resolve({ data: null, error: null })),
};

describe('Guests API', () => {
  let fastify: any;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.decorate('supabase', mockSupabase);
    fastify.decorate('authenticate', async (request: any) => {
      request.lodge_id = 'test-lodge-123';
    });
    fastify.register(guestsRoutes);
  });

  it('GET / - should list guests', async () => {
    (mockSupabase as any).then = vi.fn((cb: any) => cb({ data: [], error: null }));

    const response = await fastify.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
  });
});
