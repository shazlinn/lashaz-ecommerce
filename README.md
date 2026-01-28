La Shaz E-Commerce Platform
A modern, full-featured e-commerce platform built with Next.js 15, specializing in beauty and cosmetics products with intelligent skin-type matching and personalized recommendations.

Features

Customer Features
-Intelligent Shade Finder: Quiz-based product recommendations matching skin type and preferences
-Personalized Shopping: Products filtered by skin compatibility (Oily, Dry, Combination)
-Wishlist Management: Save favorite products for later
-Shopping Cart: Full cart functionality with persistent state
-Product Discovery: Browse by category, tags, and new arrivals
-Real-time Chat Assistant: AI-powered beauty consultant using OpenAI
-User Authentication: Secure login/signup with NextAuth.js
-Profile Management: User dashboard with order history

Admin Features
-Product Management: Create, edit, and delete products with image uploads
-User Management: Create, edit, activate/deactivate user accounts
-Order Tracking: View and manage customer orders
-Category & Tag Management: Organize products with flexible taxonomy
-Dashboard Analytics: Quick overview of store metrics
-Skin Type Matching: Assign products to specific skin types for personalized recommendations

Tech Stack
Frontend
-Framework: Next.js 15 (App Router)
-Styling: Tailwind CSS v4
-UI Components: Heroicons, Framer Motion
-Fonts: Google Fonts (Poppins, Josefin Sans, Work Sans)
-State Management: React Context API

Backend
-Database: PostgreSQL with Prisma ORM
-Authentication: NextAuth.js with credentials provider
-File Upload: UploadThing
-API: Next.js API Routes
-Password Hashing: bcryptjs

AI Integration
Chat Assistant: OpenAI SDK with streaming responses (in the works)
Shade Finder: Custom matching algorithm based on user preferences

Prerequisites
-Node.js 20.19.6 or higher
-PostgreSQL database
-OpenAI API key (for chat assistant)
-UploadThing account (for image uploads)

Installation
1. Clone the repo

2. Install dependencies
npm install

3. Set up env variables
DATABASE_URL=""
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
OPENAI_API_KEY="your-openai-api-key"
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

4. Setup database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

5. Run dev server
npm run dev

lashaz-ecommerce/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin dashboard pages
│   │   ├── orders/         # Order management
│   │   ├── products/       # Product CRUD
│   │   └── users/          # User management
│   ├── api/                # API routes
│   │   ├── admin/         # Admin-only endpoints
│   │   ├── auth/          # NextAuth endpoints
│   │   └── register/      # User registration
│   ├── cart/              # Shopping cart page
│   ├── context/           # React context providers
│   ├── login/             # Authentication pages
│   ├── product/           # Product detail pages
│   ├── profile/           # User profile
│   ├── shade-finder/      # Skin type quiz
│   ├── shop/              # Main shopping page
│   └── wishlist/          # Saved products
├── components/
│   ├── admin/             # Admin UI components
│   ├── frontstore/        # Customer-facing components
│   └── ui/                # Shared UI components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── api.ts             # API helper functions
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Utility functions
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seeding
└── public/                # Static assets

License
This project is part of a Final Year Project (FYP) for educational purposes.

Acknowledgments
Next.js team for the amazing framework
Vercel for hosting and deployment tools
OpenAI for AI capabilities
Prisma for the excellent ORM


## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
