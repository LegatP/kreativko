import { Timestamp } from "firebase/firestore";

export interface DesignUrls {
  front?: string;
  back?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  designUrls: DesignUrls;
  color: string;
  quantities: Record<string, number>; // { S: 1, M: 2, L: 1 }
  price?: number; // Price per design (optional, set at checkout)
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | "pending" // Order created, awaiting payment
  | "paid" // Payment confirmed
  | "processing" // Being prepared/printed
  | "shipped" // Order shipped
  | "delivered" // Order delivered
  | "cancelled" // Order cancelled
  | "failed"; // Payment failed

export interface Order {
  id: string;
  orderNumber: string; // Human-readable order number (e.g., "ORD-2024-001")
  userId?: string; // Optional: if user is logged in
  items: OrderItem[];
  shippingInfo: ShippingInfo;
  totalAmount: number;
  shippingCost: number;
  subtotal: number;
  status: OrderStatus;
  paymentIntentId?: string; // Stripe payment intent ID
  stripeMetadata?: Record<string, string>;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  paidAt?: Timestamp;
  shippedAt?: Timestamp;
  deliveredAt?: Timestamp;
}
