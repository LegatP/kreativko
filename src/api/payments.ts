import { post } from "./client";

interface CreatePaymentIntentRequest {
  orderId: string;
}

interface CreatePaymentIntentResponse {
  client_secret: string;
  payment_intent_id: string;
}

/**
 * Create a payment intent for an order
 */
export async function createPaymentIntent(orderId: string) {
  return post<CreatePaymentIntentResponse, CreatePaymentIntentRequest>(
    "/create-payment-intent",
    { orderId }
  );
}
