import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { Type } from '@sinclair/typebox';

const mpesaRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  const mpesaEnabled = 
    process.env.MPESA_CONSUMER_KEY !== 'placeholder' &&
    process.env.MPESA_CONSUMER_KEY !== undefined &&
    process.env.MPESA_CONSUMER_KEY !== '';

  if (!mpesaEnabled) {
    fastify.log.warn('M-Pesa credentials not configured — webhook endpoint is inactive');
  }

  // GET /status - check if M-Pesa is active
  fastify.get('/status', async () => {
    return { 
      enabled: mpesaEnabled,
      message: mpesaEnabled ? 'M-Pesa is configured' : 'M-Pesa credentials pending'
    };
  });

  // Public Endpoint - NO JWT Verification required for webhooks
  fastify.post('/webhook', async (request, reply) => {
    if (!mpesaEnabled) {
      return reply.code(503).send({ 
        error: true, 
        message: 'M-Pesa not configured yet' 
      });
    }

    const payload = request.body as any;
    const callback = payload?.Body?.stkCallback;

    if (!callback) {
      return reply.code(400).send({ ResultCode: 1, ResultDesc: "Invalid payload" });
    }

    const { ResultCode, ResultDesc, MerchantRequestID, CheckoutRequestID, CallbackMetadata } = callback;

    let bookingStatus: 'paid' | 'failed' = ResultCode === 0 ? 'paid' : 'failed';
    let amount = 0;
    let mpesaReceipt = '';
    let phoneNumber = '';

    if (ResultCode === 0 && CallbackMetadata) {
      const items = CallbackMetadata.Item;
      amount = items.find((i: any) => i.Name === 'Amount')?.Value || 0;
      mpesaReceipt = items.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value || '';
      phoneNumber = items.find((i: any) => i.Name === 'PhoneNumber')?.Value || '';
    }

    // 1. Log the event for auditing
    await fastify.supabase
      .from('mpesa_events')
      .insert([{
        merchant_request_id: MerchantRequestID,
        checkout_request_id: CheckoutRequestID,
        result_code: ResultCode,
        result_desc: ResultDesc,
        amount,
        mpesa_receipt_number: mpesaReceipt,
        phone_number: String(phoneNumber),
        raw_payload: payload
      }]);

    // 2. Update the booking status
    if (ResultCode === 0) {
        await fastify.supabase
            .from('bookings')
            .update({ payment_status: 'paid' })
            .eq('id', MerchantRequestID);
    } else {
        await fastify.supabase
            .from('bookings')
            .update({ payment_status: 'failed' })
            .eq('id', MerchantRequestID);
    }

    return reply.code(200).send({ ResultCode: 0, ResultDesc: "Accepted" });
  });
};

export default mpesaRoutes;
