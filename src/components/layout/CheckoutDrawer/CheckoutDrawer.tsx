"use client";

import ContactInfo from "@/components/checkout/ContactInfo";
import Delivery from "@/components/checkout/Delivery";
import ProductsOverview from "@/components/checkout/ProductsOverview";
import { useAppStateContext } from "@/components/contexts/AppContext";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";
import { getProductsFromConfig } from "@/utils/checkout.utils";
import {
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Spacer,
  Textarea,
} from "@heroui/react";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";

const motionProps = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: { duration: 0.25 },
};

export default function CheckoutDrawer() {
  const { isOpen, onOpenChange, onClose } = useCheckoutContext();
  const { state, setCurrentProductConfig, currentProductConfig } =
    useAppStateContext();
  const [step, setStep] = React.useState(1);

  function onBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function onNext() {
    setStep((s) => s + 1);
  }

  function onOpenChangePrivate(isOpen: boolean) {
    if (!isOpen) {
      setStep(1);
    }
    onOpenChange(isOpen);
  }

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChangePrivate}
      size="sm"
      backdrop="blur"
    >
      <DrawerContent>
        {(onClose) => (
          <>
            <DrawerHeader className="flex flex-col gap-1 bg-content2">
              {step === 1 ? "Pregled naročila" : "Podatki za naročilo"}
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
                      //@ts-expect-error --- IGNORE ---
                      products={getProductsFromConfig(state)}
                      onSizeChange={(_, size, value) =>
                        //@ts-expect-error --- IGNORE ---
                        setCurrentProductConfig({
                          ...currentProductConfig,
                          sizes: {
                            ...currentProductConfig.sizes,
                            [size]: value,
                          },
                        })
                      }
                    />
                    <Spacer y={4} />
                    <Textarea
                      label="Opombe"
                      placeholder="Vnesite dodatne informacije glede naročila"
                    />
                  </motion.div>
                )}
                {step === 2 && (
                  <motion.div key="step2" {...motionProps}>
                    <ContactInfo />
                    <Spacer y={4} />
                    <Divider />
                    <Spacer y={8} />
                    <Delivery />
                  </motion.div>
                )}
              </AnimatePresence>
              {/* <Divider /> */}
              {/* <Delivery /> */}
            </DrawerBody>
            <DrawerFooter className="flex flex-col gap-2">
              <Button
                color="primary"
                fullWidth
                className="text-white font-bold"
                variant="shadow"
                onPress={onNext}
              >
                {step === 1 ? "Naprej" : "Zaključi nakup"}
              </Button>
              <Button
                color="primary"
                fullWidth
                className="font-bold"
                variant="light"
                onPress={step === 1 ? onClose : onBack}
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
