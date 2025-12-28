"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Checkbox,
  CheckboxGroup,
  Divider,
} from "@heroui/react";
import { getAppConfig, createAppConfig, updateAppConfig } from "@/db/config";
import { useCategories } from "@/db/product-categories";
import LoadingSpinner from "@/components/common/LoadingSpinner";

interface EditConfigFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function EditConfigForm({
  isOpen,
  onClose,
  onSuccess,
}: EditConfigFormProps) {
  const [configExists, setConfigExists] = useState(false);
  const [wizardCategoryIds, setWizardCategoryIds] = useState<string[]>([]);
  const [landingPageCategoryIds, setLandingPageCategoryIds] = useState<
    string[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  // Fetch all available categories
  const [categories, categoriesLoading] = useCategories();

  // Load config when modal opens
  useEffect(() => {
    const loadConfig = async () => {
      if (!isOpen) return;

      setLoadingData(true);
      try {
        const configData = await getAppConfig();
        if (configData) {
          setConfigExists(true);
          setWizardCategoryIds(configData.wizardCategoryIds || []);
          setLandingPageCategoryIds(configData.landingPageCategoryIds || []);
        } else {
          // No config exists yet
          setConfigExists(false);
          setWizardCategoryIds([]);
          setLandingPageCategoryIds([]);
        }
      } catch (error) {
        console.error("Error loading config:", error);
      } finally {
        setLoadingData(false);
      }
    };

    loadConfig();
  }, [isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (configExists) {
        // Update existing config
        await updateAppConfig({
          wizardCategoryIds,
          landingPageCategoryIds,
        });
      } else {
        // Create new config
        await createAppConfig({
          wizardCategoryIds,
          landingPageCategoryIds,
        });
        setConfigExists(true);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving config:", error);
    } finally {
      setLoading(false);
    }
  };

  const isDataLoading = loadingData || categoriesLoading;

  if (isDataLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>Nastavitve aplikacije</ModalHeader>
          <ModalBody>
            <LoadingSpinner />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="top-center"
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        body: "py-6",
        backdrop: "bg-black/50 backdrop-opacity-40",
        base: "border-gray-200 bg-white text-gray-900",
        header: "border-b-[1px] border-gray-200",
        footer: "border-t-[1px] border-gray-200",
        closeButton: "hover:bg-gray-100 active:bg-gray-200",
      }}
    >
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader>Nastavitve aplikacije</ModalHeader>
            <ModalBody className="gap-6 max-h-[60vh] overflow-y-auto">
              {/* Wizard Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Kategorije v koraku &quot;Izberi kategorijo&quot;
                </h3>
                <p className="text-sm text-default-500 mb-4">
                  Izberite kategorije, ki se bodo prikazale v čarovniku za
                  ustvarjanje dizajna.
                </p>
                {categories && categories.length > 0 ? (
                  <CheckboxGroup
                    value={wizardCategoryIds}
                    onValueChange={setWizardCategoryIds}
                  >
                    {categories.map((category) => (
                      <Checkbox key={category.id} value={category.id}>
                        {category.name}
                        {category.description && (
                          <span className="text-default-400 ml-2">
                            - {category.description}
                          </span>
                        )}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                ) : (
                  <p className="text-default-400">
                    Ni razpoložljivih kategorij. Najprej ustvarite kategorije.
                  </p>
                )}
              </div>

              <Divider />

              {/* Landing Page Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Kategorije na domači strani
                </h3>
                <p className="text-sm text-default-500 mb-4">
                  Izberite kategorije za prikaz na domači strani.
                </p>
                {categories && categories.length > 0 ? (
                  <CheckboxGroup
                    value={landingPageCategoryIds}
                    onValueChange={setLandingPageCategoryIds}
                  >
                    {categories.map((category) => (
                      <Checkbox key={category.id} value={category.id}>
                        {category.name}
                        {category.description && (
                          <span className="text-default-400 ml-2">
                            - {category.description}
                          </span>
                        )}
                      </Checkbox>
                    ))}
                  </CheckboxGroup>
                ) : (
                  <p className="text-default-400">
                    Ni razpoložljivih kategorij. Najprej ustvarite kategorije.
                  </p>
                )}
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onCloseModal}>
                Prekliči
              </Button>
              <Button color="primary" isLoading={loading} onPress={handleSubmit}>
                Shrani
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
