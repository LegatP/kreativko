import { AddDocumentData } from "@/lib/firebase/firestore";
import { createCollection } from "../createCollection";
import { Order, OrderItem, ShippingInfo, OrderStatus, DesignUrls } from "./types";
import { sendMailNotification } from "@/actions/notifications";

// Re-export types
export type { Order, OrderItem, ShippingInfo, OrderStatus, DesignUrls };

const ORDERS_COLLECTION = "orders";

// Create the collection with full CRUD + hooks support
const ordersCollection = createCollection<Order>(ORDERS_COLLECTION);

// Export collection metadata
export { ORDERS_COLLECTION };
export const orderConverter = ordersCollection.converter;

/**
 * Generate a unique order number
 */
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const timestamp = date.getTime();
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `ORD-${year}-${timestamp}-${random}`;
}

/**
 * Create a new order with auto-generated order number and notification
 */
export async function createOrder(
  orderData: Omit<AddDocumentData<Order>, "orderNumber">
): Promise<Order> {
  const orderNumber = generateOrderNumber();

  const order: AddDocumentData<Order> = {
    ...orderData,
    orderNumber,
    status: orderData.status || "pending",
  };

  const createdOrder = await ordersCollection.create(order);

  // Send notification
  await sendMailNotification(
    `${
      process.env.NODE_ENV === "development" ? "[DEV] " : ""
    }Moj-Motiv: novo naročilo: ${createdOrder.orderNumber}`,
    `Novo naročilo je bilo oddano na strani.`
  );

  return createdOrder;
}

/**
 * Update order with payment intent ID
 */
export async function updateOrderPaymentIntent(
  orderId: string,
  paymentIntentId: string
): Promise<void> {
  await ordersCollection.update(orderId, {
    paymentIntentId,
  });
}

// Export base operations for direct access if needed
export const getOrder = ordersCollection.get;
export const updateOrder = ordersCollection.update;

// React Firebase Hooks
export const useOrder = ordersCollection.useDoc;
export const useOrderOnce = ordersCollection.useDocOnce;
