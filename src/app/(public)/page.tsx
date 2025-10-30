"use client";

import Link from "next/link";
import {
  Card,
  CardBody,
  Divider,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  ArrowRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import DescribeDesignForm from "@/components/forms/DescribeDesignForm";
import CanvasModel from "@/components/canvas";
import { Product } from "@/types/product.types";
import { useEffect, useState } from "react";
import products from "@/products";
import {
  trackCustomizeDesignClick,
  trackPageView,
  trackPurchaseComplete,
} from "@/lib/firebase/analytics";
import { useSearchParams, useRouter } from "next/navigation";
import { useCheckoutContext } from "@/components/contexts/AppContext/CheckoutContext";

export default function Page() {
  const desings = products["sadez-zelenjava"].designs.slice(0, 3);
  const [selectedDesign] = useState<string>(desings[0].imageUrl);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [paymentStatus, setPaymentStatus] = useState<
    "success" | "error" | null
  >(null);
  const { item, totalAmount, totalQuantity } = useCheckoutContext();

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
          backgroundImage: "url('/assets/bg.png')",
          backgroundBlendMode: "overlay",
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
              <DescribeDesignForm />
              {/* <div className="flex flex-row gap-4">
                <Button
                  className="mt-4 text-primary-900 bg-white text-sm font-semibold"
                  size="md"
                  variant="bordered"
                  color="primary"
                  isDisabled
                  startContent={
                    <TagIcon weight="bold" className="w-6 h-6 text-primary" />
                  }
                >
                  Enotna cena 19.99€
                </Button>
                <Button
                  className="mt-4 text-900 bg-white text-sm"
                  size="md"
                  variant="bordered"
                  color="primary"
                  startContent={
                    <PackageIcon
                      weight="fill"
                      className="w-6 h-6  text-primary"
                    />
                  }
                >
                  Breplačna pošitnina za 2+ kosa
                </Button>
              </div> */}
            </div>
            <div className="w-full lg:flex-1 flex justify-center items-center overflow-hidden lg:mt-0 mt-10">
              <div className="w-full min-w-[500px] max-w-[700px] aspect-square relative">
                <CanvasModel
                  product={Product.Shirt}
                  color="#fff"
                  frontPatternUrl={selectedDesign}
                />
              </div>
              {/* <div className="flex flex-row gap-4 max-w-[55%]">
                {desings.map((design) => (
                  <DesignCard
                    key={design.imageUrl}
                    title={design.title}
                    isSelected={selectedDesign === design.imageUrl}
                    designUrl={design.imageUrl}
                    handleDesignSelect={setSelectedDesign}
                  />
                ))}
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="produkti" className="py-8 lg:py-20 bg-white">
        <div className="container mx-auto px-4 sm:text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Personaliziraj obstoječi motiv
          </h2>
          <p className="text-xl font-bold text-primary-900 mb-8 lg:mb-20 mx-auto">
            Izberi motiv iz naše galerije in ga prilagodi svojim željam.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              products["sadez-zelenjava"],
              products["silhueta-zivali"],
              products["rojstni-dan-prometni-znak-in-ime"],
            ].map((product) => (
              <Card
                key={product.id}
                className="bg-white hover:bg-white group text-start"
                isPressable
                shadow="md"
                as={Link}
                href={product.slug}
                onPress={() =>
                  trackCustomizeDesignClick(product.id, product.name)
                }
              >
                <Image
                  isZoomed
                  src={product.designs[0].imageUrl}
                  alt={product.name}
                  className="object-cover"
                />
                <Divider />
                <CardBody className="px-4 pt-4 pb-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-semibold mb-2 text-primary-900 group-hover:text-primary">
                      {product.shortName}
                    </h3>
                    <p className="text-primary-900">{product.description}</p>
                  </div>
                  <div className="flex items-center justify-end mt-3">
                    <span className="flex flex-row items-center gap-2 text-primary text-sm">
                      Personaliziraj
                      <ArrowRightIcon />
                    </span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-default-50 text-default-900 py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Kontakt</h3>
              <div className="text-primary-900 space-y-2">
                <p>info@moj-motiv.si</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Pravne informacije</h3>
              <div className="space-y-2">
                <Link
                  href="/politika-zasebnosti"
                  className="block text-default-900 hover:text-primary transition-colors"
                >
                  Politika zasebnosti
                </Link>
                <Link
                  href="/pogoji-uporabe"
                  className="block text-default-900 hover:text-primary transition-colors"
                >
                  Pogoji uporabe
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-default-900">
            <p>&copy; 2025 Moj Motiv. Vse pravice pridržane.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
