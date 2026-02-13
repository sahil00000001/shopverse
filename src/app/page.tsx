"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useGSAPButton, useGSAPFadeIn, useGSAPScaleIn, useGSAPStagger, useGSAPFloating } from "@/hooks/use-gsap-animations";

const HeroBackground = dynamic(
  () => import("@/components/three/hero-background").then((mod) => mod.HeroBackground),
  { ssr: false }
);
import {
  ArrowRight,
  Zap,
  Timer,
  Truck,
  Shield,
  Headphones,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ProductCard,
  type Product,
} from "@/components/product/product-card";
import { cn, formatPrice } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                             Placeholder Data                               */
/* -------------------------------------------------------------------------- */

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Noise-Canceling Headphones Pro",
    slug: "wireless-noise-canceling-headphones-pro",
    price: 199.99,
    comparePrice: 299.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    category: "Electronics",
    rating: 4.8,
    reviewCount: 324,
    badge: "sale",
    gradient: "bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
  },
  {
    id: "2",
    name: "Premium Leather Crossbody Bag",
    slug: "premium-leather-crossbody-bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    category: "Fashion",
    rating: 4.6,
    reviewCount: 186,
    badge: "new",
    gradient: "bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20",
  },
  {
    id: "3",
    name: "Smart Home Security Camera 4K",
    slug: "smart-home-security-camera-4k",
    price: 149.99,
    comparePrice: 199.99,
    image: "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&q=80",
    category: "Electronics",
    rating: 4.7,
    reviewCount: 512,
    badge: "sale",
    gradient: "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20",
  },
  {
    id: "4",
    name: "Organic Essential Oils Collection",
    slug: "organic-essential-oils-collection",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    category: "Beauty",
    rating: 4.9,
    reviewCount: 278,
    badge: "trending",
    gradient: "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20",
  },
  {
    id: "5",
    name: "Ultra-Slim Laptop Stand Aluminum",
    slug: "ultra-slim-laptop-stand-aluminum",
    price: 59.99,
    comparePrice: 79.99,
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
    category: "Electronics",
    rating: 4.5,
    reviewCount: 143,
    badge: "sale",
    gradient: "bg-gradient-to-br from-slate-500/20 via-gray-500/10 to-zinc-500/20",
  },
  {
    id: "6",
    name: "Professional Yoga Mat Extra Thick",
    slug: "professional-yoga-mat-extra-thick",
    price: 45.99,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
    category: "Sports",
    rating: 4.7,
    reviewCount: 203,
    badge: "new",
    gradient: "bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-red-500/20",
  },
  {
    id: "7",
    name: "Bestselling Mystery Novel Box Set",
    slug: "bestselling-mystery-novel-box-set",
    price: 29.99,
    comparePrice: 49.99,
    image: "https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&q=80",
    category: "Books",
    rating: 4.8,
    reviewCount: 567,
    badge: "sale",
    gradient: "bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-sky-500/20",
  },
  {
    id: "8",
    name: "Ceramic Plant Pot Set Minimalist",
    slug: "ceramic-plant-pot-set-minimalist",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
    category: "Home & Garden",
    rating: 4.6,
    reviewCount: 92,
    badge: "trending",
    gradient: "bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20",
  },
];

const featuredCategories = [
  {
    name: "Electronics",
    href: "/products?category=electronics",
    emoji: "\uD83D\uDD0C",
    gradient: "from-blue-600 to-cyan-500",
    description: "Latest gadgets & tech",
  },
  {
    name: "Fashion",
    href: "/products?category=fashion",
    emoji: "\uD83D\uDC57",
    gradient: "from-pink-600 to-rose-500",
    description: "Trending styles",
  },
  {
    name: "Home & Garden",
    href: "/products?category=home-garden",
    emoji: "\uD83C\uDFE1",
    gradient: "from-green-600 to-emerald-500",
    description: "Decor & essentials",
  },
  {
    name: "Sports",
    href: "/products?category=sports-outdoors",
    emoji: "\u26BD",
    gradient: "from-orange-600 to-amber-500",
    description: "Gear & equipment",
  },
  {
    name: "Beauty",
    href: "/products?category=beauty-health",
    emoji: "\u2728",
    gradient: "from-purple-600 to-violet-500",
    description: "Skincare & cosmetics",
  },
];

