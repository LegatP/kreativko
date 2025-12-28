"use client";

import { ReactNode } from "react";
import { Card, CardBody } from "@heroui/react";
import { motion } from "framer-motion";
import { SparkleIcon } from "@phosphor-icons/react";

interface SuggestionCardProps {
  prompt: string;
  onSelect: (prompt: string) => void;
  icon?: ReactNode;
  delay?: number;
}

export default function SuggestionCard({
  prompt,
  onSelect,
  icon,
  delay = 0,
}: SuggestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card
        isPressable
        onPress={() => onSelect(prompt)}
        className="border-2 border-transparent hover:border-primary transition-colors w-full"
      >
        <CardBody className="flex flex-row items-center gap-3 p-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10 text-primary flex-shrink-0">
            {icon || <SparkleIcon size={16} weight="duotone" />}
          </div>
          <p className="text-sm font-medium text-foreground">{prompt}</p>
        </CardBody>
      </Card>
    </motion.div>
  );
}
