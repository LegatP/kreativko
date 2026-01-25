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
  align?: "center" | "left";
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
  align = "center",
  className,
}: PathCardProps) {
  const cardProps = href
    ? { as: Link, href }
    : {};

  const isLeft = align === "left";

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
        className={`p-6 border-2 border-transparent hover:border-primary transition-colors bg-content1 h-full w-full ${className || ""}`}
      >
        <CardBody className={`flex gap-4 ${isLeft ? "flex-row items-center" : "flex-col items-center text-center"}`}>
          {icon && (
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
              {icon}
            </div>
          )}
          <div className={isLeft ? "text-left" : ""}>
            <h3 className="text-xl font-bold mb-1 text-foreground">
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-default-400 mb-2">{subtitle}</p>
            )}
            <p className="text-default-500 text-sm">{description}</p>
          </div>
          {children}
        </CardBody>
      </Card>
    </motion.div>
  );
}
