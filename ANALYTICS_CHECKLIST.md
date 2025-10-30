# Analytics Implementation Checklist

## ✅ Completed Tasks

### Core Infrastructure

- [x] Created centralized analytics utility (`/src/lib/firebase/analytics.ts`)
- [x] Integrated Firebase Analytics with existing Firebase setup
- [x] Created type-safe tracking functions

### Landing Page Tracking

- [x] Track "create design" from hero section
- [x] Track "create design" from header navigation
- [x] Track "customize design" clicks on product cards
- [x] Track landing page views

### Product & Design Tracking

- [x] Track product page views
- [x] Track design selection from gallery
- [x] Track color changes
- [x] Track size/quantity changes

### AI Design Generation Tracking

- [x] Track prompts entered (with user ID)
- [x] Track design generation start
- [x] Track design generation success (with timing)
- [x] Track design generation errors

### Checkout Tracking

- [x] Track "Na blagajno" (checkout initiation)
- [x] Track checkout step progression (3 steps)
- [x] Track contact info completion
- [x] Track payment initiation
- [x] Track payment submission

### Dropout Tracking

- [x] Track checkout abandonment (when user closes drawer)
- [x] Track at which step user abandoned

### Purchase Tracking

- [x] Track successful purchase completion
- [x] Include transaction ID from Stripe

## 📋 Testing Checklist

Before deploying to production, test each event:

### Landing Page Events

- [ ] Click "Ustvari Motiv" in hero section (should track `create_design_hero`)
- [ ] Click "Ustvari Motiv" in header (should track `create_design_header`)
- [ ] Click on a product card (should track `customize_design_click`)

### Design Creation Flow

- [ ] Enter a prompt (should track `prompt_entered`)
- [ ] Generate a design (should track `design_generation_start` → `design_generation_success`)
- [ ] Trigger an error (should track `design_generation_error`)

### Product Customization

- [ ] Visit a product page (should track `view_item`)
- [ ] Select a design from gallery (should track `design_selected`)
- [ ] Change color (should track `color_changed`)
- [ ] Change size/quantity (should track `size_quantity_changed`)

### Checkout Flow

- [ ] Click "Na blagajno" (should track `begin_checkout`)
- [ ] View step 1 (should track `checkout_progress` step 1)
- [ ] Complete contact info and proceed (should track `contact_info_completed` + `checkout_progress` step 2)
- [ ] Proceed to payment (should track `add_payment_info` + `checkout_progress` step 3)
- [ ] Submit payment (should track `payment_submitted`)
- [ ] Complete purchase (should track `purchase`)

### Dropout Tracking

- [ ] Close checkout drawer at step 1 (should track `checkout_abandoned` with step 1)
- [ ] Close checkout drawer at step 2 (should track `checkout_abandoned` with step 2)

## 🔍 Verification Steps

### Using Firebase DebugView

1. Open Firebase Console: https://console.firebase.google.com
2. Navigate to: Analytics → DebugView
3. Add `?analytics_debug=true` to your app URL
4. Perform actions and watch events appear in real-time

### Using Browser Console

Events are also logged to the browser console during development. Check for:

```javascript
// Firebase Analytics logs
[Firebase Analytics] event logged: create_design_hero
```

### Using Google Analytics 4

1. Wait 24-48 hours for data to appear in GA4
2. Go to Reports → Events
3. Check that custom events appear with correct parameters

## 📊 Custom Reports to Create

After deployment, create these custom reports in Firebase/GA4:

1. **Landing Page Funnel**

   - Steps: page_view → (create_design OR customize_design) → begin_checkout → purchase

2. **Design Creation Funnel**

   - Steps: prompt_entered → design_generation_success → begin_checkout → purchase

3. **Checkout Funnel**

   - Steps: begin_checkout → contact_info_completed → add_payment_info → purchase

4. **Abandonment Analysis**

   - Event: checkout_abandoned
   - Dimension: last_step
   - Metric: Event count

5. **User Engagement**
   - Event: prompt_entered
   - Dimension: user_id
   - Metric: Event count per user

## 🐛 Known Issues & Notes

- [ ] Some TypeScript lint errors exist but don't affect functionality (unused imports due to build optimization)
- [ ] Analytics only works on client-side (as expected with Firebase)
- [ ] `payment_method` parameter in Stripe is currently "unknown" - may need to extract from Stripe's PaymentElement

## 🚀 Next Steps (Optional Enhancements)

- [ ] Add user property tracking (e.g., user type, preferred style)
- [ ] Add custom payment method tracking (extract from Stripe)
- [ ] Add scroll depth tracking on landing page
- [ ] Add A/B test tracking for different design styles
- [ ] Add conversion attribution tracking
- [ ] Set up automated alerts for drop in conversion rates
- [ ] Create BigQuery export for advanced analytics

## 📝 Questions to Answer with Analytics

After data collection, you can answer:

1. **User Journey:**

   - What percentage of landing page visitors click "create design" vs "customize design"?
   - What's the conversion rate from landing page to checkout?

2. **Design Creation:**

   - How many users create custom designs vs selecting existing ones?
   - What's the average number of prompts per user?
   - What's the success rate of AI design generation?

3. **Checkout:**

   - What percentage of users who start checkout complete it?
   - At which step do most users drop off?
   - What's the average order value?

4. **Product Performance:**
   - Which products get the most views?
   - Which designs are selected most often?
   - Which colors are most popular?

## 📚 Documentation

Full documentation available in `/ANALYTICS.md`
