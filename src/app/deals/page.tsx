"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap,
  Clock,
  ShoppingCart,
  Heart,
  Star,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleProducts } from "@/lib/sample-data";
import { formatPrice, getDiscountPercentage, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";

const dealProducts = sampleProducts.filter((p) => p.comparePrice !== null);

// Target time: random hours/minutes/seconds in the future (seeded to be consistent per session)
function getTargetTime() {
  const now = new Date();
  return new Date(
    now.getTime() + 8 * 60 * 60 * 1000 + 45 * 60 * 1000 + 33 * 1000
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

function CountdownTimer() {
  const [targetTime] = useState(() => getTargetTime());
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime.getTime() - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-2">
      {[
        { value: pad(timeLeft.hours), label: "HRS" },
        { value: pad(timeLeft.minutes), label: "MIN" },
        { value: pad(timeLeft.seconds), label: "SEC" },
      ].map((unit, i) => (
        <React.Fragment key={unit.label}>
          {i > 0 && (
            <span className="text-2xl font-bold text-primary/70">:</span>
          )}
          <div className="flex flex-col items-center">
            <motion.span
              key={unit.value}
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex h-14 w-14 items-center justify-center rounded-lg bg-background text-2xl font-bold shadow-sm sm:h-16 sm:w-16 sm:text-3xl"
            >
              {unit.value}
            </motion.span>
            <span className="mt-1 text-[10px] font-medium tracking-wider text-muted-foreground">
              {unit.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

export default function DealsPage() {
  const addToCart = useCartStore((state) => state.addItem);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const handleAddToCart = (product: (typeof dealProducts)[0]) => {
    addToCart({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      slug: product.slug,
    });
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (product: (typeof dealProducts)[0]) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        slug: product.slug,
      });
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-red-500 via-orange-500 to-amber-500"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0xMHY2aC0ydi02aDJ6bTAtMTB2NmgtMlY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="flex flex-col items-center gap-8 text-center text-white">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm"
            >
              <Flame className="h-4 w-4" />
              <span className="text-sm font-medium">Limited Time Only!</span>
            </motion.div>

            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              <Zap className="mr-2 inline h-10 w-10 sm:h-12 sm:w-12" />
              Flash Deals
            </motion.h1>

            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-lg text-lg text-white/90"
            >
              Grab incredible discounts on premium products before time runs out.
              These deals won&apos;t last forever!
            </motion.p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-3"
            >
              <div className="flex items-center gap-2 text-sm font-medium text-white/80">
                <Clock className="h-4 w-4" />
                Ends in
              </div>
              <CountdownTimer />
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {dealProducts.map((product, index) => {
            const discount = getDiscountPercentage(
              product.price,
              product.comparePrice!
            );
            const wishlisted = isInWishlist(product.id);

            return (
              <motion.div key={product.id} variants={itemVariants}>
                <Card className="group relative overflow-hidden border-border/50 p-0 transition-all duration-300 hover:border-border hover:shadow-lg">
                  {/* Image Area */}
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-square overflow-hidden">
                      <div
                        className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        style={{ background: product.images[0] }}
                      >
                        <Zap className="h-16 w-16 text-white/20" />
                      </div>

                      {/* Discount Badge */}
                      <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
                        <Badge className="bg-red-500 text-white hover:bg-red-600 text-xs font-bold px-2 py-0.5">
                          -{discount}% OFF
                        </Badge>
                      </div>

                      {/* Wishlist Button */}
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleToggleWishlist(product);
                        }}
                        className={cn(
                          "absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-all hover:bg-background",
                          wishlisted && "text-red-500"
                        )}
                        whileTap={{ scale: 0.85 }}
                      >
                        <Heart
                          className={cn(
                            "h-4 w-4 transition-all",
                            wishlisted && "fill-red-500 text-red-500"
                          )}
                        />
                      </motion.button>
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="space-y-2 p-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {product.category.name}
                    </p>
                    <Link href={`/products/${product.slug}`}>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < Math.floor(product.rating)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-muted text-muted"
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({product.reviewCount})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-red-600 dark:text-red-400">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-sm text-muted-foreground line-through">
                          {formatPrice(product.comparePrice!)}
                        </span>
                      </div>
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                        >
                          <ShoppingCart className="mr-1 h-3.5 w-3.5" />
                          <span className="text-xs">Add</span>
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8 text-center text-white sm:p-12"
        >
          <Flame className="mx-auto mb-4 h-10 w-10" />
          <h2 className="text-2xl font-bold sm:text-3xl">
            Don&apos;t Miss Out!
          </h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">
            These flash deals are available for a limited time only. Shop now
            and save big on your favorite products.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-6"
            asChild
          >
            <Link href="/products">
              Browse All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
