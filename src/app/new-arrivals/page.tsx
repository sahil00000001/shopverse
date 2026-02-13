"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ShoppingCart,
  Heart,
  Star,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleProducts } from "@/lib/sample-data";
import { formatPrice, cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";

// Last 6 products as "new arrivals"
const newArrivals = sampleProducts.slice(-6);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function NewArrivalsPage() {
  const addToCart = useCartStore((state) => state.addItem);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const handleAddToCart = (product: (typeof newArrivals)[0]) => {
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

  const handleToggleWishlist = (product: (typeof newArrivals)[0]) => {
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
        className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0xMHY2aC0ydi02aDJ6bTAtMTB2NmgtMlY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="flex flex-col items-center gap-6 text-center text-white">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Just Dropped</span>
            </motion.div>

            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              New Arrivals
            </motion.h1>

            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="max-w-lg text-lg text-white/90"
            >
              Discover the latest additions to our collection. Fresh styles,
              cutting-edge tech, and must-have essentials just for you.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {newArrivals.map((product, index) => {
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
                        <Sparkles className="h-16 w-16 text-white/20" />
                      </div>

                      {/* NEW Badge */}
                      <div className="absolute left-2.5 top-2.5">
                        <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold">
                          NEW
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
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {product.shortDescription}
                    </p>

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

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-bold">
                          {formatPrice(product.price)}
                        </span>
                        {product.comparePrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(product.comparePrice)}
                          </span>
                        )}
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

        {/* Browse More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-12 text-center"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/products">
              View All Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
