"use client";

import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCheckoutContext } from "@/components/contexts/CheckoutContext";
import {
  HeroSection,
  HowItWorksSection,
  CategoriesSection,
  PaymentStatusModal,
} from "@/components/sections";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "error" | null
  >(null);
  const { item, totalAmount, totalQuantity } = useCheckoutContext();

  useEffect(() => {
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );
    const redirectStatus = searchParams.get("redirect_status");

    if (paymentIntent && paymentIntentClientSecret) {
      setPaymentStatus("success");
      onOpen();
      router.replace("/", { scroll: false });
    } else if (redirectStatus === "failed") {
      setPaymentStatus("error");
      onOpen();
      router.replace("/", { scroll: false });
    }
  }, [searchParams, onOpen, router, item, totalAmount, totalQuantity]);

  const handleCloseModal = () => {
    setPaymentStatus(null);
    onClose();
  };

  return (
    <div className="min-h-screen">
      <PaymentStatusModal
        isOpen={isOpen}
        onClose={handleCloseModal}
        status={paymentStatus}
      />
      <HeroSection />
      <HowItWorksSection />
      <CategoriesSection />
    </div>
  );
}
