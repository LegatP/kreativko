/**
 * Custom error class for Firestore operations.
 * Provides structured error information for better debugging and error handling.
 */
export class FirestoreError extends Error {
  constructor(
    public operation: "create" | "update" | "get" | "delete" | "list",
    public collection: string,
    public originalError: unknown
  ) {
    const message = `Firestore ${operation} failed on ${collection}`;
    super(message);
    this.name = "FirestoreError";

    // Maintains proper stack trace for where the error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestoreError);
    }
  }

  /**
   * Get a user-friendly error message
   */
  getUserMessage(): string {
    switch (this.operation) {
      case "create":
        return "Ustvarjanje elementa ni uspelo. Poskusite znova.";
      case "update":
        return "Posodobitev elementa ni uspela. Poskusite znova.";
      case "get":
        return "Nalaganje elementa ni uspelo. Osvežite stran.";
      case "delete":
        return "Brisanje elementa ni uspelo. Poskusite znova.";
      case "list":
        return "Nalaganje elementov ni uspelo. Osvežite stran.";
      default:
        return "Prišlo je do napake. Poskusite znova.";
    }
  }
}

/**
 * Wraps an async function with error handling that throws FirestoreError.
 *
 * @example
 * ```ts
 * const result = await withErrorHandling("create", "products", async () => {
 *   return await addDoc(collection, data);
 * });
 * ```
 */
export async function withErrorHandling<T>(
  operation: FirestoreError["operation"],
  collection: string,
  fn: () => Promise<T>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw new FirestoreError(operation, collection, error);
  }
}

/**
 * Type guard to check if an error is a FirestoreError
 */
export function isFirestoreError(error: unknown): error is FirestoreError {
  return error instanceof FirestoreError;
}
