"use client";

import { useState, useCallback } from "react";

interface UseWizardNavigationOptions<T extends string> {
  initialStep: T;
  stepHistory: Partial<Record<T, T | null>>; // Maps step to previous step (null = no back)
  onStepChange?: (step: T, prevStep: T) => void;
}

/**
 * Hook for managing wizard step navigation with back button support.
 * Provides a clean API for multi-step wizards with step history tracking.
 */
export function useWizardNavigation<T extends string>({
  initialStep,
  stepHistory,
  onStepChange,
}: UseWizardNavigationOptions<T>) {
  const [currentStep, setCurrentStep] = useState<T>(initialStep);

  const setStep = useCallback(
    (step: T) => {
      const prevStep = currentStep;
      setCurrentStep(step);
      onStepChange?.(step, prevStep);
    },
    [currentStep, onStepChange]
  );

  const goBack = useCallback(() => {
    const previousStep = stepHistory[currentStep];
    if (previousStep !== undefined && previousStep !== null) {
      setStep(previousStep);
    }
  }, [currentStep, stepHistory, setStep]);

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
  }, [initialStep]);

  const canGoBack = stepHistory[currentStep] !== undefined && stepHistory[currentStep] !== null;

  return {
    currentStep,
    setStep,
    goBack,
    reset,
    canGoBack,
  };
}
