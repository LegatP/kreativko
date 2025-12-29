# Kreativko

An e-commerce application built with Next.js for creating designs for printing with AI.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Storage**: Firebase
- **Payments**: Stripe
- **Styling**: CSS/Tailwind

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Stripe Webhooks (Local Development)

To process payments locally, you need to listen to Stripe webhooks. Follow these steps:

1. **Login to Stripe CLI**:
   ```bash
   stripe login
   ```

2. **Forward webhooks to your local server**:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

This will output a webhook signing secret (starting with `whsec_`). Make sure to add it to your `.env.local` file as `STRIPE_WEBHOOK_SECRET`.

## Environment Variables

See `.env.example` for all required environment variables.

