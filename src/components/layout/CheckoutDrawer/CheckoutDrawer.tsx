"use client";

import ContactInfo from "@/components/checkout/ContactInfo";
import Delivery from "@/components/checkout/Delivery";
import {
  BASE_PRODUCT_PRICE,
  useCheckoutContext,
} from "@/components/contexts/AppContext/CheckoutContext";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Spacer,
} from "@heroui/react";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "@/components/forms/PaymentForm/PaymentForm";
import ProductsOverview from "@/components/checkout/ProductsOverview";
import {
  trackCheckoutStep,
  trackContactInfoCompleted,
  trackPaymentInitiated,
  trackCheckoutAbandoned,
  trackCashOnDeliverySelected,
} from "@/lib/firebase/analytics";
import { PackageIcon } from "@phosphor-icons/react";
import { createOrder, updateOrderPaymentIntent } from "@/db/orders";
import type { Order } from "@/db/orders/types";

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const motionProps = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.25 },
};

// Payment form component

export default function CheckoutDrawer() {
  const {
    isOpen,
    onOpenChange,
    setShippingInfo,
    shippingInfo: {
      firstName,
      lastName,
      email,
      phoneNumber,
      postalCode,
      city,
      address,
    },
    totalAmount,
    item,
    setItem,
    totalQuantity,
    isWithShipping,
    onClose,
  } = useCheckoutContext();
  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
  const paymentFormRef = React.useRef<{
    handleSubmit: (orderId: string) => Promise<void>;
  } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isCashOnDelivery, setIsCashOnDelivery] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Track when drawer opens
  useEffect(() => {
    if (isOpen) {
      const stepTitle = getStepTitle();
      trackCheckoutStep(step, stepTitle);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, step]);

  function onBack() {
    if (step === 1) {
      onClose();
    } else {
      setStep((s) => Math.max(s - 1, 1));
    }
  }

  function onCashOnDelivery() {
    // Handle cash on delivery option
    trackCashOnDeliverySelected();
    setIsCashOnDelivery(true);
  }

  async function onNext() {
    if (step === 2) {
      setFormError(null);
      const isFormValid = [
        firstName,
        lastName,
        email,
        phoneNumber,
        postalCode,
        city,
        address,
      ].every((field) => field && field.trim() !== "");

      if (!isFormValid) {
        setFormError("Prosimo, izpolnite vsa polja.");
        return;
      }

      // Track contact info completion
      trackContactInfoCompleted();

      // Create order before payment
      await createOrderAndPaymentIntent();
    }

    setStep((s) => s + 1);

    // Track the new step
    trackCheckoutStep(step + 1, getStepTitle());
  }

  const createOrderAndPaymentIntent = async () => {
    setIsCreatingPaymentIntent(true);

    // Track payment initiation
    trackPaymentInitiated(totalAmount);

    try {
      // Create order first
      const orderData: Omit<
        Order,
        "id" | "orderNumber" | "createdAt" | "updatedAt"
      > = {
        items: [
          {
            productId: item.productId,
            name: item.name,
            designUrl: item.designUrl,
            color: item.color,
            quantities: item.quantities,
            price: BASE_PRODUCT_PRICE,
          },
        ],
        shippingInfo: {
          firstName,
          lastName,
          email,
          phoneNumber,
          address,
          city,
          postalCode,
          country: "Slovenija",
        },
        totalAmount,
        shippingCost: totalQuantity < 2 ? 3.99 : 0,
        subtotal: totalAmount - (totalQuantity < 2 ? 3.99 : 0),
        status: "pending",
      };

      const createdOrder = await createOrder(orderData);
      setOrderId(createdOrder.id!);

      // Create payment intent with orderId
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // amount in cents
          orderId: createdOrder.id,
        }),
      });

      const { client_secret, payment_intent_id } = await response.json();
      setClientSecret(client_secret);

      // Update order with payment intent ID
      if (createdOrder.id && payment_intent_id) {
        await updateOrderPaymentIntent(createdOrder.id, payment_intent_id);
      }
    } catch (error) {
      console.error("Error creating order and payment intent:", error);
      setFormError(
        "Napaka pri ustvarjanju naročila. Prosimo poskusite ponovno."
      );
    } finally {
      setIsCreatingPaymentIntent(false);
    }
  };

  function onOpenChangePrivate(isOpen: boolean) {
    if (!isOpen) {
      // Track checkout abandonment if user closes without completing
      if (step < 3 || !clientSecret) {
        trackCheckoutAbandoned(step, getStepTitle(), totalAmount);
      }

      setStep(1);
      setClientSecret(null);
      setIsCreatingPaymentIntent(false);
      setOrderId(null);
    }
    onOpenChange(isOpen);
  }

  const handlePayment = async () => {
    if (orderId) {
      paymentFormRef.current?.handleSubmit(orderId);
    } else {
      console.error("No orderId available for payment");
      setFormError("Napaka: ID naročila ni na voljo");
    }
  };

  function getStepTitle() {
    switch (step) {
      case 1:
        return "Pregled naročila";
      case 2:
        return "Podatki za dostavo";
      case 3:
        return "Zaključek nakupa";
      default:
        return "";
    }
  }

  const overviewItems = useMemo(() => {
    const { quantities, name } = item;
    return [
      // Example items - replace with actual cart items
      {
        name,
        sizes: quantities,
        imageUrl: item.designUrl,
        id: item.productId,
        price: BASE_PRODUCT_PRICE,
      },
    ];
  }, [item]);

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChangePrivate}
      size="sm"
      backdrop="blur"
    >
      <DrawerContent>
        {() => (
          <>
            <DrawerHeader className="flex flex-col gap-1 bg-content2">
              {getStepTitle()}
            </DrawerHeader>
            <Divider />
            <DrawerBody>
              {/* <ContactInfo /> */}
              {/* <Divider /> */}
              <Spacer y={2} />
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div key="step1" {...motionProps}>
                    <ProductsOverview
                      totalPrice={totalAmount}
                      products={overviewItems}
                      // TODO: improve this logic
                      withShipping={isWithShipping}
                      onSizeChange={(size, value) => {
                        setItem({
                          ...item,
                          quantities: {
                            ...item.quantities,
                            [size]: value,
                          },
                        });
                      }}
                    />
                    <Spacer y={4} />
                    {/* <Textarea
                      label="Opombe"
                      placeholder="Vnesite dodatne informacije glede naročila"
                    /> */}
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step2" {...motionProps}>
                    <ContactInfo />
                    <Spacer y={4} />
                    {/* <Divider />
                    <Spacer y={8} /> */}
                    <Delivery />
                    {formError && (
                      <p className="text-danger mt-2 text-sm">{formError}</p>
                    )}
                    {
                      // TODO-R: remove after testing??
                      process.env.NODE_ENV !== "production" && (
                        <button
                          className="mt-4 underline text-sm"
                          onClick={async () => {
                            // Autofill for testing
                            const testInfo = {
                              firstName: "Test",
                              lastName: "Uporabnik",
                              email: "test.uporabnik@example.com",
                              phoneNumber: "040123456",
                              address: "Testna Ulica 1",
                              city: "Ljubljana",
                              postalCode: "1000",
                              country: "Slovenija",
                            };
                            setShippingInfo(testInfo);
                          }}
                        >
                          Autofill Test Data
                        </button>
                      )
                    }
                  </motion.div>
                )}
                {step === 3 && (
                  <motion.div key="step3" {...motionProps}>
                    <div>
                      {clientSecret && stripePromise && (
                        <>
                          <Elements
                            stripe={stripePromise}
                            options={{
                              clientSecret,
                              locale: "sl",
                              appearance: {
                                theme: "stripe",
                                variables: {
                                  // TODO: move to config
                                  colorPrimary: "#fc7b2a",
                                },
                              },
                            }}
                          >
                            <PaymentForm
                              ref={paymentFormRef}
                              name={`${firstName} ${lastName}`}
                              email={email}
                              phone={phoneNumber}
                              postalCode={postalCode}
                              city={city}
                              line1={address}
                              totalAmount={totalAmount}
                            />
                            <div className="mt-6"></div>
                          </Elements>
                          <Card
                            radius="none"
                            className="w-full rounded-[5px] bg-transparent p-0 text-[rgb(109,110,120)] hover:text-[rgb(40,40,40)] font-semibold -mt-4 cursor-pointer"
                            shadow="sm"
                            isPressable
                            onPress={onCashOnDelivery}
                          >
                            <CardBody className="py-4 px-4 text-sm flex flex-row gap-5 items-center opacity-75">
                              <PackageIcon className="w-6 h-6" />
                              Plačilo po povzetju
                            </CardBody>
                          </Card>
                          {isCashOnDelivery && (
                            <p className="mt-3 text-sm text-danger">
                              Plačilo po povzetju trenutno ni mogoče. Prosimo
                              izberite drug način plačila. Za nevščenosti se
                              opravičujemo.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </DrawerBody>
            <DrawerFooter className="flex flex-col gap-2">
              {step === 1 && (
                <Button
                  color="primary"
                  fullWidth
                  className="text-white font-bold"
                  variant="shadow"
                  onPress={onNext}
                >
                  Naprej na dostavo
                </Button>
              )}
              {step === 2 && (
                <Button
                  color="primary"
                  fullWidth
                  className="text-white font-bold"
                  variant="shadow"
                  onPress={onNext}
                  isLoading={isCreatingPaymentIntent}
                >
                  {isCreatingPaymentIntent
                    ? "Pripravljam plačilo..."
                    : "Naprej na plačilo"}
                </Button>
              )}
              {step === 3 && (
                <Button
                  color="primary"
                  fullWidth
                  className="text-white font-bold"
                  variant="shadow"
                  onPress={handlePayment}
                  isLoading={isCreatingPaymentIntent}
                >
                  Plačaj {totalAmount.toFixed(2)} €
                </Button>
              )}
              <Button
                color="primary"
                fullWidth
                className="font-bold"
                variant="light"
                onPress={onBack}
              >
                Nazaj
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
