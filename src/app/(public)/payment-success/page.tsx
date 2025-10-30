"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, Button } from "@heroui/react";
import { CheckCircleIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { trackPurchaseComplete } from "@/lib/firebase/analytics";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const { item, totalAmount, totalQuantity } = useCheckoutContext();
  const [paymentStatus, setPaymentStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );
    const paymentIntent = searchParams.get("payment_intent");

    if (paymentIntentClientSecret && paymentIntent) {
      // Track successful purchase
      trackPurchaseComplete(
        paymentIntent,
        totalAmount,
        item.productId,
        item.name,
        totalQuantity
      );

      // You can verify the payment status with Stripe here if needed
      setPaymentStatus("success");
    } else {
      setPaymentStatus("error");
    }
  }, [searchParams, item, totalAmount, totalQuantity]);

  if (paymentStatus === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (paymentStatus === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardBody className="text-center space-y-4">
            <div className="text-red-500">
              <svg
                className="w-16 h-16 mx-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
            <p className="text-gray-600">
              There was an issue processing your payment.
            </p>
            <Link href="/">
              <Button color="primary" variant="shadow">
                Return Home
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md mx-auto">
        <CardBody className="text-center space-y-6">
          <div className="text-green-500">
            <CheckCircleIcon className="w-16 h-16 mx-auto" weight="fill" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600">
              Thank you for your order. You will receive a confirmation email
              shortly.
            </p>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <Button color="primary" variant="shadow" fullWidth>
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="ghost" fullWidth>
                View Orders
              </Button>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
