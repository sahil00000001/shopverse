"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Minus,
  Plus,
  Truck,
  Shield,
  RotateCcw,
  Headphones,
  ChevronRight,
  Check,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  ProductCard,
  type Product,
} from "@/components/product/product-card";
import {
  getProductBySlug,
  getRelatedProducts,
  sampleReviews,
  type SampleProduct,
} from "@/lib/sample-data";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn, formatPrice, getDiscountPercentage, getInitials } from "@/lib/utils";
import { toast } from "sonner";

/* -------------------------------------------------------------------------- */
/*                        Map SampleProduct -> Product                        */
/* -------------------------------------------------------------------------- */

const productEmojis: Record<string, string> = {
  "prod-1": "\uD83C\uDFA7",
  "prod-2": "\uD83D\uDCBB",
  "prod-3": "\uD83E\uDDE5",
  "prod-4": "\uD83D\uDCF7",
  "prod-5": "\uD83C\uDFFA",
  "prod-6": "\uD83D\uDC5F",
  "prod-7": "\u2728",
  "prod-8": "\uD83C\uDF92",
  "prod-9": "\u231A",
  "prod-10": "\uD83D\uDECB\uFE0F",
  "prod-11": "\uD83E\uDDE5",
  "prod-12": "\uD83E\uDDD8",
};

const productGradients: Record<string, string> = {
  "prod-1": "bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
  "prod-2": "bg-gradient-to-br from-slate-500/20 via-gray-500/10 to-zinc-500/20",
  "prod-3": "bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-red-500/20",
  "prod-4": "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20",
  "prod-5": "bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20",
  "prod-6": "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20",
  "prod-7": "bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-fuchsia-500/20",
  "prod-8": "bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20",
  "prod-9": "bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-sky-500/20",
  "prod-10": "bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-fuchsia-500/20",
  "prod-11": "bg-gradient-to-br from-slate-500/20 via-zinc-500/10 to-gray-500/20",
  "prod-12": "bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-500/20",
};

function toProductCard(sp: SampleProduct): Product {
  return {
    id: sp.id,
    name: sp.name,
    slug: sp.slug,
    price: sp.price,
    comparePrice: sp.comparePrice ?? undefined,
    image: sp.images[0] ?? "",
    category: sp.category.name,
    rating: sp.rating,
    reviewCount: sp.reviewCount,
    badge: sp.comparePrice ? "sale" : sp.featured ? "new" : undefined,
    emoji: productEmojis[sp.id] ?? "\uD83D\uDED2",
    gradient: productGradients[sp.id] ?? "bg-gradient-to-br from-gray-500/20 to-gray-500/10",
  };
}

/* -------------------------------------------------------------------------- */
/*                             Gradient display                               */
/* -------------------------------------------------------------------------- */

// The sample data images are CSS gradient strings, not Tailwind classes.
// We render them as inline style backgrounds.

/* -------------------------------------------------------------------------- */
/*                               Rating helpers                               */
/* -------------------------------------------------------------------------- */

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "size-3.5" : "size-5";
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            s,
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : i < rating
                ? "fill-amber-400/50 text-amber-400"
                : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

function getRatingBreakdown(reviews: typeof sampleReviews) {
  const breakdown = [0, 0, 0, 0, 0]; // index 0 = 1 star, index 4 = 5 star
  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      breakdown[r.rating - 1]++;
    }
  });
  return breakdown;
}

/* -------------------------------------------------------------------------- */
/*                            Features Row                                    */
/* -------------------------------------------------------------------------- */

const features = [
  { icon: Truck, label: "Free Shipping" },
  { icon: Shield, label: "Secure Payment" },
  { icon: RotateCcw, label: "Easy Returns" },
  { icon: Headphones, label: "24/7 Support" },
];

