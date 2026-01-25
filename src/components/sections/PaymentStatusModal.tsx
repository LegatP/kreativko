"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

interface PaymentStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "success" | "error" | null;
}

const PaymentStatusModal = ({
  isOpen,
  onClose,
  status,
}: PaymentStatusModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {status === "success" ? "Plačilo uspešno!" : "Plačilo neuspešno"}
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col items-center text-center space-y-4">
                <div
                  className={
                    status === "success" ? "text-green-500" : "text-red-500"
                  }
                >
                  {status === "success" ? (
                    <CheckCircleIcon className="w-16 h-16" weight="fill" />
                  ) : (
                    <XCircleIcon className="w-16 h-16" weight="fill" />
                  )}
                </div>
                <p className="text-gray-600">
                  {status === "success"
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
  );
};

export default PaymentStatusModal;