const brands = [
  "TechNova",
  "StyleCraft",
  "GreenLife",
  "SportPeak",
  "GlowUp",
  "PageTurner",
  "HomeBliss",
  "FitZone",
];

const trustBadges = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "256-bit SSL encryption",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated help center",
  },
  {
    icon: RotateCcw,
    title: "Easy Returns",
    description: "30-day return policy",
  },
];

/* -------------------------------------------------------------------------- */
/*                            Countdown Timer                                 */
/* -------------------------------------------------------------------------- */

function useCountdown() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);

    // Set the deal to end at midnight
    const getTarget = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(23, 59, 59, 999);
      return target.getTime();
    };

    const tick = () => {
      const diff = getTarget() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { timeLeft, mounted };
}

/* -------------------------------------------------------------------------- */
/*                              Stagger Helpers                               */
/* -------------------------------------------------------------------------- */

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: i * 0.05 },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

/* -------------------------------------------------------------------------- */
/*                                  Page                                      */
/* -------------------------------------------------------------------------- */

export default function HomePage() {
  const { timeLeft: countdown, mounted } = useCountdown();

  // GSAP Animation Refs
  const shopButton = useGSAPButton(0.3);
  const dealsButton = useGSAPButton(0.4);
  const heroFade = useGSAPFadeIn();
  const badgePulse = useGSAPFloating();
  const statsContainer = useGSAPStagger(".stat-item");

  return (
    <div className="flex flex-col">
      {/* ------------------------------------------------------------------ */}
      {/*  HERO BANNER                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/10">
        {/* Three.js Animated Background */}
        <HeroBackground />

        {/* Decorative background shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 size-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 size-96 rounded-full bg-primary/8 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 size-64 -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-16 sm:py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div ref={badgePulse}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Badge variant="secondary" className="mb-4 px-3 py-1 text-xs shadow-lg">
                  <Sparkles className="mr-1 size-3" />
                  New Season Collection 2025
                </Badge>
              </motion.div>
            </div>

            <motion.h1
              className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              Discover Your{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Style
              </span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-8 max-w-xl text-base text-muted-foreground sm:text-lg lg:text-xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Explore thousands of premium products from world-class brands.
              Quality, style, and value -- all in one place.
            </motion.p>

            <motion.div
              className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div ref={shopButton}>
                <Button size="lg" className="w-full gap-2 sm:w-auto shadow-xl hover:shadow-2xl transition-shadow" asChild>
                  <Link href="/products">
                    Shop Now
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
              <div ref={dealsButton}>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full gap-2 sm:w-auto shadow-lg hover:shadow-xl transition-shadow"
                  asChild
                >
                  <Link href="/deals">
                    <Zap className="size-4" />
                    View Deals
                  </Link>
                </Button>
              </div>
            </motion.div>

            {/* Stats */}
            <div ref={statsContainer} className="mt-12 grid grid-cols-3 gap-6 sm:gap-8">
              {[
                { value: "50K+", label: "Products" },
                { value: "100K+", label: "Happy Customers" },
                { value: "500+", label: "Brands" },
              ].map((stat) => (
                <div key={stat.label} className="stat-item text-center">
                  <p className="text-2xl font-bold sm:text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">{stat.value}</p>
                  <p className="text-xs text-muted-foreground sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  TRUST BADGES                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.title}
                className="flex items-center gap-3 sm:gap-4"
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 sm:size-12">
                  <badge.icon className="size-5 text-primary sm:size-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{badge.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  FLASH DEALS                                                       */}
      {/* ------------------------------------------------------------------ */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
                <Zap className="size-4 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold sm:text-3xl">Flash Deals</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Grab these deals before they are gone!
            </p>
          </div>
          {mounted && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Timer className="size-4" />
                <span>Ends in:</span>
              </div>
              <div className="flex items-center gap-1.5">
                {[
                  { value: countdown.hours, label: "H" },
                  { value: countdown.minutes, label: "M" },
                  { value: countdown.seconds, label: "S" },
                ].map((unit) => (
                  <div key={unit.label} className="flex items-center gap-1">
                    <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground sm:size-10 sm:text-base">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {unit.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Horizontal scroll on mobile, grid on larger */}
        <div className="relative -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {sampleProducts
              .filter((p) => p.badge === "sale")
              .map((product, i) => (
                <div
                  key={product.id}
                  className="w-[260px] shrink-0 sm:w-[280px] lg:w-auto"
                >
                  <ProductCard product={product} index={i} />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  FEATURED CATEGORIES                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="bg-muted/30 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
              Shop by Category
            </h2>
            <p className="text-sm text-muted-foreground">
              Browse our curated collection of categories
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featuredCategories.map((category, i) => (
              <motion.div key={category.name} custom={i} variants={fadeInUp}>
                <Link href={category.href}>
                  <Card className="group relative overflow-hidden border-border/50 p-0 transition-all duration-300 hover:border-border hover:shadow-lg">
                    <div
                      className={cn(
                        "flex aspect-square flex-col items-center justify-center bg-gradient-to-br p-4",
                        category.gradient
                      )}
                    >
                      <span className="mb-2 text-4xl transition-transform duration-300 group-hover:scale-110 sm:text-5xl">
                        {category.emoji}
                      </span>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="text-sm font-semibold">{category.name}</h3>
                      <p className="text-[11px] text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  TRENDING PRODUCTS                                                 */}
      {/* ------------------------------------------------------------------ */}
      <section className="container mx-auto px-4 py-12 lg:py-16">
        <motion.div
          className="mb-8 flex items-end justify-between"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
              Trending Now
            </h2>
            <p className="text-sm text-muted-foreground">
              Discover what everyone is talking about
            </p>
          </div>
          <Button variant="ghost" className="hidden gap-1 sm:flex" asChild>
            <Link href="/products">
              View All
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {sampleProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Button variant="outline" className="gap-1" asChild>
            <Link href="/products">
              View All Products
              <ChevronRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  BRAND SHOWCASE                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="border-y bg-muted/30 py-10 lg:py-12">
        <div className="container mx-auto px-4">
          <motion.p
            className="mb-6 text-center text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.2 }}
          >
            Trusted by leading brands worldwide
          </motion.p>
          <div className="relative overflow-hidden">
            {/* Fade edges */}
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-muted/80 to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted/80 to-transparent" />

            <motion.div
              className="flex items-center gap-12"
              animate={{ x: [0, -800] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 15,
                  ease: "linear",
                },
              }}
            >
              {/* Duplicate for seamless loop */}
              {[...brands, ...brands, ...brands].map((brand, i) => (
                <div
                  key={`${brand}-${i}`}
                  className="flex h-12 shrink-0 items-center justify-center px-4"
                >
                  <span className="whitespace-nowrap text-xl font-bold tracking-tight text-muted-foreground/40 transition-colors hover:text-muted-foreground/70">
                    {brand}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/*  NEWSLETTER CTA                                                    */}
      {/* ------------------------------------------------------------------ */}
      <section className="relative overflow-hidden py-16 lg:py-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 size-64 rounded-full bg-white/5 blur-2xl" />
        </div>

        <div className="container relative mx-auto px-4">
          <motion.div
            className="mx-auto max-w-2xl text-center"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-4 inline-flex size-12 items-center justify-center rounded-full bg-white/10">
              <Mail className="size-6 text-primary-foreground" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-primary-foreground sm:text-3xl">
              Get Exclusive Deals
            </h2>
            <p className="mb-6 text-sm text-primary-foreground/80 sm:text-base">
              Subscribe to our newsletter and get 10% off your first order, plus
              early access to sales and new arrivals.
            </p>
            <div className="mx-auto flex max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="h-11 border-white/20 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 focus-visible:border-white/40 focus-visible:ring-white/20"
              />
              <Button
                size="lg"
                variant="secondary"
                className="shrink-0 gap-1.5 font-semibold"
              >
                Subscribe
                <ArrowRight className="size-4" />
              </Button>
            </div>
            <p className="mt-3 text-xs text-primary-foreground/60">
              No spam, unsubscribe at any time. By subscribing you agree to our
              Privacy Policy.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
