import { Card, CardBody } from "@heroui/react";
import react from "react";

interface ProductSelectionCardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export default function ProductSelectionCard({
  title,
  subtitle,
  children,
}: ProductSelectionCardProps) {
  return (
    <Card>
      <CardBody className="py-5 px-6 space-y-4">
        {(title || subtitle) && (
          <div>
            {title && (
              <h3 className="text-xl font-semibold text-default-900">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-sm text-default-700">{subtitle}</p>}
          </div>
        )}
        {children}
      </CardBody>
    </Card>
  );
}
