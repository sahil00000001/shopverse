"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn, formatPrice, getDiscountPercentage } from "@/lib/utils";
import { toast } from "sonner";

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  badge?: "sale" | "new" | "trending";
  emoji: string;
  gradient: string;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } =
    useWishlistStore();

  const isWishlisted = isInWishlist(product.id);
  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `${product.id}-default`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      slug: product.slug,
    });
    toast.success("Added to cart", {
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist", {
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist({
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      });
      toast.success("Added to wishlist", {
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Link href={`/products/${product.slug}`}>
        <Card
          className="group relative overflow-hidden border-border/50 p-0 transition-all duration-300 hover:border-border hover:shadow-lg"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Area */}
          <div className="relative aspect-square overflow-hidden">
            {/* Gradient Placeholder Image */}
            <div
              className={cn(
                "flex size-full items-center justify-center transition-transform duration-500 group-hover:scale-110",
                product.gradient
              )}
            >
              <span className="text-5xl drop-shadow-lg transition-transform duration-300 group-hover:scale-125 sm:text-6xl">
                {product.emoji}
              </span>
            </div>

            {/* Badges */}
            <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5">
              {product.badge === "sale" && discount > 0 && (
                <Badge className="bg-red-500 text-white hover:bg-red-600">
                  -{discount}%
                </Badge>
              )}
              {product.badge === "new" && (
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">
                  New
                </Badge>
              )}
              {product.badge === "trending" && (
                <Badge className="bg-amber-500 text-white hover:bg-amber-600">
                  Trending
                </Badge>
              )}
            </div>

            {/* Wishlist Button */}
            <motion.button
              onClick={handleToggleWishlist}
              className={cn(
                "absolute right-2.5 top-2.5 flex size-8 items-center justify-center rounded-full bg-background/80 shadow-sm backdrop-blur-sm transition-all hover:bg-background",
                isWishlisted && "text-red-500"
              )}
              whileTap={{ scale: 0.85 }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart
                className={cn(
                  "size-4 transition-all",
                  isWishlisted && "fill-red-500 text-red-500"
                )}
              />
            </motion.button>

            {/* Quick View Overlay */}
            <motion.div
              className="absolute inset-x-0 bottom-0 flex items-center justify-center p-3"
              initial={{ opacity: 0, y: 10 }}
              animate={isHovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="secondary"
                size="sm"
                className="w-full gap-1.5 bg-background/90 text-xs font-medium shadow-md backdrop-blur-sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Eye className="size-3.5" />
                Quick View
              </Button>
            </motion.div>
          </div>

          {/* Product Details */}
          <div className="space-y-2 p-3.5 sm:p-4">
            {/* Category */}
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>

            {/* Name */}
            <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < Math.floor(product.rating)
                        ? "fill-amber-400 text-amber-400"
                        : i < product.rating
                          ? "fill-amber-400/50 text-amber-400"
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
                <span className="text-base font-bold sm:text-lg">
                  {formatPrice(product.price)}
                </span>
                {product.comparePrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                )}
              </div>
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  size="sm"
                  className="size-8 rounded-full p-0 sm:size-auto sm:gap-1.5 sm:rounded-md sm:px-3"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="size-3.5" />
                  <span className="hidden sm:inline text-xs">Add</span>
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
