import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import db from "@/lib/firebase/firestore";
import { addDoc, updateDoc } from "@/lib/firebase/firestore";
import { Order, OrderStatus } from "./types";
import { sendMailNotification } from "@/actions/notifications";

const ORDERS_COLLECTION = "orders";

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
 * Create a new order
 */
export async function createOrder(
  orderData: Omit<Order, "id" | "orderNumber" | "createdAt" | "updatedAt">
): Promise<Order> {
  const orderNumber = generateOrderNumber();

  const order: Omit<Order, "id" | "createdAt"> = {
    ...orderData,
    orderNumber,
    status: orderData.status || "pending",
    updatedAt: Timestamp.now(),
  };

  const addOrderDoc = addDoc<Order>(ORDERS_COLLECTION);
  const createdOrder = await addOrderDoc(order);
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
  const updateOrderDoc = updateDoc(ORDERS_COLLECTION);
  await updateOrderDoc(orderId, {
    paymentIntentId,
    updatedAt: Timestamp.now(),
  });
}
