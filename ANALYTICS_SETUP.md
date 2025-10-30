# Google Analytics Setup Guide

## Prerequisites

Your Firebase project should already have:

- ✅ Firebase initialized
- ✅ Firebase Analytics enabled in Firebase Console
- ✅ `measurementId` configured in environment variables

## Quick Start

### 1. Verify Firebase Analytics is Enabled

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Analytics** → **Dashboard**
4. If not enabled, click "Enable Google Analytics"

### 2. Environment Variables

Ensure your `.env.local` file has:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id  # Important!
```

### 3. Test Implementation

#### Enable Debug Mode

Add `?analytics_debug=true` to your URL during testing:

```
http://localhost:3000?analytics_debug=true
```

#### View Real-Time Events

1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to **Analytics** → **DebugView**
3. Perform actions in your app
4. Watch events appear in real-time

### 4. Link to Google Analytics 4

Firebase Analytics automatically creates a GA4 property. To view in GA4:

1. Go to Firebase Console → Analytics → Settings
2. Click "View in Google Analytics"
3. This opens your GA4 property

## Testing Checklist

Run through these user flows and verify events in DebugView:

### Landing Page Flow

1. ✅ Visit landing page → See `page_view`
2. ✅ Click "Ustvari Motiv" in hero → See `create_design_hero`
3. ✅ Click product card → See `customize_design_click`

### Design Creation Flow

1. ✅ Enter prompt → See `prompt_entered`
2. ✅ Generate design → See `design_generation_start` → `design_generation_success`

### Checkout Flow

1. ✅ Click "Na blagajno" → See `begin_checkout`
2. ✅ Fill contact info → See `contact_info_completed`
3. ✅ Proceed to payment → See `add_payment_info`
4. ✅ Complete payment → See `purchase`

## Common Issues

### Events Not Appearing

**Issue**: Events not showing in DebugView

**Solutions**:

1. Ensure `?analytics_debug=true` is in URL
2. Check browser console for Firebase errors
3. Verify `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` is set
4. Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

### Events Not in Production GA4

**Issue**: Events show in DebugView but not in GA4 Reports

**Solution**:

- GA4 has a 24-48 hour delay for most reports
- Use **Realtime** view for immediate feedback
- Navigate to: Analytics → Realtime → Event count by Event name

### TypeScript Errors

**Issue**: Unused import warnings

**Solution**:

- These are safe to ignore - Next.js tree-shaking removes unused code
- Or you can add `// eslint-disable-next-line` comments

## Custom Dimensions (Optional)

To add custom dimensions in GA4:

1. Go to GA4 → Admin → Custom Definitions
2. Click "Create custom dimension"
3. Add custom parameters like:
   - `user_id`
   - `product_id`
   - `design_style`

## BigQuery Export (Optional)

For advanced analytics:

1. Go to Firebase Console → Analytics → Settings
2. Click "Link to BigQuery"
3. Enable daily export
4. Query events with SQL

Example query:

```sql
SELECT
  event_name,
  COUNT(*) as event_count,
  COUNTIF(event_name = 'purchase') as purchases
FROM `your-project.analytics_XXXXX.events_*`
WHERE _TABLE_SUFFIX BETWEEN '20241030' AND '20241130'
GROUP BY event_name
ORDER BY event_count DESC
```

## Monitoring & Alerts

### Set Up Conversion Events

Mark important events as conversions:

1. Go to GA4 → Configure → Events
2. Find events like:
   - `purchase`
   - `begin_checkout`
   - `design_generation_success`
3. Toggle "Mark as conversion"

### Create Alerts

1. Go to GA4 → Configure → Custom Alerts
2. Create alerts for:
   - Drop in `purchase` events
   - Increase in `checkout_abandoned` events
   - Spike in `design_generation_error` events

## Data Retention

By default, GA4 retains data for 2 months. To extend:

1. Go to GA4 → Admin → Data Settings → Data Retention
2. Change to **14 months** (maximum for standard properties)

## Privacy & GDPR Compliance

### Cookie Consent

If targeting EU users, add cookie consent banner:

```tsx
// Install a consent manager like:
npm install @cookiehub/cookiehub-react
```

Then conditionally initialize analytics:

```tsx
if (userHasConsented) {
  getAnalytics(app);
}
```

### IP Anonymization

Firebase Analytics automatically anonymizes IP addresses in the EU.

### User Deletion

To handle GDPR deletion requests:

```typescript
import { getAnalytics, setUserId } from "firebase/analytics";

// When user requests deletion
setUserId(analytics, null);
```

## Support & Resources

- [Firebase Analytics Documentation](https://firebase.google.com/docs/analytics)
- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [Firebase Console](https://console.firebase.google.com)
- [GA4 Demo Account](https://support.google.com/analytics/answer/6367342)

## Next Steps

After deployment:

1. ✅ Monitor DebugView for 1-2 days
2. ✅ Create custom reports (see ANALYTICS.md)
3. ✅ Set up conversion tracking
4. ✅ Configure alerts
5. ✅ Export to BigQuery (optional)
6. ✅ Add cookie consent (if needed)

---

**Questions?** Check the full documentation in `ANALYTICS.md` and `ANALYTICS_CHECKLIST.md`
