# La Shaz E-Commerce Platform

A modern, full-featured e-commerce platform built with **Next.js 15**, specializing in beauty and cosmetics products. The platform includes an AI-powered chat assistant and a personalized shade finder to help customers find suitable products.

## Features

### Customer Features

* **Shade Finder:** Quiz-based shade matching for foundation products
* **Product Discovery:** Browse products by category, price, and product attributes
* **Wishlist:** Save favorite products for later
* **Shopping Cart:** Add, update, and remove products from the cart
* **Product Details:** View product information, pricing, availability, and descriptions
* **AI Chat Assistant:** AI-powered assistant for answering customer questions about products, orders, and store information
* **User Authentication:** Secure login and registration using NextAuth.js
* **Profile Management:** View profile information and order history
* **Order Tracking:** View order status and delivery information
* **Invoice:** View order and payment details

### Admin Features

* **Product Management:** Create, edit, and delete products
* **User Management:** Manage customer accounts and admin users
* **Order Management:** View and update customer orders
* **Category Management:** Create and manage product categories
* **Product Stock Management:** Update product prices and stock availability
* **Order Tracking:** Update order status and courier tracking information
* **Dashboard:** View an overview of users, products, and orders

## Tech Stack

### Frontend

* **Framework:** Next.js 15 (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **UI:** React, Heroicons, Framer Motion
* **State Management:** React Context API

### Backend

* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** NextAuth.js
* **API:** Next.js API Routes
* **Password Hashing:** bcryptjs
* **Payment Gateway:** ToyyibPay
* **Email:** Resend

### AI Integration

* **Chat Assistant:** Groq API using `llama-3.3-70b-versatile` with streaming responses
* **Shade Finder:** Custom matching algorithm based on user-selected preferences

## Prerequisites

Before running the project, make sure you have:

* Node.js 20.19.6 or higher
* PostgreSQL
* Groq API key
* UploadThing account for image uploads
* ToyyibPay account for payment integration
* Resend API key for email notifications

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/shazlinn/lashaz-ecommerce.git
cd lashaz-ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your-database-url"

NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

GROQ_API_KEY="your-groq-api-key"

UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

NEXT_PUBLIC_APP_URL="http://localhost:3000"

RESEND_API_KEY="your-resend-api-key"
```

Add any additional environment variables required by your ToyyibPay configuration.

### 4. Set up the database

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Seed the database:

```bash
npx prisma db seed
```

### 5. Run the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

## Project Structure

```text
lashaz-ecommerce/
├── app/
│   ├── admin/                    # Admin dashboard
│   │   ├── orders/               # Order management
│   │   ├── products/             # Product management
│   │   └── users/                # User management
│   │
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin-only endpoints
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── chat/                 # AI chat assistant
│   │   └── register/             # User registration
│   │
│   ├── cart/                     # Shopping cart
│   ├── context/                  # React context providers
│   ├── login/                    # Login page
│   ├── product/                  # Product detail pages
│   ├── profile/                  # User profile and orders
│   ├── shade-finder/             # Shade finder
│   ├── shop/                     # Product browsing
│   └── wishlist/                 # Wishlist
│
├── components/
│   ├── admin/                    # Admin UI components
│   ├── frontstore/               # Customer-facing components
│   └── ui/                       # Shared UI components
│
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── api.ts                    # API helper functions
│   ├── prisma.ts                 # Prisma client
│   └── utils.ts                  # Utility functions
│
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding
│
└── public/                       # Static assets
```

## License

This project was developed as part of a Final Year Project (FYP) for educational purposes.

## Acknowledgments

* [Next.js](https://nextjs.org/) for the framework
* [Vercel](https://vercel.com/) for deployment
* [Prisma](https://www.prisma.io/) for the ORM
* [Groq](https://groq.com/) for AI inference
* [ToyyibPay](https://toyyibpay.com/) for payment processing
* [Resend](https://resend.com/) for email services
* [UploadThing](https://uploadthing.com/) for file uploads

````

## Deployment

The application can be deployed using [Vercel](https://vercel.com/).

For more information, refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

### A few things I intentionally changed

- Removed the old **“Personalized Shopping: Products filtered by skin compatibility (Oily, Dry, Combination)”** because your current system is more accurately described by the **Shade Finder**.
- Changed **OpenAI** to **Groq**, matching your actual implementation.
- Removed **“in the works”** from the chatbot.
- Added **ToyyibPay, Resend, and UploadThing** to the tech stack because they're actual parts of your system.
- Put the project structure inside a proper ` ```text ` block so GitHub renders it correctly.
- Made the structure match the features you actually have, rather than making the README look like a generic Next.js template.
- Removed the old **Deploy on Vercel** template text and replaced it with a simple deployment section.

One thing I'd **double-check before committing** is the exact folder names in your repo, especially `app/api/chat/`. If you paste your actual `app/` folder structure, I can make this **100% match your repository instead of guessing any folders**.
````
