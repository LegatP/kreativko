import { ReactNode } from "react";

interface ProductPageLayoutProps {
  leftColumn: ReactNode;
  rightColumn: ReactNode;
  title?: string;
  description?: string;
}

export default function ProductPageLayout({
  leftColumn,
  rightColumn,
  title,
  description,
}: ProductPageLayoutProps) {
  return (
    <div className="min-h-screen bg-white w-full">
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-7xl">
        {title && (
          <div className="mb-4 md:mb-6">
            <h1 className="text-2xl md:text-3xl font-semibold text-primary-900">
              {title}
            </h1>
            <p className="text-sm md:text-medium text-default-700">
              {description}
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-8 gap-4 md:gap-6 lg:gap-8">
          <div className="space-y-4 md:space-y-6 lg:col-span-3 order-2 lg:order-1">
            {leftColumn}
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 -mx-4 sm:mx-0 flex justify-center overflow-x-hidden lg:overflow-visible">
            <div className="w-full sm:min-w-[500px] mx-auto">{rightColumn}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
