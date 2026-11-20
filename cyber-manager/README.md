# SUPAGE CYBER MANAGER — Production specification and setup

## Product specification

- **Receipt/business name:** AJD CYBER MANAGER
- **Currency:** KES (Kenyan Shillings); timezone: Africa/Nairobi
- **Users:** one administrator and two staff accounts. Accounts are provisioned in Supabase Auth; new profiles default to `staff`. The first trusted profile must be promoted manually by the project owner. Do not expose a service-role key in the app.
- **App:** responsive installable React PWA for dashboard, product inventory, point of sale, receipts, and daily sales reports.
- **Database/security:** Supabase Postgres with Row Level Security. Products, sales, and line items are cloud stored; sales and stock updates are atomic in `create_sale`. This is a starting production architecture; review access policies and perform independent security testing before storing live business data.
- **M-Pesa:** optional Safaricom Daraja STK Push via Supabase Edge Functions. M-Pesa sales remain pending until the server independently queries Daraja; failed payments restore stock. Credentials remain server-side. Card is record-only and is not processed.
- **Offline behavior:** app shell can load from cache; authentication, writes, payments, and database-backed content require connectivity. No sensitive API/auth responses are cached.

## Setup

1. Create a Supabase project and configure email/password auth, strong password policy, MFA for the administrator, SMTP, backups/PITR, and appropriate production auth URLs.
2. Run `supabase/schema.sql` in the SQL editor. Review SQL and RLS policies for your deployment before using live data.
3. Create one admin and two staff users in Supabase Auth. Promote the trusted admin profile using the documented SQL. Set each profile's `full_name` appropriately. Disable public self-registration in Auth settings.
4. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` plus `VITE_SUPABASE_PUBLISHABLE_KEY`. Never use the service-role key in a `VITE_` variable.
5. Install, type-check/build, and run:

```bash
npm install
npm run build
npm run dev
```

6. Deploy the static `dist/` output to HTTPS hosting. Configure SPA fallback to `index.html`; use the deployed origin in Supabase Auth redirect URLs.

## Daraja M-Pesa STK Push

1. Register a Safaricom Daraja app and test with sandbox credentials and test phone numbers. Obtain production credentials and approval before switching to production.
2. Deploy functions with Supabase CLI: `supabase functions deploy mpesa-stk` and `supabase functions deploy mpesa-callback`.
3. Set Edge Function secrets (never frontend variables): `MPESA_ENV` (`sandbox` or `production`), `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, `MPESA_SHORTCODE`, `MPESA_PASSKEY`, and `MPESA_CALLBACK_URL` (the deployed `mpesa-callback` function URL).
4. Configure the shortcode/transaction type appropriate to your Daraja product and callback allowlisting. The included integration is a deployment foundation; validate callback/query semantics and complete end-to-end sandbox and production tests with Safaricom before accepting payments.
5. A pending M-Pesa sale initiates an STK push. The callback is treated as untrusted and a server-side Daraja STK query is attempted before marking paid. Configure monitoring and a reconciliation process for timeouts or provider outages. Never treat the browser response or callback alone as proof of payment.

## Known deployment gates

- Admin onboarding, Supabase project setup, SMTP, auth policies, database backups, edge-function secrets, Daraja business credentials/approval, HTTPS hosting, monitoring, and sandbox/production reconciliation require operator configuration.
- The first UI version records one inventory item per sale action (not a multi-line cart). The schema supports multiple line items; a full cart, returns, audit ledger, tax configuration, purchase orders, and expense accounting need a later implementation.
- Validate that concurrent sales, authorization, timezone boundaries, offline transitions, and provider callbacks meet business requirements before production launch.
