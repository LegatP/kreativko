# Order Creation Before Payment - Implementation Summary

## Overview
This implementation creates orders in Firestore **before** payment confirmation and passes the `orderId` to Stripe for better tracking and reconciliation.

## Changes Made

### 1. Orders Database Structure (`/src/db/orders/`)

#### `/src/db/orders/types.ts`
- **OrderItem**: Product details with quantities per size
- **ShippingInfo**: Customer contact and delivery information
- **OrderStatus**: Enum for order lifecycle states (pending, paid, processing, shipped, delivered, cancelled, failed)
- **Order**: Complete order document structure with timestamps

#### `/src/db/orders/index.ts`
Functions for order management:
- `createOrder()`: Creates a new order with auto-generated order number
- `getOrderById()`: Retrieve order by ID
- `getOrderByPaymentIntentId()`: Find order using Stripe payment intent ID
- `updateOrderStatus()`: Update order status with automatic timestamps
- `updateOrderPaymentIntent()`: Link payment intent ID to order
- `getAllOrders()`: Admin function to list all orders
- `getOrdersByUserId()`: Get orders for logged-in users
- `getOrdersByEmail()`: Get orders for guest checkouts

### 2. Payment Intent API (`/src/app/api/create-payment-intent/route.ts`)

**Changes:**
- Now accepts `orderId` in request body
- Adds `orderId` to Stripe payment intent metadata
- Returns both `client_secret` and `payment_intent_id`

**Benefits:**
- Order and payment are linked in Stripe dashboard
- Easy reconciliation between Firestore orders and Stripe payments
- Webhook handlers can easily find associated order

### 3. CheckoutDrawer Component (`/src/components/layout/CheckoutDrawer/CheckoutDrawer.tsx`)

**New State:**
- `orderId`: Tracks the created order ID throughout the payment flow

**New Function: `createOrderAndPaymentIntent()`**
Replaces `createPaymentIntent()` with enhanced logic:

1. **Creates order in Firestore** with status "pending"
2. **Creates Stripe payment intent** with orderId in metadata
3. **Updates order** with payment intent ID for bi-directional linking
4. **Handles errors** with user-friendly messages

**Flow:**
```
Step 1: Order Review
  ↓
Step 2: Contact & Delivery Info → createOrderAndPaymentIntent()
  ↓
Step 3: Payment → handlePayment(orderId)
```

### 4. PaymentForm Component (`/src/components/forms/PaymentForm/PaymentForm.tsx`)

**No changes required** - Already configured to accept `orderId` parameter in the `handleSubmit()` method and pass it in payment metadata.

## Order Lifecycle

### 1. Order Creation (Step 2 → Step 3)
```typescript
const order = await createOrder({
  items: [...],
  shippingInfo: {...},
  totalAmount: 25.99,
  status: "pending"
});
// order.id = "abc123"
// order.orderNumber = "ORD-2024-1234567890-123"
```

### 2. Payment Intent Creation
```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2599, // cents
  currency: "eur",
  metadata: {
    orderId: "abc123"
  }
});
```

### 3. Order Update with Payment Intent
```typescript
await updateOrderPaymentIntent("abc123", paymentIntent.id);
```

### 4. Payment Confirmation (via Stripe)
When user completes payment, Stripe includes metadata in webhook:
```typescript
// In webhook handler (to be implemented)
const orderId = paymentIntent.metadata.orderId;
await updateOrderStatus(orderId, "paid");
```

## Benefits

### 1. **Better Order Tracking**
- Orders exist even if payment fails
- Can track abandoned payments
- Customer service can reference orders before payment

### 2. **Stripe Integration**
- Order ID visible in Stripe dashboard
- Easy reconciliation
- Webhook handlers can update correct order

### 3. **Analytics**
- Track conversion from order creation to payment
- Identify payment failures
- Measure checkout abandonment accurately

### 4. **Customer Support**
- Orders queryable by email (guest checkout)
- Full order history with status updates
- Clear audit trail with timestamps

## Database Structure

### Firestore Collection: `orders`
```
orders/
  ├── {orderId1}/
  │   ├── orderNumber: "ORD-2024-..."
  │   ├── items: [...]
  │   ├── shippingInfo: {...}
  │   ├── status: "paid"
  │   ├── paymentIntentId: "pi_..."
  │   ├── createdAt: Timestamp
  │   ├── paidAt: Timestamp
  │   └── ...
  ├── {orderId2}/
  └── ...
```

## Next Steps (Recommended)

1. **Webhook Handler**: Create `/api/webhooks/stripe` to handle payment events
   - Update order status to "paid" on `payment_intent.succeeded`
   - Update to "failed" on `payment_intent.payment_failed`

2. **Admin Order Management**: 
   - View orders in `/admin/orders`
   - Update order status (processing, shipped, delivered)
   - Filter by status, date, customer

3. **Customer Order Tracking**:
   - Add "My Orders" page for logged-in users
   - Email order confirmation with order number
   - Order status tracking page

4. **Error Recovery**:
   - Handle failed order creation
   - Retry logic for payment intent creation
   - Cleanup pending orders after timeout

## Security Considerations

- ✅ Orders created only after form validation
- ✅ Payment intent linked to specific order
- ✅ Order status prevents duplicate payments
- ⚠️ TODO: Add user authentication checks
- ⚠️ TODO: Validate order ownership before updates

## Testing Checklist

- [ ] Create order successfully with valid data
- [ ] Payment intent receives orderId
- [ ] Order updates with payment intent ID
- [ ] Error handling for failed order creation
- [ ] Error handling for failed payment intent
- [ ] Order cleanup on checkout cancellation
- [ ] Multiple orders don't interfere
- [ ] Order number uniqueness
- [ ] Timestamp fields populate correctly
