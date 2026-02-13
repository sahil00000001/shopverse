"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (item: (typeof items)[0]) => {
    addToCart({
      id: `${item.productId}-default`,
      productId: item.productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      slug: item.slug,
    });
    removeItem(item.productId);
    toast.success("Moved to cart", {
      description: `${item.name} has been added to your cart.`,
    });
  };

  const handleRemove = (item: (typeof items)[0]) => {
    removeItem(item.productId);
    toast.info("Removed from wishlist", {
      description: `${item.name} has been removed from your wishlist.`,
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">My Wishlist</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {items.length === 0
            ? "Your wishlist is empty."
            : `You have ${items.length} item${items.length !== 1 ? "s" : ""} in your wishlist.`}
        </p>
      </motion.div>

      {/* Empty State */}
      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">
            Your wishlist is empty
          </h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            Start browsing to save your favorites. Items you love will appear
            here for easy access later.
          </p>
          <Button asChild size="lg">
            <Link href="/products">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
          </Button>
        </motion.div>
      )}

      {/* Wishlist Grid */}
      {items.length > 0 && (
        <motion.div
          variants={itemVariants}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.productId}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="group overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-0">
                    {/* Image */}
                    <Link href={`/products/${item.slug}`}>
                      <div className="relative aspect-square overflow-hidden">
                        <div
                          className="flex h-full w-full items-center justify-center transition-transform duration-500 group-hover:scale-110"
                          style={{ background: item.image }}
                        >
                          <Heart className="h-12 w-12 text-white/30" />
                        </div>
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="space-y-3 p-4">
                      <Link href={`/products/${item.slug}`}>
                        <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors hover:text-primary">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="text-lg font-bold">
                        {formatPrice(item.price)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleAddToCart(item)}
                        >
                          <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleRemove(item)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
