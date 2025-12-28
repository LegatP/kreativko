"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface UseImageUploadOptions {
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  initialFiles?: File[];
}

interface ImageFile {
  file: File;
  preview: string;
}

/**
 * Hook for managing image file uploads with preview generation.
 * Handles file selection, preview creation, and cleanup.
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { multiple = false, accept = "image/*", maxSize, initialFiles } = options;

  const [files, setFiles] = useState<ImageFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const initialFilesProcessed = useRef(false);

  // Process initial files (only once)
  useEffect(() => {
    if (initialFiles && initialFiles.length > 0 && !initialFilesProcessed.current) {
      initialFilesProcessed.current = true;

      initialFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFiles((prev) => [
            ...prev,
            { file, preview: e.target?.result as string },
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
  }, [initialFiles]);

  const handleSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);

      selectedFiles.forEach((file) => {
        // Skip if file exceeds max size
        if (maxSize && file.size > maxSize) {
          console.warn(`File ${file.name} exceeds maximum size of ${maxSize} bytes`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          setFiles((prev) => {
            const newFile = { file, preview: event.target?.result as string };
            return multiple ? [...prev, newFile] : [newFile];
          });
        };
        reader.readAsDataURL(file);
      });

      // Reset input to allow selecting the same file again
      e.target.value = "";
    },
    [multiple, maxSize]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const removed = prev[index];
      // Revoke object URL if it was created with createObjectURL
      if (removed?.preview.startsWith("blob:")) {
        URL.revokeObjectURL(removed.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const triggerInput = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const reset = useCallback(() => {
    // Cleanup any blob URLs
    files.forEach((item) => {
      if (item.preview.startsWith("blob:")) {
        URL.revokeObjectURL(item.preview);
      }
    });
    setFiles([]);
    initialFilesProcessed.current = false;
  }, [files]);

  const clear = useCallback(() => {
    setFiles([]);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      files.forEach((item) => {
        if (item.preview.startsWith("blob:")) {
          URL.revokeObjectURL(item.preview);
        }
      });
    };
  }, []);

  // Input props to spread on a hidden input element
  const inputProps = {
    ref: inputRef,
    type: "file" as const,
    accept,
    multiple,
    onChange: handleSelect,
    className: "hidden",
  };

  return {
    files,
    previews: files.map((f) => f.preview),
    rawFiles: files.map((f) => f.file),
    inputRef,
    inputProps,
    handleSelect,
    removeFile,
    triggerInput,
    reset,
    clear,
    hasFiles: files.length > 0,
  };
}
