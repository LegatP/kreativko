import {
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperties,
} from "firebase/analytics";
import app from "./init";

// Initialize analytics (will be null on server-side)
let analytics: ReturnType<typeof getAnalytics> | null = null;

// Initialize analytics only on client-side
const initAnalytics = () => {
  if (typeof window !== "undefined" && !analytics) {
    try {
      analytics = getAnalytics(app);
      console.log(
        "[Analytics] Firebase Analytics initialized successfully",
        analytics
      );
    } catch (error) {
      console.error(
        "[Analytics] Failed to initialize Firebase Analytics:",
        error
      );
    }
  }
  return analytics;
};

// Helper function to safely log events
const safeLogEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
) => {
  const analyticsInstance = initAnalytics();

  if (!analyticsInstance) {
    console.warn(
      "[Analytics] Analytics not initialized, event not logged:",
      eventName,
      eventParams
    );
    return;
  }

  try {
    console.log("[Analytics] Logging event:", eventName, eventParams);
    logEvent(analyticsInstance, eventName, eventParams);
  } catch (error) {
    console.error("[Analytics] Error logging event:", eventName, error);
  }
};

// ==================== USER TRACKING ====================

/**
 * Set user ID for tracking across sessions
 */
export const trackUserId = (userId: string) => {
  const analyticsInstance = initAnalytics();
  if (analyticsInstance) {
    setUserId(analyticsInstance, userId);
  }
};

/**
 * Set user properties
 */
export const trackUserProperties = (properties: Record<string, unknown>) => {
  const analyticsInstance = initAnalytics();
  if (analyticsInstance) {
    setUserProperties(analyticsInstance, properties);
  }
};

// ==================== LANDING PAGE EVENTS ====================

/**
 * Track when user clicks "Ustvari Motiv" from hero section
 */
export const trackCreateDesignFromHero = (description?: string) => {
  safeLogEvent("create_design_hero", {
    source: "hero_section",
    has_description: !!description,
    description_length: description?.length || 0,
  });
};

/**
 * Track when user clicks "Ustvari Motiv" from header/navigation
 */
export const trackCreateDesignFromHeader = () => {
  safeLogEvent("create_design_header", {
    source: "header",
  });
};

/**
 * Track when user clicks on a product card to customize existing design
 */
export const trackCustomizeDesignClick = (
  productId: string,
  productName: string
) => {
  safeLogEvent("customize_design_click", {
    product_id: productId,
    product_name: productName,
    source: "product_card",
  });
};

/**
 * Track when user views a product page
 */
export const trackProductView = (productId: string, productName: string) => {
  safeLogEvent("view_item", {
    product_id: productId,
    product_name: productName,
  });
};

// ==================== DESIGN CREATION EVENTS ====================

/**
 * Track when user enters a prompt for AI generation
 */
export const trackPromptEntered = (prompt: string, userId?: string) => {
  safeLogEvent("prompt_entered", {
    prompt_length: prompt.length,
    user_id: userId,
    has_prompt: !!prompt.trim(),
  });
};

/**
 * Track when AI design generation starts
 */
export const trackDesignGenerationStart = (prompt: string, style: string) => {
  safeLogEvent("design_generation_start", {
    prompt_length: prompt.length,
    design_style: style,
  });
};

/**
 * Track when AI design generation succeeds
 */
export const trackDesignGenerationSuccess = (
  prompt: string,
  style: string,
  generationTime?: number
) => {
  safeLogEvent("design_generation_success", {
    prompt_length: prompt.length,
    design_style: style,
    generation_time_ms: generationTime,
  });
};

/**
 * Track when AI design generation fails
 */
export const trackDesignGenerationError = (prompt: string, error: string) => {
  safeLogEvent("design_generation_error", {
    prompt_length: prompt.length,
    error_message: error,
  });
};

/**
 * Track when user selects a pre-existing design from gallery
 */
export const trackDesignSelected = (productId: string, designUrl: string) => {
  safeLogEvent("design_selected", {
    product_id: productId,
    design_url: designUrl,
  });
};

