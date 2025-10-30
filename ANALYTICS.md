# Google Analytics (Firebase) Event Tracking

This document outlines all the Google Analytics events tracked in the Kreativko application via Firebase Analytics.

## Overview

All analytics tracking is centralized in `/src/lib/firebase/analytics.ts`. Events are automatically logged to Firebase Analytics and can be viewed in the Firebase Console and Google Analytics 4.

## Key Questions Answered

The implemented tracking allows you to answer these critical business questions:

### 1. **Do people from landing page continue to product or create motif?**

- Track with: `create_design_hero`, `create_design_header`, `customize_design_click`
- Compare counts to determine user preference

### 2. **Do people create designs?**

- Track with: `prompt_entered`, `design_generation_start`, `design_generation_success`
- Monitor conversion rate from prompt entry to successful generation

### 3. **Do people go to checkout?**

- Track with: `begin_checkout`, `checkout_progress`, `checkout_abandoned`
- Monitor funnel from product customization → checkout steps → payment

## Tracked Events

### Landing Page Events

#### `create_design_hero`

Tracks when user clicks "Ustvari Motiv" from the hero section form.

- **Parameters:**
  - `source`: "hero_section"
  - `has_description`: boolean
  - `description_length`: number

#### `create_design_header`

Tracks when user clicks "Ustvari Motiv" from the header navigation.

- **Parameters:**
  - `source`: "header"

#### `customize_design_click`

Tracks when user clicks on a product card to customize an existing design.

- **Parameters:**
  - `product_id`: string
  - `product_name`: string
  - `source`: "product_card"

#### `page_view`

Tracks general page views.

- **Parameters:**
  - `page_title`: string
  - `page_location`: string (URL)

### Product & Design Events

#### `view_item`

Tracks when user views a product page (e.g., product customization page).

- **Parameters:**
  - `product_id`: string
  - `product_name`: string

#### `design_selected`

Tracks when user selects a pre-existing design from the gallery.

- **Parameters:**
  - `product_id`: string
  - `design_url`: string

### AI Design Generation Events

#### `prompt_entered`

Tracks when user enters a prompt for AI generation.

- **Parameters:**
  - `prompt_length`: number
  - `user_id`: string (if authenticated)
  - `has_prompt`: boolean

#### `design_generation_start`

Tracks when AI design generation begins.

- **Parameters:**
  - `prompt_length`: number
  - `design_style`: string (e.g., "Colorful", "Monotone")

#### `design_generation_success`

Tracks successful AI design generation.

- **Parameters:**
  - `prompt_length`: number
  - `design_style`: string
  - `generation_time_ms`: number (time taken to generate)

#### `design_generation_error`

Tracks failed AI design generation.

- **Parameters:**
  - `prompt_length`: number
  - `error_message`: string

### Customization Events

#### `color_changed`

Tracks when user changes product color.

- **Parameters:**
  - `color`: string (hex color code)
  - `product_id`: string

#### `size_quantity_changed`

Tracks when user changes product size/quantity.

- **Parameters:**
  - `size`: string (e.g., "S", "M", "L")
  - `quantity`: number
  - `product_id`: string

### Checkout Events

#### `begin_checkout`

Tracks when user clicks "Na blagajno" (Go to checkout).

- **Parameters:**
  - `product_id`: string
  - `product_name`: string
  - `value`: number (total amount in EUR)
  - `currency`: "EUR"
  - `total_quantity`: number
  - `color`: string
  - `quantities`: string (JSON stringified object)

#### `checkout_progress`

Tracks progression through checkout steps.

- **Parameters:**
  - `checkout_step`: number (1, 2, or 3)
  - `checkout_step_name`: string ("Pregled naročila", "Podatki za dostavo", "Zaključek nakupa")

#### `contact_info_completed`

Tracks when user completes contact information (step 2).

- **Parameters:**
  - `checkout_step`: 2

#### `add_payment_info`

Tracks when user proceeds to payment (step 3).

- **Parameters:**
  - `value`: number (total amount in EUR)
  - `currency`: "EUR"
  - `checkout_step`: 3

#### `payment_submitted`

Tracks when payment is submitted.

- **Parameters:**
  - `value`: number (total amount in EUR)
  - `currency`: "EUR"
  - `payment_method`: string (e.g., "card", "unknown")

#### `purchase`

Tracks successful purchase completion.

- **Parameters:**
  - `transaction_id`: string (Stripe payment intent ID)
  - `value`: number (total amount in EUR)
  - `currency`: "EUR"
  - `product_id`: string
  - `product_name`: string
  - `quantity`: number

### Dropout Tracking

#### `checkout_abandoned`

Tracks when user closes checkout drawer without completing.

- **Parameters:**
  - `last_step`: number
  - `last_step_name`: string
  - `value`: number (total amount in EUR)
  - `currency`: "EUR"

## Analytics Queries & Reports

### Recommended Custom Reports in Firebase/GA4

1. **Landing Page Conversion Funnel**

   ```
   page_view (Landing Page)
   → create_design_hero OR create_design_header OR customize_design_click
   → begin_checkout
   → purchase
   ```

2. **Design Creation Funnel**

   ```
   prompt_entered
   → design_generation_start
   → design_generation_success
   → begin_checkout
   → purchase
   ```

3. **Checkout Completion Funnel**

   ```
   begin_checkout (Step 1)
   → contact_info_completed (Step 2)
   → add_payment_info (Step 3)
   → payment_submitted
   → purchase
   ```

4. **Dropout Analysis**

   - Track `checkout_abandoned` events grouped by `last_step` to identify where users drop off most

5. **User Engagement Metrics**
   - Track `prompt_entered` count per user to measure engagement
   - Track `design_generation_success` vs `design_generation_error` ratio

## Custom Queries

### Count prompts per user

```
Event: prompt_entered
Group by: user_id
Metric: Event count
```

### Average checkout value

```
Event: begin_checkout
Metric: Average value parameter
```

### Checkout abandonment rate by step

```
Events: checkout_progress, checkout_abandoned
Group by: checkout_step
Calculate: (abandoned / started) * 100
```

## Implementation Details

- **Server-Side Rendering**: Analytics only initializes on client-side (when `window` is available)
- **Privacy**: No personally identifiable information (PII) is tracked beyond what's necessary for Firebase Auth
- **Error Handling**: All tracking functions safely handle cases where analytics isn't initialized

## Testing

To verify events are being tracked:

1. Open Firebase Console → Analytics → DebugView
2. Enable debug mode by adding `?analytics_debug=true` to URL
3. Perform actions in the app
4. Check DebugView for real-time events

## Future Enhancements

Consider adding:

- [ ] A/B test tracking for different design styles
- [ ] Time-on-page tracking for product pages
- [ ] Scroll depth tracking on landing page
- [ ] User session recording integration
- [ ] Conversion attribution (which source/medium led to purchase)
- [ ] Product recommendation click tracking
