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

  const order: Omit<Order, "id"> = {
    ...orderData,
    orderNumber,
    status: orderData.status || "pending",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const createdOrder = await addDoc<Order>(ORDERS_COLLECTION, order);
  return createdOrder;
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const orderSnap = await getDoc(orderRef);

    if (orderSnap.exists()) {
      return { id: orderSnap.id, ...orderSnap.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    return null;
  }
}

/**
 * Get order by payment intent ID
 */
export async function getOrderByPaymentIntentId(
  paymentIntentId: string
): Promise<Order | null> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, where("paymentIntentId", "==", paymentIntentId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Order;
    }
    return null;
  } catch (error) {
    console.error("Error getting order by payment intent:", error);
    return null;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<void> {
  const updateData: Partial<Order> = {
    status,
    updatedAt: Timestamp.now(),
  };

  // Add timestamp for specific status changes
  if (status === "paid") {
    updateData.paidAt = Timestamp.now();
  } else if (status === "shipped") {
    updateData.shippedAt = Timestamp.now();
  } else if (status === "delivered") {
    updateData.deliveredAt = Timestamp.now();
  }

  await updateDoc(`${ORDERS_COLLECTION}/${orderId}`, updateData);
}

/**
 * Update order with payment intent ID
 */
export async function updateOrderPaymentIntent(
  orderId: string,
  paymentIntentId: string
): Promise<void> {
  await updateDoc(`${ORDERS_COLLECTION}/${orderId}`, {
    paymentIntentId,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Get all orders (for admin)
 */
export async function getAllOrders(limit?: number): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = limit
      ? query(ordersRef, orderBy("createdAt", "desc"))
      : query(ordersRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Order)
    );
  } catch (error) {
    console.error("Error getting all orders:", error);
    return [];
  }
}

/**
 * Get orders by user ID
 */
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Order)
    );
  } catch (error) {
    console.error("Error getting user orders:", error);
    return [];
  }
}

/**
 * Get orders by email (for guest checkouts)
 */
export async function getOrdersByEmail(email: string): Promise<Order[]> {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(
      ordersRef,
      where("shippingInfo.email", "==", email),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Order)
    );
  } catch (error) {
    console.error("Error getting orders by email:", error);
    return [];
  }
}
