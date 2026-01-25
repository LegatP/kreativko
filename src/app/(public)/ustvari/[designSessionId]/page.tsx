"use client";

import { useEffect, useRef, useState } from "react";
import { Product } from "@/types/product.types";
import CanvasModel from "@/components/canvas";
import { useCheckoutContext } from "@/components/contexts/CheckoutContext";
import ProductPageLayout from "@/components/layout/ProductPageLayout";
import ProductCustomization from "@/components/ProductConfigurator/ProductCustomization";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { garment } from "@/config/garment";
import { PrintPosition } from "@/types/pricing.types";
import { getPriceBreakdown } from "@/utils/pricing.utils";
import { deleteField } from "firebase/firestore";
import ProductDesignCreation, {
  ProductDesignCreationRef,
} from "@/components/features/product/ProductSelection/ProductDesignCreation";
import {
  useDesignSessionListener,
  updateDesignSession,
} from "@/db/design-sessions";
import CreateDesignModal from "@/components/features/wizard/CreateDesignModal";
import PreviewToolbar from "@/components/canvas/PreviewToolbar";
import { useCanvasControls } from "@/components/canvas/useCanvasControls";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const designSessionId = useParams()?.designSessionId as string;
  const showWizard = searchParams.get("ustvari") === "true";
  const createPromptRef = useRef<ProductDesignCreationRef>(null);

  const [isWizardOpen, setIsWizardOpen] = useState(showWizard);
  const { view: shirtView, toggleView: toggleShirtView } = useCanvasControls();

  const {
    onOpen: openCheckout,
    productsAmount,
    item,
    setItem,
  } = useCheckoutContext();
  const productId = "ustvari-svoj-motiv";
  const productName = "Ustvari svoj motiv";

  const [data] = useDesignSessionListener(designSessionId);

  const [isInitialized, setIsInitialized] = useState(false);
  const prevSessionIdRef = useRef(designSessionId);
  const { designUrls, quantities, color } = item;
  const prevDesignUrlsRef = useRef(designUrls);
  // Track positions being removed to prevent sync-from-server from re-adding them
  const removingPositionsRef = useRef<Set<PrintPosition>>(new Set());

  // Reset initialization when session ID changes (navigating to different session)
  useEffect(() => {
    if (prevSessionIdRef.current !== designSessionId) {
      setIsInitialized(false);
      prevSessionIdRef.current = designSessionId;
    }
  }, [designSessionId]);

  // Initialize checkout item from session data (only once per session)
  useEffect(() => {
    if (!data || isInitialized) return;

    setIsInitialized(true);

    const sizes = garment.sizes;
    const initQuantities = Object.fromEntries(sizes.map((size: string) => [size, 0]));
    const initDesignUrls = data.designUrls || {};
    const breakdown = getPriceBreakdown(garment.pricing, initDesignUrls);

    setItem({
      productId,
      name: productName,
      color: garment.colors[0].hex,
      designUrls: initDesignUrls,
      quantities: initQuantities,
      pricing: {
        garmentType: garment.type,
        basePrice: breakdown.basePrice,
        printPositionPrice: breakdown.printPositionPrice,
        numberOfPrintPositions: breakdown.numberOfPrintPositions,
        pricePerItem: breakdown.totalPerItem,
      },
    });
  }, [data, setItem, designSessionId, isInitialized]);

  // Sync designUrls FROM Firestore when they change (after initialization)
  useEffect(() => {
    if (!data || !isInitialized) return;

    // If Firestore has design URLs that we don't have locally, update
    const serverUrls = data.designUrls || {};

    // Clear removing flags once server reflects the removal
    if (!serverUrls.front) {
      removingPositionsRef.current.delete("front");
    }
    if (!serverUrls.back) {
      removingPositionsRef.current.delete("back");
    }

    // Use functional update to compare with current state (avoids stale closure)
    setItem((currentItem) => {
      const currentUrls = currentItem.designUrls;

      // Check if server has new designs we don't have
      // Skip positions that are being removed locally (prevents race condition)
      const serverHasNewFront =
        serverUrls.front &&
        serverUrls.front !== currentUrls.front &&
        !removingPositionsRef.current.has("front");
      const serverHasNewBack =
        serverUrls.back &&
        serverUrls.back !== currentUrls.back &&
        !removingPositionsRef.current.has("back");

      if (!serverHasNewFront && !serverHasNewBack) {
        return currentItem; // No change needed
      }

      return {
        ...currentItem,
        designUrls: {
          ...currentUrls,
          ...(serverHasNewFront ? { front: serverUrls.front } : {}),
          ...(serverHasNewBack ? { back: serverUrls.back } : {}),
        },
      };
    });
  }, [data, setItem, isInitialized]);

  useEffect(() => {
    // Skip if not initialized yet
    if (!data || !isInitialized) return;

    // Only sync if local designUrls actually changed (user action)
    const prevUrls = prevDesignUrlsRef.current;
    if (
      prevUrls.front === designUrls.front &&
      prevUrls.back === designUrls.back
    ) {
      return;
    }

    prevDesignUrlsRef.current = designUrls;

    // Build update object using dot notation for deleteField() to work at top level
    const updateData: Record<string, string | ReturnType<typeof deleteField>> =
      {};

    if (designUrls.front) {
      updateData["designUrls.front"] = designUrls.front;
    } else if (prevUrls.front) {
      // Was set before, now removed - use deleteField
      updateData["designUrls.front"] = deleteField();
    }

    if (designUrls.back) {
      updateData["designUrls.back"] = designUrls.back;
    } else if (prevUrls.back) {
      // Was set before, now removed - use deleteField
      updateData["designUrls.back"] = deleteField();
    }

    updateDesignSession(designSessionId, updateData);
  }, [designUrls, data, designSessionId, isInitialized]);

  // Wait for both data AND initialization to complete
  // This prevents the old designUrls from checkout context being rendered
  if (!data || !isInitialized) return null;

  const onDesignSelect = (position: PrintPosition, imageUrl: string) => {
    setItem((i) => ({
      ...i,
      designUrls: { ...i.designUrls, [position]: imageUrl },
    }));
  };

  const hasAnyDesign = designUrls.front || designUrls.back;

  const handleWizardClose = () => {
    setIsWizardOpen(false);
    if (showWizard) {
      router.replace(pathname);
    }
  };

  const handleRemoveDesign = (position: PrintPosition) => {
    // Mark position as being removed to prevent sync-from-server race condition
    removingPositionsRef.current.add(position);
    setItem((i) => ({
      ...i,
      designUrls: { ...i.designUrls, [position]: undefined },
    }));
  };

  return (
    <>
      <CreateDesignModal
        isOpen={isWizardOpen}
        onClose={handleWizardClose}
        sessionId={designSessionId}
      />
      <ProductPageLayout
        title="Ustvari svoj motiv"
        description="Opiši željen motiv, dodaj slike in ustvari svoj unikatni motiv."
        leftColumn={
          <>
            <ProductDesignCreation
              designSession={data}
              ref={createPromptRef}
              onDesignSelect={onDesignSelect}
              onOpenWizard={() => {
                setIsWizardOpen(true);
              }}
              onRemoveDesign={handleRemoveDesign}
              designUrls={designUrls}
            />
            <ProductCustomization
              name="Ustvari svoj motiv"
              quantities={quantities}
              onColorChange={(c) => setItem({ ...item, color: c })}
              onSizeChange={(size, value) =>
                setItem({
                  ...item,
                  quantities: { ...quantities, [size]: value },
                })
              }
              productsAmount={productsAmount}
              onCheckout={openCheckout}
              productId={productId}
              color={color}
              isCheckoutDisabled={!hasAnyDesign || productsAmount === 0}
            />
          </>
        }
        rightColumn={
          <div className="w-full max-w-full flex flex-col gap-2 sm:gap-4 md:gap-6 lg:relative pb-2 sm:pb-0">
            <div className="aspect-square w-full -mb-12 sm:mb-0">
              <CanvasModel
                product={Product.Shirt}
                color={color}
                frontPatternUrl={designUrls.front}
                backPatternUrl={designUrls.back}
                view={shirtView}
              />
            </div>
            <PreviewToolbar onRotate={toggleShirtView} />
          </div>
        }
      />
    </>
  );
}
