# ShopVerse - Premium E-Commerce Platform

A modern, full-stack e-commerce platform built with Next.js 15, featuring real-time chat, 3D animations, and a comprehensive admin panel.

## 🚀 Features

- ✨ **GSAP Animations** - Eye-catching button animations and smooth transitions
- 🎨 **Three.js 3D Background** - Theme-aware 3D animated hero section
- 🖼️ **Real Product Images** - Professional Unsplash photography
- 🛒 **Full E-commerce** - Cart, wishlist, checkout, orders
- 🔐 **Authentication** - Google & GitHub OAuth with NextAuth v5
- 💳 **Stripe Integration** - Secure payment processing
- 💬 **Real-time Chat** - AI chatbot + live agent support
- 📊 **Admin Dashboard** - Analytics, orders, products management
- 🌓 **Dark Mode** - Beautiful theme switching
- 📱 **Responsive Design** - Mobile-first approach

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma v5
- **Authentication:** Auth.js v5 (NextAuth)
- **Animations:** Framer Motion + GSAP + Three.js
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Payment:** Stripe
- **Email:** Resend

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd shopverse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Then fill in your actual credentials in `.env`

4. **Set up the database:**
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open** [http://localhost:3000](http://localhost:3000)

## 🌐 Deployment on Vercel

This project is optimized for Vercel deployment.

### Environment Variables Required:

- `DATABASE_URL` - Your PostgreSQL connection string
- `AUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `AUTH_URL` - Your production URL
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`
- `STRIPE_SECRET_KEY` & `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `RESEND_API_KEY` (for emails)

### Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

## 👤 Test Accounts

- **Admin:** admin@shopverse.com / admin123
- **Customer:** john@example.com / customer123
- **Support:** sarah@shopverse.com / support123

## 📝 License

MIT

## 🎉 Built with Love

This project was built with love, featuring stunning GSAP animations and professional design.
