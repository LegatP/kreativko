"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import {
  ArrowLeftIcon,
  LightbulbFilamentIcon,
  SwatchesIcon,
} from "@phosphor-icons/react";
import BaseDesignModal from "@/components/features/product/ProductSelection/BaseDesignModal";
import PathCard from "./PathCard";
import TemplatesStep from "./steps/TemplatesStep";
import DescribeStep from "./steps/DescribeStep";
import UploadStep from "./steps/UploadStep";
import ProductDetailStep from "./steps/ProductDetailStep";
import { ImageSquareIcon } from "@phosphor-icons/react/dist/ssr";
import { type GenerationMode } from "@/hooks/useImageGeneration";
import { createDesignSession, updateDesignSession } from "@/db/design-sessions";
import { arrayUnion } from "@/lib/firebase/firestore";
import auth from "@/lib/firebase/auth";
import { useWizardNavigation } from "@/hooks/useWizardNavigation";
import { useCreateDesign } from "@/hooks/useCreateDesign";
import ROUTES from "@/utils/routes.utils";

type WizardPath = "templates" | "describe" | "upload";
type WizardStep =
  | "select-path"
  | "templates"
  | "templates-products"
  | "product-detail"
  | "describe"
  | "upload";

// Step history for back navigation
const STEP_HISTORY: Partial<Record<WizardStep, WizardStep | null>> = {
  "select-path": null,
  templates: "select-path",
  "templates-products": "templates",
  "product-detail": "templates-products",
  describe: "select-path",
  upload: "select-path",
};

// Step configuration for titles and subtitles
const STEP_CONFIG: Record<WizardStep, { title: string; subtitle?: string }> = {
  "select-path": {
    title: "Ustvari motiv",
    subtitle: "Do unikatnega motiva v nekaj korakih",
  },
  templates: { title: "Izberi kategorijo" },
  "templates-products": { title: "Izberi motiv" },
  "product-detail": { title: "Prilagodi motiv" },
  describe: { title: "Opiši svojo idejo" },
  upload: { title: "Naloži svojo sliko" },
};

interface CreateDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId?: string; // If undefined, creates new session
  onSessionCreated?: (sessionId: string) => void; // Called when new session is created (for redirect)
}

