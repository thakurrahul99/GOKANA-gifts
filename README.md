# GŌKANA — Premium Gifting E-Commerce

Full-stack MERN app. `server/` is a Node/Express + MongoDB API, `client/` is a
Vite + React storefront.

## ⚠️ Before you deploy — rotate all credentials

`server/.env` was previously committed to this repository (git history), which
means the MongoDB Atlas connection string, JWT secret, and Cloudinary API
secret it contained must be treated as **compromised**, even though they've
now been removed from tracking and `git rm --cached`'d:

1. **MongoDB Atlas** → Database Access → change/regenerate the database
   user's password.
2. **JWT_SECRET** → generate a new random value (`openssl rand -hex 32`) —
   this will log out all existing users, which is expected.
3. **Cloudinary** → Settings → Security → regenerate the API secret.
4. **Razorpay** → regenerate the key secret and webhook secret from the
   dashboard if this project ever goes live with the old ones.
5. Put the new values only in your local `server/.env` (now gitignored) and
   in your hosting provider's environment variable settings — never in git.

If you want the *old* secrets fully scrubbed from git history (not just the
latest commit), use `git filter-repo` or BFG Repo-Cleaner and force-push —
do this only after rotating the credentials above, and only if you have
push access and everyone re-clones afterward.

## Setup

### Server
```bash
cd server
cp .env.example .env   # fill in your own values
npm install
npm run seed            # optional: seed sample products/categories
npm run dev              # http://localhost:5000
```

### Client
```bash
cd client
cp .env.example .env   # defaults to http://localhost:5000/api
npm install
npm run dev              # http://localhost:5173
```

## Environment variables

See `server/.env.example` and `client/.env.example` for the full list.
Notably:
- `RAZORPAY_WEBHOOK_SECRET` must be set for the Razorpay webhook
  (`/api/webhooks/razorpay`) to verify signatures — without it the server
  will log a warning and accept webhook events unverified. Configure the
  webhook URL and secret in the Razorpay Dashboard → Settings → Webhooks,
  subscribed to `payment.captured`, `payment.failed`, `refund.processed`.

## Known gaps (not yet wired up)

- `CheckoutPage.jsx` currently **simulates** order placement (a `setTimeout`
  fake order ID) — it does not yet call `POST /api/orders` or the Razorpay
  checkout flow. The backend endpoints are ready; the checkout page still
  needs to be connected to them before going live.
- `AccountPage.jsx`'s order history is a hardcoded mock list — not yet
  fetching from `GET /api/orders/my`.
