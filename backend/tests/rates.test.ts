import { describe, it, expect, vi, beforeAll } from 'vitest';
import Fastify from 'fastify';
import ratesRoutes from '../src/routes/rates.js';

// Mock Supabase with a more robust chain
const mockSupabase: any = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  then: vi.fn(function(this: any, resolve) {
    return Promise.resolve(resolve({ data: this._data, error: this._error }));
  }),
  _data: null,
  _error: null,
};

describe('Rates API', () => {
  let fastify: any;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.decorate('supabase', mockSupabase);
    fastify.decorate('authenticate', async (request: any) => {
      request.lodge_id = 'test-lodge-123';
    });
    fastify.register(ratesRoutes);
  });

  it('GET /api/v1/rates - should return rates for the lodge', async () => {
    mockSupabase._data = [{ id: '1', lodge_id: 'test-lodge-123', price_per_night: 100 }];
    mockSupabase._error = null;

    const response = await fastify.inject({
      method: 'GET',
      url: '/'
    });

    expect(response.statusCode).toBe(200);
    expect(mockSupabase.from).toHaveBeenCalledWith('rates');
    expect(mockSupabase.eq).toHaveBeenCalledWith('lodge_id', 'test-lodge-123');
  });

  it('POST /api/v1/rates - should create a new rate', async () => {
    const payload = {
      room_id: 'room-1',
      season: 'peak',
      price_per_night: 250
    };

    mockSupabase._data = { id: 'new-id', ...payload, lodge_id: 'test-lodge-123' };
    mockSupabase._error = null;

    const response = await fastify.inject({
      method: 'POST',
      url: '/',
      body: payload
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload).room_id).toBe('room-1');
  });

  it('DELETE /api/v1/rates/:id - should delete a rate', async () => {
     mockSupabase._data = null;
     mockSupabase._error = null;

     const response = await fastify.inject({
       method: 'DELETE',
       url: '/rate-1'
     });

     expect(response.statusCode).toBe(204);
  });
});
