"use client";

import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface PathCardProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
}

export default function PathCard({
  title,
  subtitle,
  description,
  icon,
  href,
  onClick,
  children,
  className,
}: PathCardProps) {
  const cardProps = href
    ? { as: Link, href }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="h-full w-full"
    >
      <Card
        {...cardProps}
        isPressable
        onPress={onClick}
        className={`p-1.5 md:p-6 border-2 border-transparent hover:border-primary transition-colors bg-content1 h-full w-full ${className || ""}`}
      >
        <CardBody className="flex flex-row items-center gap-3 md:flex-col md:items-center md:text-center md:gap-4">
          {icon && (
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary flex-shrink-0 [&>svg]:w-5 [&>svg]:h-5 md:[&>svg]:w-8 md:[&>svg]:h-8">
              {icon}
            </div>
          )}
          <div className="flex flex-col md:items-center">
            <h3 className="text-base md:text-xl font-bold mb-1 text-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm md:text-sm text-default-400 mb-2 md:text-center">{subtitle}</p>
            )}
            <p className="text-default-500 text-sm md:text-sm md:text-center">{description}</p>
          </div>
          {children}
        </CardBody>
      </Card>
    </motion.div>
  );
}
