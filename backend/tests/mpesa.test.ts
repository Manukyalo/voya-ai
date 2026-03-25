import { describe, it, expect, vi, beforeAll } from 'vitest';
import Fastify from 'fastify';
import mpesaRoutes from '../src/routes/mpesa.js';

const mockSupabase = {
  from: vi.fn(() => mockSupabase),
  insert: vi.fn(() => Promise.resolve({ error: null })),
  update: vi.fn(() => mockSupabase),
  eq: vi.fn(() => Promise.resolve({ error: null })),
};

const skipMpesa = process.env.MPESA_CONSUMER_KEY === 'placeholder' || !process.env.MPESA_CONSUMER_KEY;

describe.skipIf(skipMpesa)('M-Pesa webhook', () => {
  let fastify: any;

  beforeAll(async () => {
    fastify = Fastify();
    fastify.decorate('supabase', mockSupabase);
    fastify.register(mpesaRoutes);
  });

  it('POST /webhook - should accept successful payment', async () => {
    const payload = {
      Body: {
        stkCallback: {
          MerchantRequestID: "123",
          CheckoutRequestID: "456",
          ResultCode: 0,
          ResultDesc: "Success",
          CallbackMetadata: {
            Item: [
              { Name: "Amount", Value: 1000 },
              { Name: "MpesaReceiptNumber", Value: "ABC" },
              { Name: "PhoneNumber", Value: "254123" }
            ]
          }
        }
      }
    };

    const response = await fastify.inject({
      method: 'POST',
      url: '/webhook',
      body: payload
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload).ResultCode).toBe(0);
    expect(mockSupabase.from).toHaveBeenCalledWith('mpesa_events');
  });
});

describe('M-Pesa status', () => {
    let fastify: any;

    beforeAll(async () => {
      fastify = Fastify();
      fastify.decorate('supabase', mockSupabase);
      fastify.register(mpesaRoutes);
    });

    it('GET /status - should return connectivity status', async () => {
        const response = await fastify.inject({
          method: 'GET',
          url: '/status'
        });
    
        expect(response.statusCode).toBe(200);
        expect(JSON.parse(response.payload)).toHaveProperty('enabled');
    });
});
