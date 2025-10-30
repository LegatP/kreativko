# Analytics Troubleshooting Guide

## Issue: No events appearing in Firebase DebugView or console

### Quick Diagnostic Steps

1. **Open Browser Console**

   - Press F12 or Cmd+Option+I (Mac)
   - Go to Console tab
   - Look for messages starting with `[Analytics]` or `[FirebaseProvider]`

2. **Check for these messages:**

   ✅ **Good signs:**

   ```
   [FirebaseProvider] Initializing analytics...
   [FirebaseProvider] Analytics initialized: <object>
   [Analytics] Firebase Analytics initialized successfully
   [Analytics] Logging event: page_view {...}
   ```

   ❌ **Problem signs:**

   ```
   [Analytics] Analytics not initialized, event not logged
   [FirebaseProvider] Error initializing analytics: <error>
   [Analytics] Failed to initialize Firebase Analytics: <error>
   ```

### Common Issues & Solutions

#### Issue 1: "Analytics not initialized"

**Cause:** Analytics SDK not loading properly

**Solutions:**

1. Restart your dev server:

   ```bash
   npm run dev
   ```

2. Clear browser cache and hard reload:

   - Mac: Cmd+Shift+R
   - Windows: Ctrl+Shift+R

3. Check that you're running in development mode (not production build)

#### Issue 2: No measurement ID

**Verify environment variable:**

```bash
cat .env | grep MEASUREMENT
```

Should show:

```
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

If missing, add it to your `.env` file.

#### Issue 3: Debug mode not enabled

**Add to URL:**

```
http://localhost:3000?analytics_debug=true
```

This is REQUIRED for events to appear in Firebase DebugView!

#### Issue 4: Wrong Firebase project

**Check `.env` file:**

```bash
cat .env | grep FIREBASE
```

Verify:

- `NEXT_PUBLIC_FIREBASE_PROJECT_ID` matches your Firebase project
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` matches your GA4 property

### Step-by-Step Testing

1. **Restart dev server:**

   ```bash
   npm run dev
   ```

2. **Open browser with console:**

   ```
   http://localhost:3000?analytics_debug=true
   ```

   Open DevTools (F12) → Console tab

3. **Look for initialization messages:**

   - Should see `[FirebaseProvider] Initializing analytics...`
   - Should see `[FirebaseProvider] Analytics initialized:`

4. **Trigger an event:**

   - Click anywhere on the landing page
   - Should see `[Analytics] Logging event: page_view {...}`

5. **Check Firebase Console:**
   - Open https://console.firebase.google.com
   - Go to Analytics → DebugView
   - Should see your device and events within 1-2 minutes

### Manual Test Script

Run this in the browser console to test analytics directly:

```javascript
// Import and test analytics
import { trackPageView } from "/src/lib/firebase/analytics";

// This should log to console
trackPageView("Test Page", window.location.href);
```

### Firebase DebugView Setup

1. **Enable DebugView in Firebase Console:**

   - Go to https://console.firebase.google.com
   - Select your project
   - Analytics → DebugView
   - Click "Enable Debug Mode"

2. **Add debug parameter to URL:**

   ```
   http://localhost:3000?analytics_debug=true
   ```

3. **Look for your device:**
   - Should appear in DebugView within 1-2 minutes
   - Device name is usually your browser/OS

### Still Not Working?

Check these:

1. **Browser Console Errors:**

   - Any red errors related to Firebase?
   - Any blocked network requests?

2. **Network Tab:**

   - Filter by "google-analytics" or "firebase"
   - Should see requests being sent

3. **Ad Blockers:**

   - Disable ad blockers (they often block analytics)
   - Try incognito/private mode

4. **Firewall/VPN:**
   - Some corporate firewalls block analytics
   - Try on different network

### Get Detailed Logs

Add this to see exactly what's happening:

```typescript
// In src/lib/firebase/analytics.ts
console.log("Environment:", {
  isClient: typeof window !== "undefined",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
});
```

### Contact Support

If still not working, gather this info:

1. Browser console logs (screenshot)
2. Network tab (filter: google-analytics)
3. Environment variables (without sensitive values)
4. Firebase project ID
5. What events you're trying to track
6. What you see in the console

---

## Updated Files

I've updated the following files with better error logging:

- `/src/lib/firebase/analytics.ts` - Added console.log for all events
- `/src/components/firebase/FirebaseProvider.tsx` - Added initialization logging

**Now restart your dev server and check the console!**
