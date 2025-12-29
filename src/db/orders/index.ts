import db, { AddDocumentData } from "@/lib/firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { createCollection } from "../createCollection";
import {
  Order,
  OrderItem,
  ShippingInfo,
  OrderStatus,
  DesignUrls,
} from "./types";
import { sendMailNotification } from "@/actions/notifications";
import { generateOrderNumber } from "@/utils/order.utils";
import { formatPrice } from "@/utils/currency.utils";

// Re-export types
export type { Order, OrderItem, ShippingInfo, OrderStatus, DesignUrls };

const ORDERS_COLLECTION = "orders";

// Create the collection with full CRUD + hooks support
const ordersCollection = createCollection<Order>(ORDERS_COLLECTION);

// Export collection metadata
export { ORDERS_COLLECTION };
export const orderConverter = ordersCollection.converter;

/**
 * Create a new order with auto-generated order number.
 * Note: Email notification is sent from webhook after payment confirmation.
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

  return ordersCollection.create(order);
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

/**
 * Find order by payment intent ID
 */
export async function getOrderByPaymentIntentId(
  paymentIntentId: string
): Promise<Order | null> {
  const ordersRef = collection(db, ORDERS_COLLECTION);
  const q = query(ordersRef, where("paymentIntentId", "==", paymentIntentId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  return { ...doc.data(), id: doc.id } as Order;
}

/**
 * Confirm order payment - called from Stripe webhook.
 * Updates status to "paid", sets paidAt timestamp, sends email notification.
 * Idempotent: safe to call multiple times.
 */
export async function confirmOrderPayment(
  paymentIntentId: string
): Promise<void> {
  const order = await getOrderByPaymentIntentId(paymentIntentId);

  if (!order) {
    throw new Error(`Order not found for payment intent: ${paymentIntentId}`);
  }

  // Idempotency check: if already paid, don't process again
  if (order.status === "paid") {
    console.log(`Order ${order.orderNumber} already confirmed, skipping`);
    return;
  }

  // Update order status to paid
  await ordersCollection.update(order.id, {
    status: "paid" as OrderStatus,
    paidAt: Timestamp.now(),
  });

  // Send notification email
  const totalQuantity = order.items.reduce((sum, item) => {
    return sum + Object.values(item.quantities).reduce((a, b) => a + b, 0);
  }, 0);

  await sendMailNotification(
    `${
      process.env.NODE_ENV === "development" ? "[DEV] " : ""
    }Moj-Motiv: novo naročilo ${order.orderNumber}`,
    `Novo naročilo je bilo plačano.

    Številka naročila: ${order.orderNumber}
    Stranka: ${order.shippingInfo.firstName} ${order.shippingInfo.lastName}
    Email: ${order.shippingInfo.email}
    Telefon: ${order.shippingInfo.phoneNumber}

    Naslov:
    ${order.shippingInfo.address}
    ${order.shippingInfo.postalCode} ${order.shippingInfo.city}
    ${order.shippingInfo.country}

    Izdelki: ${totalQuantity} kos
    Znesek: ${formatPrice(order.totalAmount)} EUR`
  );

  console.log(`Order ${order.orderNumber} confirmed and notification sent`);
}