/* -------------------------------------------------------------------------- */
/*                               Page Component                               */
/* -------------------------------------------------------------------------- */

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = getProductBySlug(slug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const addItem = useCartStore((state) => state.addItem);
  const {
    addItem: addToWishlist,
    removeItem: removeFromWishlist,
    isInWishlist,
  } = useWishlistStore();

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return getRelatedProducts(product.id, product.categoryId);
  }, [product]);

  if (!product) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="mb-4 text-3xl font-bold">Product Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The product you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">Back to Products</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const discount = product.comparePrice
    ? getDiscountPercentage(product.price, product.comparePrice)
    : 0;

  const isWishlisted = isInWishlist(product.id);
  const ratingBreakdown = getRatingBreakdown(sampleReviews);
  const totalReviewsForBreakdown = sampleReviews.length;
  const averageReviewRating =
    sampleReviews.length > 0
      ? sampleReviews.reduce((sum, r) => sum + r.rating, 0) / sampleReviews.length
      : 0;

  const handleAddToCart = () => {
    const variantInfo = selectedColor || selectedSize
      ? {
          variantId: `${product.id}-${selectedColor ?? "default"}-${selectedSize ?? "default"}`,
          variantName: [selectedColor, selectedSize].filter(Boolean).join(" / "),
        }
      : {};

    addItem({
      id: `${product.id}-${variantInfo.variantId ?? "default"}`,
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? "",
      quantity,
      slug: product.slug,
      ...variantInfo,
    });

    toast.success("Added to cart", {
      description: `${product.name} (x${quantity}) has been added to your cart.`,
    });
  };

  const handleToggleWishlist = () => {
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
        image: product.images[0] ?? "",
        slug: product.slug,
      });
      toast.success("Added to wishlist", {
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumbs */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href={`/categories/${product.category.slug}`}
              className="transition-colors hover:text-foreground"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="truncate font-medium text-foreground">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Two Column Layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* LEFT - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Main Image */}
            <div className="relative mb-4 aspect-square overflow-hidden rounded-2xl">
              <div
                className="flex size-full items-center justify-center"
                style={{ background: product.images[selectedImageIndex] }}
              >
                <span className="text-8xl drop-shadow-lg">
                  {productEmojis[product.id] ?? "\uD83D\uDED2"}
                </span>
              </div>
              {discount > 0 && (
                <Badge className="absolute left-4 top-4 bg-red-500 text-white hover:bg-red-600">
                  -{discount}% OFF
                </Badge>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3">
              {product.images.map((gradient, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={cn(
                    "aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all",
                    selectedImageIndex === i
                      ? "border-primary ring-2 ring-primary/20"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <div
                    className="flex size-full items-center justify-center"
                    style={{ background: gradient }}
                  >
                    <span className="text-2xl">
                      {productEmojis[product.id] ?? "\uD83D\uDED2"}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* RIGHT - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Brand */}
            <Link
              href={`/products?brand=${product.brand.slug}`}
              className="mb-1 text-sm font-medium uppercase tracking-wider text-primary hover:underline"
            >
              {product.brand.name}
            </Link>

            {/* Product Name */}
            <h1 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mb-4 flex items-center gap-3">
              <StarRating rating={product.rating} />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
              <button className="text-sm font-medium text-primary hover:underline">
                Write a Review
              </button>
            </div>

            {/* Price */}
            <div className="mb-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.comparePrice)}
                  </span>
                  <Badge variant="secondary" className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {discount}% OFF
                  </Badge>
                </>
              )}
            </div>

            {/* Short Description */}
            <p className="mb-6 text-muted-foreground">
              {product.shortDescription}
            </p>

            <Separator className="mb-6" />

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-5">
                <h4 className="mb-2.5 text-sm font-semibold">
                  Color{selectedColor ? `: ${selectedColor}` : ""}
                </h4>
                <div className="flex gap-2.5">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() =>
                        setSelectedColor(selectedColor === color ? null : color)
                      }
                      className={cn(
                        "relative size-9 rounded-full border-2 transition-all",
                        selectedColor === color
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-border hover:border-foreground/50"
                      )}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    >
                      {selectedColor === color && (
                        <Check
                          className={cn(
                            "absolute inset-0 m-auto size-4",
                            isLightColor(color)
                              ? "text-gray-800"
                              : "text-white"
                          )}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <h4 className="mb-2.5 text-sm font-semibold">
                  Size{selectedSize ? `: ${selectedSize}` : ""}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() =>
                        setSelectedSize(selectedSize === size ? null : size)
                      }
                      className={cn(
                        "flex h-10 min-w-[2.5rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition-all",
                        selectedSize === size
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-foreground/50"
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h4 className="mb-2.5 text-sm font-semibold">Quantity</h4>
              <div className="flex items-center gap-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="size-10 rounded-r-none p-0"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="size-4" />
                </Button>
                <div className="flex h-10 w-14 items-center justify-center border-y text-sm font-medium">
                  {quantity}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="size-10 rounded-l-none p-0"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="size-4" />
                </Button>
                <span className="ml-3 text-xs text-muted-foreground">
                  {product.stock} in stock
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-6 flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="size-5" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={cn(
                  "gap-2",
                  isWishlisted && "text-red-500"
                )}
                onClick={handleToggleWishlist}
              >
                <Heart
                  className={cn(
                    "size-5",
                    isWishlisted && "fill-red-500 text-red-500"
                  )}
                />
                {isWishlisted ? "Wishlisted" : "Wishlist"}
              </Button>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center"
                >
                  <feature.icon className="size-5 text-primary" />
                  <span className="text-[11px] font-medium leading-tight">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 lg:mt-16"
        >
          <Tabs defaultValue="description">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({sampleReviews.length})
              </TabsTrigger>
              <TabsTrigger value="shipping">Shipping</TabsTrigger>
            </TabsList>

            {/* Description Tab */}
            <TabsContent value="description" className="mt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold">Product Details</h4>
                    <dl className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">SKU</dt>
                        <dd className="font-medium">{product.sku}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Brand</dt>
                        <dd className="font-medium">{product.brand.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category</dt>
                        <dd className="font-medium">{product.category.name}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Availability</dt>
                        <dd className="font-medium text-green-600">
                          {product.stock > 0 ? "In Stock" : "Out of Stock"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-semibold">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-6">
              <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
                {/* Rating Summary */}
                <div className="rounded-lg border p-6">
                  <div className="mb-4 text-center">
                    <div className="text-4xl font-bold">
                      {averageReviewRating.toFixed(1)}
                    </div>
                    <StarRating rating={averageReviewRating} />
                    <p className="mt-1 text-sm text-muted-foreground">
                      Based on {sampleReviews.length} reviews
                    </p>
                  </div>
                  <div className="space-y-2.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = ratingBreakdown[star - 1];
                      const pct =
                        totalReviewsForBreakdown > 0
                          ? (count / totalReviewsForBreakdown) * 100
                          : 0;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-3 text-xs font-medium">{star}</span>
                          <Star className="size-3.5 fill-amber-400 text-amber-400" />
                          <Progress value={pct} className="h-2 flex-1" />
                          <span className="w-6 text-right text-xs text-muted-foreground">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {sampleReviews.map((review) => (
                    <div key={review.id} className="rounded-lg border p-5">
                      <div className="mb-3 flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-10">
                            <AvatarFallback className="text-xs">
                              {getInitials(review.userName)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold">
                                {review.userName}
                              </span>
                              {review.verified && (
                                <Badge
                                  variant="secondary"
                                  className="gap-1 text-[10px]"
                                >
                                  <Check className="size-2.5" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <h4 className="mb-1.5 text-sm font-semibold">
                        {review.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Shipping Tab */}
            <TabsContent value="shipping" className="mt-6">
              <div className="max-w-2xl space-y-6">
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                      <Truck className="size-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Standard Shipping</h4>
                      <p className="text-sm text-muted-foreground">
                        5-7 business days
                      </p>
                      <p className="mt-1 text-sm font-medium text-green-600">
                        FREE
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <Truck className="size-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Express Shipping</h4>
                      <p className="text-sm text-muted-foreground">
                        2-3 business days
                      </p>
                      <p className="mt-1 text-sm font-medium">$9.99</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Truck className="size-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Overnight Shipping</h4>
                      <p className="text-sm text-muted-foreground">
                        Next business day
                      </p>
                      <p className="mt-1 text-sm font-medium">$19.99</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border p-5">
                  <div className="flex items-start gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                      <RotateCcw className="size-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Return Policy</h4>
                      <p className="text-sm text-muted-foreground">
                        30-day return window. Items must be in original
                        condition with tags attached. Free return shipping for
                        domestic orders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16"
          >
            <Separator className="mb-12" />
            <h2 className="mb-6 text-2xl font-bold">You May Also Like</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {relatedProducts.map((sp, i) => (
                <ProductCard
                  key={sp.id}
                  product={toProductCard(sp)}
                  index={i}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Helpers                                      */
/* -------------------------------------------------------------------------- */

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length !== 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}