export default function CreateDesignModal({
  isOpen,
  onClose,
  sessionId,
  onSessionCreated,
}: CreateDesignModalProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { currentStep, setStep, goBack, reset, canGoBack } =
    useWizardNavigation({
      initialStep: "select-path" as WizardStep,
      stepHistory: STEP_HISTORY,
      onStepChange: (step, prevStep) => {
        // Clear related state when navigating back
        if (step === "templates-products" && prevStep === "product-detail") {
          setSelectedProductId(null);
        } else if (step === "templates" && prevStep === "templates-products") {
          setSelectedCategory(null);
        } else if (step === "select-path" && prevStep === "upload") {
          setUploadedFile(null);
        }
      },
    });

  // Use the unified hook for prompt-based design creation
  const { createDesign, isSubmitting } = useCreateDesign({
    generationDelay: 500,
    onBeforeRedirect: () => {
      resetState();
      onClose(); // Close modal before navigation
    },
    onSessionCreated,
  });

  // Helper to handle existing design selection (no generation needed)
  const handleDesignComplete = async (designUrl: string, title: string) => {
    const isNewSession = !sessionId;

    // Close modal immediately for instant feedback
    resetState();
    onClose();

    if (isNewSession) {
      // Create session and navigate
      const session = await createDesignSession({
        userId: auth.currentUser?.uid || "guest",
        uploadedAssets: [],
        createdDesigns: [{ title, url: designUrl }],
        designUrls: { front: designUrl },
      });

      router.replace(ROUTES.createDesign(session.id));
      onSessionCreated?.(session.id);
    } else {
      // Update existing session - real-time listener will sync the design
      await updateDesignSession(sessionId, {
        createdDesigns: arrayUnion({ title, url: designUrl }),
        designUrls: { front: designUrl },
      });
    }
  };

  const handleSelect = (path: WizardPath) => {
    if (path === "upload") {
      fileInputRef.current?.click();
    } else {
      setStep(path);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setStep("upload");
    }
    e.target.value = "";
  };

  const resetState = useCallback(() => {
    reset();
    setSelectedCategory(null);
    setSelectedProductId(null);
    setUploadedFile(null);
  }, [reset]);

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    setStep("templates-products");
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setStep("product-detail");
  };

  // Unified handler for prompt-based generation using the hook
  const handlePromptSubmit = (
    prompt: string,
    images?: File[],
    existingUrl?: string,
    mode?: GenerationMode
  ) => {
    createDesign({
      prompt,
      images,
      existingImageUrl: existingUrl,
      mode,
      sessionId,
    });
  };

  // Handler for selecting an existing design (no generation needed)
  const handleExistingDesignSubmit = (designUrl: string) => {
    handleDesignComplete(designUrl, "Izbran motiv");
  };

  // Templates path: user customizes a product and generates
  const handleProductCustomize = (
    prompt?: string,
    images?: File[],
    templateUrl?: string
  ) => {
    // Use edit mode for template customization (high fidelity to original)
    handlePromptSubmit(prompt || "", images, templateUrl, "edit");
  };

  // Templates path: user continues with existing design (no generation needed)
  const handleProductContinue = (designUrl: string) => {
    handleExistingDesignSubmit(designUrl);
  };

  // Upload path: user uploads an image with optional prompt
  const handleImageUpload = (
    file: File,
    prompt?: string,
    uploadedUrl?: string
  ) => {
    handlePromptSubmit(
      prompt || "Ustvari motiv za majico iz te slike.",
      [file],
      uploadedUrl
    );
  };

  const { title, subtitle } = STEP_CONFIG[currentStep];

  const renderStepContent = () => {
    switch (currentStep) {
      case "select-path":
        return (
          <div className="w-full space-y-4">
            <PathCard
              title="Izberi in prilagodi"
              description="Izberi obstoječi motivi in ga prilagodi po svojih željah"
              icon={<SwatchesIcon size={32} weight="duotone" />}
              onClick={() => handleSelect("templates")}
              className="md:min-h-[200px]"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PathCard
                title="Opiši idejo"
                description="Opiši svojo idejo in ustvari popolnoma unikaten motiv"
                icon={<LightbulbFilamentIcon size={32} weight="duotone" />}
                onClick={() => handleSelect("describe")}
              />

              <PathCard
                title="Naloži sliko"
                description="Naloži sliko obstoječega motiva, osebe ali risbe in jo prilagodi po svojih željah"
                icon={<ImageSquareIcon size={32} weight="duotone" />}
                onClick={() => handleSelect("upload")}
              />
            </div>
          </div>
        );

      case "templates":
        return <TemplatesStep onCategorySelect={handleCategorySelect} />;

      case "templates-products":
        return selectedCategory ? (
          <TemplatesStep
            selectedCategory={selectedCategory}
            onCategorySelect={handleCategorySelect}
            onProductSelect={handleProductSelect}
          />
        ) : null;

      case "product-detail":
        return selectedProductId ? (
          <ProductDetailStep
            productId={selectedProductId}
            onCustomize={handleProductCustomize}
            onContinue={handleProductContinue}
            isSubmitting={isSubmitting}
          />
        ) : null;

      case "describe":
        return (
          <DescribeStep
            onPromptSubmit={handlePromptSubmit}
            isSubmitting={isSubmitting}
          />
        );

      case "upload":
        return uploadedFile ? (
          <UploadStep
            onSubmit={handleImageUpload}
            initialFile={uploadedFile}
            isSubmitting={isSubmitting}
          />
        ) : null;

      default:
        return null;
    }
  };

  const backButton = canGoBack ? (
    <Button variant="light" size="sm" isIconOnly onPress={goBack}>
      <ArrowLeftIcon size={20} />
    </Button>
  ) : undefined;

  return (
    <>
      {/* Hidden file input for direct file selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      <BaseDesignModal
        isOpen={isOpen}
        onClose={handleClose}
        title={title}
        subtitle={subtitle}
        headerLeft={backButton}
      >
        {renderStepContent()}
      </BaseDesignModal>
    </>
  );
}
