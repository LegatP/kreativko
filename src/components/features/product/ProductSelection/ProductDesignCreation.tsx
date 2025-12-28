"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { forwardRef } from "react";
import SelectDesignModal from "@/components/features/product/ProductSelection/SelectDesignModal";
import { EditDesignModal } from "@/components/features/product/DesignEditor";
import { DesignSession, updateDesignSession } from "@/db/design-sessions";
import {
  Button,
  Card,
  CardBody,
  Divider,
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Trash,
  PaintBrushIcon,
  FolderOpenIcon,
  PencilSimpleIcon,
} from "@phosphor-icons/react";
import Image from "next/image";
import { DesignUrls } from "@/components/contexts/CheckoutContext";
import { PrintPosition } from "@/products";
import { uploadFile } from "@/lib/firebase/storage";
import { arrayUnion } from "@/lib/firebase/firestore";

interface DesignItem {
  id: string;
  url: string;
  position?: PrintPosition;
}

interface ProductDesignCreationProps {
  designSession: DesignSession;
  designUrls: DesignUrls;
  onDesignSelect: (position: PrintPosition, imageUrl: string) => void;
  onOpenWizard: (position?: PrintPosition) => void;
  onRemoveDesign: (position: PrintPosition) => void;
}

export interface ProductDesignCreationRef {
  generateDesign: (
    prompt: string,
    position: PrintPosition,
    selectedAssets?: { url: string }[]
  ) => Promise<void>;
  addDesign: (url: string, position: PrintPosition) => void;
}

interface DesignCardProps {
  design: DesignItem;
  onPositionChange: (newPosition: PrintPosition | undefined) => void;
  onRemove: () => void;
  onEdit: () => void;
}

function DesignCard({
  design,
  onPositionChange,
  onRemove,
  onEdit,
}: DesignCardProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Design preview */}
      <div className="w-full aspect-square border border-default-200 rounded-xl overflow-hidden bg-default-50">
        <div className="w-full h-full relative">
          <Image src={design.url} alt="Motiv" fill className="object-contain" />
        </div>
      </div>

      {/* Controls below the design */}
      <div className="flex flex-col gap-2">
        {/* Position dropdown */}
        <Select
          label="Pozicija tiska"
          size="sm"
          placeholder="Izberi pozicijo"
          variant="underlined"
          selectedKeys={design.position ? [design.position] : []}
          onChange={(e) => {
            const value = e.target.value;
            onPositionChange(value ? (value as PrintPosition) : undefined);
          }}
          classNames={{
            trigger: "h-10",
          }}
        >
          <SelectItem key="front">Spredaj</SelectItem>
          <SelectItem key="back">Zadaj</SelectItem>
        </Select>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="light"
            color="primary"
            startContent={<PencilSimpleIcon size={14} weight="duotone" />}
            onPress={onEdit}
          >
            Spremeni
          </Button>
          <Button
            size="sm"
            variant="light"
            color="danger"
            startContent={<Trash size={14} weight="duotone" />}
            onPress={onRemove}
          >
            Odstrani
          </Button>
        </div>
      </div>
    </div>
  );
}

const ProductDesignCreation = forwardRef<
  ProductDesignCreationRef,
  ProductDesignCreationProps
