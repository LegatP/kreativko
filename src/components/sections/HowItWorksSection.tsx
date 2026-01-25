"use client";

import React from "react";
import {
  PaintBrushIcon,
  SlidersHorizontalIcon,
  ShoppingCartIcon,
} from "@phosphor-icons/react";

const STEPS = [
  {
    number: 1,
    title: "Ustvari motiv",
    description: "Opiši svojo idejo, naloži sliko ali izberi obstoječi motiv.",
    icon: PaintBrushIcon,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    number: 2,
    title: "Prilagodi",
    description:
      "Prilagodi motiv po svojih željah - spremeni barve, slog ali dodaj podrobnosti.",
    icon: SlidersHorizontalIcon,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    number: 3,
    title: "Naroči",
    description:
      "Izberi barvo in velikost majice ter oddaj naročilo. Dostava v nekaj dneh.",
    icon: ShoppingCartIcon,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-primary-900 mb-3">
          Kako deluje?
        </h2>
        <p className="text-center text-foreground mb-8 md:mb-12">
          V treh korakih do unikatnega motiva.
        </p>

        {/* Desktop: horizontal layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-4">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.number}>
              {/* Step card */}
              <div className="flex flex-col items-center text-center px-6 py-8 rounded-2xl border border-default-200 bg-white h-full">
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${step.bgColor} mb-4`}
                >
                  <step.icon
                    className={`w-8 h-8 ${step.color}`}
                    weight="duotone"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-primary-900 mb-2">
                  {step.number}. {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-foreground/70">{step.description}</p>
              </div>

              {/* Arrow between steps */}
              {index < STEPS.length - 1 && (
                <div className="flex items-center justify-center">
                  <svg
                    width="40"
                    height="16"
                    viewBox="0 0 40 16"
                    fill="none"
                    className="text-default-300"
                  >
                    <path
                      d="M39.7071 8.70711C40.0976 8.31658 40.0976 7.68342 39.7071 7.29289L33.3431 0.928932C32.9526 0.538408 32.3195 0.538408 31.9289 0.928932C31.5384 1.31946 31.5384 1.95262 31.9289 2.34315L37.5858 8L31.9289 13.6569C31.5384 14.0474 31.5384 14.6805 31.9289 15.0711C32.3195 15.4616 32.9526 15.4616 33.3431 15.0711L39.7071 8.70711ZM0 9H39V7H0V9Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile: vertical layout */}
        <div className="flex md:hidden flex-col gap-6">
          {STEPS.map((step, index) => (
            <div key={step.number}>
              {/* Step card */}
              <div className="flex flex-col items-center text-center px-6 py-6 rounded-2xl border border-default-200 bg-white">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center ${step.bgColor} mb-3`}
                >
                  <step.icon
                    className={`w-7 h-7 ${step.color}`}
                    weight="duotone"
                  />
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-primary-900 mb-2">
                  {step.number}. {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-foreground/70">{step.description}</p>
              </div>

              {/* Divider between steps */}
              {index < STEPS.length - 1 && (
                <div className="flex justify-center py-2">
                  <div className="w-px h-6 bg-default-200" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
