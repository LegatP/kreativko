import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getOrder } from "@/db/orders";
import { calculateItemPrice } from "@/utils/pricing.utils";
import { SHIPPING } from "@/config/shipping";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    // Fetch order from database
    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Recalculate price server-side to prevent manipulation
    let subtotal = 0;
    for (const item of order.items) {
      const totalQuantity = Object.values(item.quantities).reduce(
        (a, b) => a + b,
        0
      );
      const pricePerItem = calculateItemPrice(
        { basePrice: item.pricing.basePrice, printPositionPrice: item.pricing.printPositionPrice },
        item.designUrls
      );
      subtotal += pricePerItem * totalQuantity;
    }

    const shippingCost = order.shippingCost > 0 ? SHIPPING.baseCost : 0;
    const totalAmount = subtotal + shippingCost;

    // totalAmount is already in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: "eur",
      metadata: {
        orderId,
      },
      payment_method_types: ["card"],
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