// ==================== CUSTOMIZATION EVENTS ====================

/**
 * Track when user changes product color
 */
export const trackColorChange = (color: string, productId: string) => {
  safeLogEvent("color_changed", {
    color,
    product_id: productId,
  });
};

/**
 * Track when user changes product size/quantity
 */
export const trackSizeQuantityChange = (
  size: string,
  quantity: number,
  productId: string
) => {
  safeLogEvent("size_quantity_changed", {
    size,
    quantity,
    product_id: productId,
  });
};

// ==================== CHECKOUT EVENTS ====================

/**
 * Track when user clicks "Na blagajno" (Go to checkout)
 */
export const trackCheckoutInitiated = (
  productId: string,
  productName: string,
  totalAmount: number,
  totalQuantity: number,
  color: string,
  quantities: Record<string, number>
) => {
  safeLogEvent("begin_checkout", {
    product_id: productId,
    product_name: productName,
    value: totalAmount,
    currency: "EUR",
    total_quantity: totalQuantity,
    color,
    quantities: JSON.stringify(quantities),
  });
};

/**
 * Track checkout step completion
 */
export const trackCheckoutStep = (step: number, stepName: string) => {
  safeLogEvent("checkout_progress", {
    checkout_step: step,
    checkout_step_name: stepName,
  });
};

/**
 * Track when user completes contact info (step 2)
 */
export const trackContactInfoCompleted = () => {
  safeLogEvent("contact_info_completed", {
    checkout_step: 2,
  });
};

/**
 * Track when user proceeds to payment (step 3)
 */
export const trackPaymentInitiated = (totalAmount: number) => {
  safeLogEvent("add_payment_info", {
    value: totalAmount,
    currency: "EUR",
    checkout_step: 3,
  });
};

/**
 * Track when payment is submitted
 */
export const trackPaymentSubmitted = (
  totalAmount: number,
  paymentMethod?: string
) => {
  safeLogEvent("payment_submitted", {
    value: totalAmount,
    currency: "EUR",
    payment_method: paymentMethod || "unknown",
  });
};

/**
 * Track successful purchase
 */
export const trackPurchaseComplete = (
  transactionId: string,
  totalAmount: number,
  productId: string,
  productName: string,
  quantity: number
) => {
  safeLogEvent("purchase", {
    transaction_id: transactionId,
    value: totalAmount,
    currency: "EUR",
    product_id: productId,
    product_name: productName,
    quantity,
  });
};

// ==================== DROPOFF TRACKING ====================

/**
 * Track when user closes checkout drawer without completing
 */
export const trackCheckoutAbandoned = (
  lastStep: number,
  lastStepName: string,
  totalAmount: number
) => {
  safeLogEvent("checkout_abandoned", {
    last_step: lastStep,
    last_step_name: lastStepName,
    value: totalAmount,
    currency: "EUR",
  });
};

/**
 * Track when user navigates away from a page
 */
export const trackPageExit = (pageName: string, timeOnPage?: number) => {
  safeLogEvent("page_exit", {
    page_name: pageName,
    time_on_page_seconds: timeOnPage,
  });
};

// ==================== SCROLL & ENGAGEMENT ====================

/**
 * Track when user scrolls to products section on landing page
 */
export const trackScrollToProducts = () => {
  safeLogEvent("scroll_to_products", {
    section: "products",
  });
};

/**
 * Track general page view
 */
export const trackPageView = (pageName: string, pageUrl: string) => {
  safeLogEvent("page_view", {
    page_title: pageName,
    page_location: pageUrl,
  });
};

// ==================== ERROR TRACKING ====================

/**
 * Track errors in the application
 */
export const trackError = (
  errorName: string,
  errorMessage: string,
  errorStack?: string
) => {
  safeLogEvent("error_occurred", {
    error_name: errorName,
    error_message: errorMessage,
    error_stack: errorStack,
  });
};

export default analytics;
export { initAnalytics };
