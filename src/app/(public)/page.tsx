"use client";

import {
  Card,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  CardBody,
} from "@heroui/react";
import {
  CheckCircleIcon,
  PackageIcon,
  PaintBrushIcon,
  PrinterIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import CanvasModel from "@/components/canvas";
import { Product } from "@/types/product.types";
import { useEffect, useState } from "react";
import { trackPageView, trackPurchaseComplete } from "@/lib/firebase/analytics";
import { useSearchParams, useRouter } from "next/navigation";
import { useCheckoutContext } from "@/components/contexts/CheckoutContext";
import { useCreateDesignContext } from "@/components/contexts/CreateDesignContext";

export default function Page() {
  const [selectedDesign] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "error" | null
  >(null);
  const { item, totalAmount, totalQuantity } = useCheckoutContext();
  const { openModal } = useCreateDesignContext();

  useEffect(() => {
    // Track landing page view
    trackPageView("Landing Page", window.location.href);

    // Check for payment status in URL
    const paymentIntent = searchParams.get("payment_intent");
    const paymentIntentClientSecret = searchParams.get(
      "payment_intent_client_secret"
    );
    const redirectStatus = searchParams.get("redirect_status");

    // Stripe redirects with payment_intent and payment_intent_client_secret on success
    if (paymentIntent && paymentIntentClientSecret) {
      // Track successful purchase with Google Analytics
      trackPurchaseComplete(
        paymentIntent,
        totalAmount,
        item.productId,
        item.name,
        totalQuantity
      );

      setPaymentStatus("success");
      onOpen();

      // Clean up URL by removing payment parameters
      router.replace("/", { scroll: false });
    } else if (redirectStatus === "failed") {
      // Stripe adds redirect_status=failed on payment failure
      setPaymentStatus("error");
      onOpen();

      // Clean up URL by removing payment parameter
      router.replace("/", { scroll: false });
    }
  }, [searchParams, onOpen, router, item, totalAmount, totalQuantity]);

  const handleCloseModal = () => {
    setPaymentStatus(null);
    onClose();
  };

  return (
    <div className="min-h-screen">
      {/* Payment Status Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="md">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {paymentStatus === "success"
                  ? "Plačilo uspešno!"
                  : "Plačilo neuspešno"}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div
                    className={
                      paymentStatus === "success"
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  >
                    {paymentStatus === "success" ? (
                      <CheckCircleIcon className="w-16 h-16" weight="fill" />
                    ) : (
                      <XCircleIcon className="w-16 h-16" weight="fill" />
                    )}
                  </div>
                  <p className="text-gray-600">
                    {paymentStatus === "success"
                      ? "Hvala za vaše naročilo! Ko bo naročilo predano dostavni službi boste prejeli elektronsko sporočilo."
                      : "Pri obdelavi vašega plačila je prišlo do težave. Prosimo, poskusite znova."}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  className="text-white"
                  onPress={onClose}
                >
                  Zapri
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <section
        className="bg-primary-50 pt-8 lg:pt-20"
        style={{
          backgroundImage: "url('/assets/bg-transparent.png')",
        }}
      >
        <div className="container mx-auto sm:text-center max-w-7xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-3 lg:mb-6 w-full px-4">
            Ustvari svojo unikatno majico
          </h1>
          <p className="text-xl md:text-2xl font-bold text-primary-900 w-full px-4">
            Opiši motiv. Izberi velikost in barvo. Naroči.
          </p>
          <div className="flex items-center lg:items-start flex-col lg:flex-row mt-8">
            <div className="w-full sm:max-w-md md:mt-7 lg:mt-22 px-4">
              <Card
                shadow="sm"
                className="border-1 border-primary p-2 py-5 px-6"
              >
                <CardBody className="flex flex-col items-center gap-4 p-4">
                  <p className="text-primary-900 text-center">
                    Ustvari unikaten motiv v nekaj korakih. Izberi iz galerije,
                    opiši svojo idejo ali naloži sliko.
                  </p>
                  <Button
                    color="primary"
                    size="lg"
                    className="text-white font-bold w-full"
                    startContent={<PaintBrushIcon weight="bold" size={24} />}
                    onPress={openModal}
                  >
                    Ustvari Motiv
                  </Button>
                </CardBody>
              </Card>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  className="mt-4 text-primary-900 bg-white text-xs font-semibold hover:cursor-default"
                  size="md"
                  variant="bordered"
                  color="primary"
                  disableRipple
                  disableAnimation
                  startContent={
                    <PrinterIcon
                      weight="bold"
                      className="w-5 h-5 text-primary"
                    />
                  }
                >
                  Kakovosten tisk
                </Button>
                <Button
                  className="sm:mt-4 text-900 bg-white hover:cursor-default"
                  size="md"
                  variant="bordered"
                  color="primary"
                  disableRipple
                  disableAnimation
                  startContent={
                    <PackageIcon
                      weight="fill"
                      className="w-5 h-5  text-primary"
                    />
                  }
                >
                  <span className="text-primary-900 font-semibold text-xs">
                    Brezplačna poštnina nad 50€
                  </span>
                </Button>
              </div>
            </div>
            <div className="w-full lg:flex-1 flex justify-center items-center overflow-hidden lg:mt-0 mt-10">
              <div className="w-full min-w-[500px] max-w-[700px] aspect-square relative">
                <CanvasModel
                  product={Product.Shirt}
                  color="#fff"
                  frontPatternUrl={selectedDesign}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
