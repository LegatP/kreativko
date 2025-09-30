"use client";

import { useCallback } from "react";

type FormValues<T> = {
  [K in keyof T]: T[K];
};

export function useUncontrolledForm<T extends Record<string, any>>(
  onSubmit: (data: FormValues<T>, e: React.FormEvent<HTMLFormElement>) => void
) {
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const entries: Record<string, any> = {};

      // Walk all form controls
      for (const element of Array.from(e.currentTarget.elements)) {
        if (!(element instanceof HTMLInputElement)) continue;
        const { name, type, checked, value } = element;

        if (!name) continue; // skip unnamed inputs

        if (type === "checkbox") {
          if (!entries.hasOwnProperty(name)) {
            // Case 1: single checkbox → start with false
            // Case 2: multiple checkboxes → start with []
            const group = e.currentTarget.querySelectorAll(
              `input[name="${name}"][type="checkbox"]`
            );
            entries[name] = group.length > 1 ? [] : false;
          }

          if (Array.isArray(entries[name])) {
            // Multi-checkbox → push checked values
            if (checked) entries[name].push(value || "true");
          } else {
            // Single checkbox → boolean
            entries[name] = checked;
          }
        }
      }

      // Add other inputs (text, email, select, etc.)
      formData.forEach((value, key) => {
        if (entries.hasOwnProperty(key)) return; // already handled checkbox
        entries[key] = value;
      });

      onSubmit(entries as FormValues<T>, e);
    },
    [onSubmit]
  );

  return { handleSubmit };
}
