"use client";

import { useState, useCallback } from "react";

/**
 * Generic hook for managing array state with add/update/remove operations.
 */
export function useArrayField<T>(initialValue: T[] = []) {
  const [items, setItems] = useState<T[]>(initialValue);

  const add = useCallback((item: T) => {
    setItems((prev) => [...prev, item]);
  }, []);

  const update = useCallback((index: number, updates: Partial<T>) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  }, []);

  const updateField = useCallback(
    <K extends keyof T>(index: number, field: K, value: T[K]) => {
      setItems((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, [field]: value } : item
        )
      );
    },
    []
  );

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback((newItems: T[]) => {
    setItems(newItems);
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  return {
    items,
    add,
    update,
    updateField,
    remove,
    reset,
    clear,
    setItems,
  };
}
