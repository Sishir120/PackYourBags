# GlowUp Hub: Deployment & Release Guide

This guide covers the steps to take the application from your local machine to a production-ready URL on Vercel, connected to a Neon (PostgreSQL) database.

> [!IMPORTANT]
> **Prerequisite**: Ensure you have pushed your latest code to GitHub.
> This project uses **Next.js 16** and **Prisma 5.19**. Ensure your Vercel Node.js version is set to 20 or 22.

## 1. Environment Setup (Vercel)

Go to your Vercel Project Settings > Environment Variables and add the following.

### **Database (Neon PostgreSQL)**
- `DATABASE_URL`: `postgres://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require` (Pooled connection)
- `DIRECT_URL`: `postgres://user:pass@ep-xyz.region.aws.neon.tech/neondb?sslmode=require` (Direct connection, same as above if Neon doesn't give a separate one, but usually it does for migrations)

### **Authentication (NextAuth.js)**
- `AUTH_SECRET`: Generate a new secure string using `openssl rand -base64 32` or a random string generator. **Do not use the development secret.**
- `AUTH_URL`: `https://your-production-url.vercel.app` (The domain Vercel assigns you)
- `NEXT_PUBLIC_APP_URL`: `https://your-production-url.vercel.app`

### **Stripe (Payments)**
- `STRIPE_SECRET_KEY`: Your **Live** Mode Secret Key (`sk_live_...`)
- `STRIPE_WEBHOOK_SECRET`: The signing secret from your **Stripe Dashboard > Webhooks** (Add your Vercel URL endpoint: `https://.../api/stripe/webhook`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your **Live** Mode Publishable Key (`pk_live_...`)

---

## 2. Database Migration

The local development used SQLite. Production uses PostgreSQL. You need to initialize the schema on the remote database.

1.  **Connect to Production DB Locally (One-time)**
    Create a `.env.production` file (or just modify `.env` temporarily) with your **Neon Database URL**.

2.  **Run the Migration**
    Open your terminal in `glowuphub/web`:
    ```bash
    # This pushes the schema state to the production DB
    npx prisma migrate deploy
    ```
    *Note: `migrate deploy` uses the schema to create tables. It assumes the DB is fresh.*

3.  **Seed Data (Optional)**
    If you have initial categories or plans, you might need to run a seed script or create them via the Admin UI.

---

## 3. Verify Deployment

Once Vercel finishes the build:

1.  **Visit /register**: Create a new user account.
2.  **Check Database**: Verify the user appears in your Neon dashboard.
3.  **Test Payment (Low Value)**: Create a $1 product in Stripe live mode and test the checkout flow to verify the webhook.
4.  **Mobile View**: Open the site on your phone. Verify the sticky bottom bar and performance.

## 4. Troubleshooting

- **500 Error on Login**: Check `AUTH_SECRET` and `DATABASE_URL`.
- **404 on Dashboard**: Check `NEXT_PUBLIC_APP_URL`.
- **Stripe Error**: Check `STRIPE_WEBHOOK_SECRET` exact match.