>(
  (
    { onDesignSelect, designUrls, designSession, onOpenWizard, onRemoveDesign },
    ref
  ) => {
    const { createdDesigns } = designSession;
    const { createImage } = useImageGeneration();
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingDesign, setEditingDesign] = useState<DesignItem | null>(null);
    // Local list of designs (can have undefined positions)
    const [localDesigns, setLocalDesigns] = useState<DesignItem[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    // Track URLs that were removed locally to prevent sync effect from re-adding them
    const removedUrlsRef = useRef<Set<string>>(new Set());
    // Track previous designUrls to avoid unnecessary updates
    const prevDesignUrlsRef = useRef<{ front?: string; back?: string }>({});

    // Initialize localDesigns from parent's designUrls
    useEffect(() => {
      if (isInitialized || localDesigns.length > 0) return;

      const initial: DesignItem[] = [];
      if (designUrls.front) {
        initial.push({
          id: crypto.randomUUID(),
          url: designUrls.front,
          position: "front",
        });
      }
      if (designUrls.back) {
        initial.push({
          id: crypto.randomUUID(),
          url: designUrls.back,
          position: "back",
        });
      }
      if (initial.length > 0) {
        setLocalDesigns(initial);
      }
      setIsInitialized(true);
    }, [designUrls, isInitialized, localDesigns.length]);

    // Sync designs from designUrls after initialization (e.g., from Firestore updates or removals)
    useEffect(() => {
      if (!isInitialized) return;

      const frontUrl = designUrls.front;
      const backUrl = designUrls.back;
      const prevFront = prevDesignUrlsRef.current.front;
      const prevBack = prevDesignUrlsRef.current.back;

      // Skip if nothing actually changed
      if (frontUrl === prevFront && backUrl === prevBack) {
        return;
      }

      // Update ref for next comparison
      prevDesignUrlsRef.current = { front: frontUrl, back: backUrl };

      // Use functional update to check current state without needing localDesigns in deps
      setLocalDesigns((prev) => {
        const hasFrontLocally = prev.some((d) => d.url === frontUrl);
        const hasBackLocally = prev.some((d) => d.url === backUrl);

        const newDesigns: DesignItem[] = [];

        // Only add if not locally removed (prevents re-adding during state sync delay)
        if (
          frontUrl &&
          !hasFrontLocally &&
          !removedUrlsRef.current.has(frontUrl)
        ) {
          // New front design from external source (e.g., background generation)
          newDesigns.push({
            id: crypto.randomUUID(),
            url: frontUrl,
            position: "front",
          });
        }

        if (
          backUrl &&
          !hasBackLocally &&
          !removedUrlsRef.current.has(backUrl)
        ) {
          // New back design from external source
          newDesigns.push({
            id: crypto.randomUUID(),
            url: backUrl,
            position: "back",
          });
        }

        // Handle removals: if a position was cleared in designUrls, remove it from localDesigns
        // and clear from removed tracking
        let updated = prev;

        // If front was removed from designUrls, remove the design with that position
        if (!frontUrl) {
          const frontDesign = prev.find((d) => d.position === "front");
          if (frontDesign) {
            updated = updated.filter((d) => d.id !== frontDesign.id);
            // Clear from removed tracking since parent state now reflects the removal
            removedUrlsRef.current.delete(frontDesign.url);
          }
        }

        // If back was removed from designUrls, remove the design with that position
        if (!backUrl) {
          const backDesign = prev.find((d) => d.position === "back");
          if (backDesign) {
            updated = updated.filter((d) => d.id !== backDesign.id);
            // Clear from removed tracking since parent state now reflects the removal
            removedUrlsRef.current.delete(backDesign.url);
          }
        }

        if (newDesigns.length === 0 && updated === prev) {
          return prev; // No changes needed
        }

        // Clear position from any existing designs that would conflict with new ones
        if (newDesigns.length > 0) {
          updated = updated.map((d) => {
            const conflictingNew = newDesigns.find(
              (n) => n.position === d.position
            );
            if (conflictingNew) {
              return { ...d, position: undefined };
            }
            return d;
          });
        }

        return [...updated, ...newDesigns];
      });
    }, [designUrls.front, designUrls.back, isInitialized]);

    const generateDesign = useCallback(
      async (
        prompt: string,
        position: PrintPosition,
        selectedAssets?: { url: string }[]
      ) => {
        const result = await createImage(
          prompt,
          selectedAssets?.map((asset) => asset.url)
        );

        if (!result) return;

        const { url } = result;

        await updateDesignSession(designSession.id, {
          ...designSession,
          createdDesigns: [...createdDesigns, { title: prompt, url }],
        });

        // Add to local designs so it shows in the design cards
        const newDesign: DesignItem = {
          id: crypto.randomUUID(),
          url,
          position,
        };
        setLocalDesigns((prev) => {
          // If another design has this position, clear it
          const updated = prev.map((d) =>
            d.position === position ? { ...d, position: undefined } : d
          );
          return [...updated, newDesign];
        });

        onDesignSelect(position, url);
      },
      [createImage, onDesignSelect, designSession, createdDesigns]
    );

    const addDesign = useCallback(
      (url: string, position: PrintPosition) => {
        const newDesign: DesignItem = {
          id: crypto.randomUUID(),
          url,
          position,
        };
        setLocalDesigns((prev) => {
          // If another design has this position, clear it
          const updated = prev.map((d) =>
            d.position === position ? { ...d, position: undefined } : d
          );
          return [...updated, newDesign];
        });
        onDesignSelect(position, url);
      },
      [onDesignSelect]
    );

    useImperativeHandle(ref, () => ({
      generateDesign,
      addDesign,
    }));

    const hasDesigns = localDesigns.length > 0;

    const handlePositionChange = (
      designId: string,
      newPosition: PrintPosition | undefined
    ) => {
      const design = localDesigns.find((d) => d.id === designId);
      if (!design) return;

      const oldPosition = design.position;

      // Skip if no actual change
      if (oldPosition === newPosition) return;

      // Update local design position in place (keeps order stable)
      setLocalDesigns((prev) =>
        prev.map((d) => {
          if (d.id === designId) {
            return { ...d, position: newPosition };
          }
          // If another design has the new position, clear it
          if (newPosition && d.position === newPosition) {
            return { ...d, position: undefined };
          }
          return d;
        })
      );

      // Sync with parent designUrls - batch updates to avoid multiple state changes
      // Clear old position first, then set new position
      if (oldPosition && oldPosition !== newPosition) {
        onRemoveDesign(oldPosition);
      }
      if (newPosition) {
        onDesignSelect(newPosition, design.url);
      }
    };

    const handleRemoveDesign = (designId: string) => {
      const design = localDesigns.find((d) => d.id === designId);
      if (!design) return;

      // Track the removed URL to prevent sync effect from re-adding it
      removedUrlsRef.current.add(design.url);

      if (design.position) {
        onRemoveDesign(design.position);
      }
      setLocalDesigns((prev) => prev.filter((d) => d.id !== designId));
    };

    const handleOpenSelectModal = () => {
      setIsSelectModalOpen(true);
    };

    // Check if a position is already taken
    const isPositionTaken = (position: PrintPosition) => {
      return localDesigns.some((d) => d.position === position);
    };

    // Determine which position to use when opening wizard
    const getNextAvailablePosition = (): PrintPosition | undefined => {
      if (!isPositionTaken("front")) return "front";
      if (!isPositionTaken("back")) return "back";
      return undefined;
    };

    const handleSelectDesign = (url: string) => {
      const hasFront = isPositionTaken("front");
      const newDesign: DesignItem = {
        id: crypto.randomUUID(),
        url,
        position: hasFront ? undefined : "front",
      };
      setLocalDesigns((prev) => [...prev, newDesign]);
      // Sync with parent if position assigned
      if (newDesign.position) {
        onDesignSelect(newDesign.position, url);
      }
    };

    const handleUploadFile = async (file: File) => {
      try {
        // Upload to Firebase Storage to get permanent URL
        const url = await uploadFile(file);

        const hasFront = isPositionTaken("front");
        const newDesign: DesignItem = {
          id: crypto.randomUUID(),
          url,
          position: hasFront ? undefined : "front",
        };
        setLocalDesigns((prev) => [...prev, newDesign]);

        // Save to session's uploadedAssets
        await updateDesignSession(designSession.id, {
          uploadedAssets: [...designSession.uploadedAssets, { url }],
        });

        // Sync with parent if position assigned
        if (newDesign.position) {
          onDesignSelect(newDesign.position, url);
        }
      } catch (error) {
        console.error("Failed to upload file:", error);
      }
    };

    const handleOpenEditModal = (design: DesignItem) => {
      setEditingDesign(design);
      setIsEditModalOpen(true);
    };

    const handleAssetUploaded = async (url: string) => {
      // Use arrayUnion for atomic update to avoid race conditions with multiple uploads
      await updateDesignSession(designSession.id, {
        uploadedAssets: arrayUnion({ url }),
      });
    };

    const handleEditDesignSubmit = async (prompt: string, images?: File[]) => {
      if (!editingDesign) return;

      // Upload images to Firebase Storage first if provided
      let referenceUrls: string[] = [editingDesign.url];
      if (images && images.length > 0) {
        try {
          const uploadedUrls = await Promise.all(
            images.map((file) => uploadFile(file))
          );
          referenceUrls = uploadedUrls;

          // Save uploaded images to session
          const newAssets = uploadedUrls.map((url) => ({ url }));
          await updateDesignSession(designSession.id, {
            uploadedAssets: [...designSession.uploadedAssets, ...newAssets],
          });
        } catch (error) {
          console.error("Failed to upload images:", error);
          return;
        }
      }

      // Generate new design based on edit prompt
      const result = await createImage(prompt, referenceUrls);

      if (!result) return;

      const { url } = result;

      await updateDesignSession(designSession.id, {
        createdDesigns: [...createdDesigns, { title: prompt, url }],
      });

      // Update the design in place with the new URL (keeps order stable)
      setLocalDesigns((prev) =>
        prev.map((d) => (d.id === editingDesign.id ? { ...d, url } : d))
      );

      // Sync with parent if design has a position
      if (editingDesign.position) {
        onDesignSelect(editingDesign.position, url);
      }
    };

    return (
      <Card>
        <CardBody className="py-5 px-6 space-y-4">
          {/* Header with title */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-md font-semibold text-default-900">MOTIV</h3>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4">
            {/* Action cards - always visible */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Card
                isPressable
                onPress={() => onOpenWizard(getNextAvailablePosition())}
                className="border-2 border-dashed border-default-200 hover:border-primary transition-colors"
              >
                <CardBody className="flex flex-row items-center gap-3 py-4 px-4 sm:flex-col sm:items-center sm:justify-center sm:py-6 sm:gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <PaintBrushIcon
                      size={20}
                      weight="duotone"
                      className="text-primary"
                    />
                  </div>
                  <div className="flex flex-col sm:items-center">
                    <span className="text-sm font-medium text-default-700">
                      Ustvari
                    </span>
                    <span className="text-xs text-default-400 sm:text-center">
                      Prilagodi obstoječ motiv, ustvari motiv iz slike ali opisa
                    </span>
                  </div>
                </CardBody>
              </Card>

              <Card
                isPressable
                onPress={handleOpenSelectModal}
                className="border-2 border-dashed border-default-200 hover:border-primary transition-colors"
              >
                <CardBody className="flex flex-row items-center gap-3 py-4 px-4 sm:flex-col sm:items-center sm:justify-center sm:py-6 sm:gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FolderOpenIcon
                      size={20}
                      weight="duotone"
                      className="text-primary"
                    />
                  </div>
                  <div className="flex flex-col sm:items-center">
                    <span className="text-sm font-medium text-default-700">
                      Izberi
                    </span>
                    <span className="text-xs text-default-400 sm:text-center">
                      Izberi že ustvarjen motiv ali naloži sliko
                    </span>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Design cards - shown when designs exist */}
            {hasDesigns && (
              <>
                <Divider className="my-2" />
                <div className="grid grid-cols-2 gap-3">
                  {localDesigns.map((design) => (
                    <DesignCard
                      key={design.id}
                      design={design}
                      onPositionChange={(newPosition) =>
                        handlePositionChange(design.id, newPosition)
                      }
                      onRemove={() => handleRemoveDesign(design.id)}
                      onEdit={() => handleOpenEditModal(design)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          <SelectDesignModal
            isOpen={isSelectModalOpen}
            onClose={() => setIsSelectModalOpen(false)}
            createdDesigns={createdDesigns}
            uploadedAssets={designSession.uploadedAssets}
            onSelectDesign={handleSelectDesign}
            onAssetUploaded={handleAssetUploaded}
          />

          <EditDesignModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setEditingDesign(null);
            }}
            designUrl={editingDesign?.url || ""}
            designName="Motiv"
            onSubmit={handleEditDesignSubmit}
            title="Spremeni motiv"
            subtitle="Spremeni motiv, tako da opišeš želene spremembe."
          />
        </CardBody>
      </Card>
    );
  }
);

ProductDesignCreation.displayName = "ProductDesignCreation";

export default ProductDesignCreation;
