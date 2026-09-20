# GŌKANA — Premium Gifting E-Commerce

GŌKANA is a full-stack MERN e-commerce application focused on premium gifts, personalised gifting, curated occasions, and an admin product-management dashboard.

## ✨ Highlights

- Premium gifting storefront built with React + Vite
- Product catalogue with search, product details, badges, pricing and stock
- Personalisation support for products
- Occasion-based gift categories
- Multi-category product assignment from the Admin panel
- Admin product create/edit/delete workflow
- **Category dropdown with multi-select support**
- Built-in occasion categories including:
  - 🎂 Birthday
  - 💍 Anniversary
  - 🌸 Wedding
  - 🪔 Diwali
  - ❤️ Valentine's Day
  - 💼 Corporate Gifting
  - 🙏 Thank You
  - ✨ Just Because
  - 👶 New Baby
  - 🏠 Housewarming
  - 🎓 Graduation
  - 🤝 Friendship
  - 🌷 Mother's Day
  - 👔 Father's Day
  - 🪢 Rakhi
  - 🎄 Christmas
  - 🎨 Holi
- Image uploads through the admin product form
- MongoDB-backed product, category, user, coupon and order APIs
- JWT-based authentication with admin protection
- Razorpay backend integration
- Responsive storefront and admin UI
- Tailwind CSS styling and Framer Motion animations

## 🏗️ Tech Stack

### Frontend

- React
- Vite
- React Router
- Zustand
- Tailwind CSS
- Framer Motion
- Lucide React
- Axios

### Backend

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Cloudinary
- Razorpay
- Helmet
- CORS
- Express Rate Limit

## 📁 Project Structure

```text
GOKANA-gifts/
├── client/                 # React + Vite storefront and admin UI
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── lib/
│   └── package.json
│
├── server/                 # Express + MongoDB API
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── scripts/
│   │   └── index.js
│   └── package.json
│
└── README.md
```

## 🚀 Local Development

### 1. Clone the repository

```bash
git clone https://github.com/thakurrahul99/GOKANA-gifts.git
cd GOKANA-gifts
```

### 2. Configure the backend

```bash
cd server
cp .env.example .env
npm install
```

Fill the required values in `server/.env`, especially your MongoDB connection and authentication/payment/cloud-storage credentials.

Start the API:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Configure the frontend

Open another terminal:

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

The Vite development server normally runs on:

```text
http://localhost:5173
```

## 🌱 Database Seeding

To populate a fresh database with sample categories, products, coupons and the initial admin account:

```bash
cd server
npm run seed
```

> **Important:** the seed script clears existing categories and coupons before inserting seed data. Do not run it against production data unless you intentionally want that behaviour.

The seed includes the full occasion category list used by the current admin product workflow.

## 🛍️ Product Categories

Products can belong to multiple occasions.

In **Admin → Products → Add Product/Edit Product**, the **Gift Categories / Occasions** field is a dropdown that allows multiple selections. Selected categories appear as chips and can be toggled on/off from the dropdown.

The category API also ensures the current default occasion categories are available for existing databases that were created with an older seed version.

## 👨‍💼 Admin Features

The admin dashboard includes product-management functionality such as:

- Create products
- Edit products
- Delete/deactivate products
- Upload product images
- Set pricing and original pricing
- Manage stock and availability
- Mark products as featured
- Add product badges
- Enable product personalisation
- Add personalisation fields
- Assign multiple gifting occasions/categories

Admin routes are protected using authentication and admin-role middleware.

## 🔐 Environment Variables

Use the example environment files:

- `server/.env.example`
- `client/.env.example`

Never commit real secrets to Git.

Typical backend configuration includes:

- MongoDB URI
- JWT secret
- Cloudinary credentials
- Razorpay credentials
- Razorpay webhook secret
- Client/frontend URL

## ⚠️ Security

If any real credentials were ever committed to Git history, treat them as compromised.

Rotate:

1. MongoDB database credentials
2. JWT secret
3. Cloudinary API secret
4. Razorpay key/webhook secrets

Keep secrets only in local environment files or your hosting provider's secret/environment-variable manager.

## 💳 Payments

The backend contains Razorpay integration and webhook handling.

Before going live:

- Configure production Razorpay credentials
- Configure the webhook URL
- Set `RAZORPAY_WEBHOOK_SECRET`
- Verify payment and webhook behaviour in the production environment

## 📌 Current Development Notes

The backend order endpoints are available, but some frontend checkout/account flows may still require final production wiring.

Before a production launch, verify:

- Checkout calls the real order API
- Razorpay checkout is fully connected
- Account order history uses the backend order API
- Production environment variables are configured
- Image uploads use production Cloudinary credentials
- Payment webhooks are verified
- Authentication and admin credentials are changed from development values

## 🧪 Build

Frontend production build:

```bash
cd client
npm run build
```

Backend production start:

```bash
cd server
npm start
```

## 📄 License

This project is currently maintained as a private/project-specific GŌKANA application. Add or update the license here if the repository is intended for public redistribution.

---

Built for **GŌKANA — thoughtful gifts, made personal.**
