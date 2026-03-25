import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const server = Fastify({
  logger: process.env.NODE_ENV === 'development' ? {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  } : true,
});

// Plugins
import supabasePlugin from './plugins/supabase.js';
import authPlugin from './plugins/auth.js';
import ratesRoutes from './routes/rates.js';
import bookingsRoutes from './routes/bookings.js';
import upsellsRoutes from './routes/upsells.js';
import insightsRoutes from './routes/insights.js';
import guestsRoutes from './routes/guests.js';
import mpesaRoutes from './routes/mpesa.js';

// Register core plugins
server.register(helmet);
server.register(cors, {
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.vercel\.app$/, /\.onrender\.com$/] 
    : true,
});

server.register(supabasePlugin);
server.register(authPlugin);

// Register Routes
server.register(ratesRoutes, { prefix: '/api/v1/rates' });
server.register(bookingsRoutes, { prefix: '/api/v1/bookings' });
server.register(upsellsRoutes, { prefix: '/api/v1/upsells' });
server.register(insightsRoutes, { prefix: '/api/v1/insights' });
server.register(guestsRoutes, { prefix: '/api/v1/guests' });
server.register(mpesaRoutes, { prefix: '/api/v1/mpesa' });

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: Date.now() };
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3001', 10);
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Voya AI API listening on port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
