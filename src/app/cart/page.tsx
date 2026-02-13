"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;
const SHIPPING_COST = 5.99;

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } =
    useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = (subtotal - couponDiscount) * TAX_RATE;
  const total = subtotal - couponDiscount + shipping + tax;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    // Simulate coupon validation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const code = couponCode.trim().toUpperCase();
    if (code === "SAVE10") {
      const discount = subtotal * 0.1;
      setCouponDiscount(discount);
      setAppliedCoupon(code);
      toast.success(`Coupon applied! You save ${formatPrice(discount)}`);
    } else if (code === "FLAT20") {
      const discount = Math.min(20, subtotal);
      setCouponDiscount(discount);
      setAppliedCoupon(code);
      toast.success(`Coupon applied! You save ${formatPrice(discount)}`);
    } else {
      toast.error("Invalid coupon code. Please try again.");
    }
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    toast.info("Coupon removed");
  };

  const handleClearCart = () => {
    clearCart();
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode("");
    setClearDialogOpen(false);
    toast.success("Cart cleared");
  };

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8 rounded-full bg-muted p-8"
          >
            <ShoppingCart className="size-16 text-muted-foreground" />
          </motion.div>
          <h1 className="mb-3 text-3xl font-bold tracking-tight">
            Your cart is empty
          </h1>
          <p className="mb-8 max-w-md text-muted-foreground">
            Looks like you haven&apos;t added anything to your cart yet. Browse
            our collection and find something you love.
          </p>
          <Button asChild size="lg" className="gap-2">
            <Link href="/products">
              Continue Shopping
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <ShoppingCart className="size-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
          <Badge variant="secondary" className="text-sm">
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Badge>
        </div>
        <p className="mt-1 text-muted-foreground">
          Review your items and proceed to checkout
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart Items Column */}
        <div className="lg:col-span-2">
          {/* Column Headers (desktop) */}
          <div className="mb-4 hidden grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 px-4 text-sm font-medium text-muted-foreground md:grid">
            <span>Product</span>
            <span className="text-center">Price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
            <span className="w-9" />
          </div>
          <Separator className="mb-4 hidden md:block" />

          {/* Items List */}
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <Card className="py-4">
                  <CardContent className="p-0 px-4">
                    {/* Desktop Layout */}
                    <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] items-center gap-4 md:grid">
                      {/* Product Info */}
                      <div className="flex items-center gap-4">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/products/${item.slug}`}
                            className="line-clamp-2 font-medium hover:text-primary transition-colors"
                          >
                            {item.name}
                          </Link>
                          {item.variantName && (
                            <p className="mt-1 text-sm text-muted-foreground">
                              {item.variantName}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Unit Price */}
                      <div className="text-center font-medium">
                        {formatPrice(item.price)}
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-center">
                        <div className="flex items-center rounded-lg border">
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="size-3" />
                          </Button>
                          <span className="flex h-8 w-10 items-center justify-center border-x text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            disabled={item.quantity >= 99}
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </div>

                      {/* Remove Button */}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => {
                          removeItem(item.id);
                          toast.success(`${item.name} removed from cart`);
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    {/* Mobile Layout */}
                    <div className="flex gap-4 md:hidden">
                      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <Link
                              href={`/products/${item.slug}`}
                              className="line-clamp-2 font-medium hover:text-primary transition-colors"
                            >
                              {item.name}
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => {
                                removeItem(item.id);
                                toast.success(
                                  `${item.name} removed from cart`
                                );
                              }}
                            >
                              <X className="size-4" />
                            </Button>
                          </div>
                          {item.variantName && (
                            <p className="mt-0.5 text-sm text-muted-foreground">
                              {item.variantName}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-lg border">
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="h-7 w-7 rounded-r-none"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="size-3" />
                            </Button>
                            <span className="flex h-7 w-8 items-center justify-center border-x text-sm font-medium">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon-xs"
                              className="h-7 w-7 rounded-l-none"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              disabled={item.quantity >= 99}
                            >
                              <Plus className="size-3" />
                            </Button>
                          </div>
                          <span className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Clear Cart */}
          <div className="mt-4 flex items-center justify-between">
            <Button variant="ghost" asChild className="gap-2">
              <Link href="/products">
                <ArrowLeft className="size-4" />
                Continue Shopping
              </Link>
            </Button>
            <Dialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive hover:text-white">
                  <Trash2 className="size-4" />
                  Clear Cart
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear Shopping Cart</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove all items from your cart?
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setClearDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleClearCart}>
                    Clear Cart
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
                    </span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {/* Shipping */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Truck className="size-3.5" />
                      Shipping
                    </span>
                    {shipping === 0 ? (
                      <span className="font-medium text-green-600">Free</span>
                    ) : (
                      <span className="font-medium">
                        {formatPrice(shipping)}
                      </span>
                    )}
                  </div>

                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more
                      for free shipping
                    </p>
                  )}

                  {/* Tax */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Estimated Tax (8%)
                    </span>
                    <span className="font-medium">{formatPrice(tax)}</span>
                  </div>

                  {/* Coupon Discount */}
                  {appliedCoupon && couponDiscount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-1.5 text-green-600">
                        <Tag className="size-3.5" />
                        Discount ({appliedCoupon})
                        <button
                          onClick={handleRemoveCoupon}
                          className="ml-1 rounded-full p-0.5 hover:bg-muted"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                      <span className="font-medium text-green-600">
                        -{formatPrice(couponDiscount)}
                      </span>
                    </motion.div>
                  )}

                  <Separator />

                  {/* Coupon Input */}
                  {!appliedCoupon && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Coupon Code
                      </label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleApplyCoupon();
                          }}
                          className="h-9"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleApplyCoupon}
                          disabled={!couponCode.trim() || isApplyingCoupon}
                          className="shrink-0"
                        >
                          {isApplyingCoupon ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                repeat: Infinity,
                                duration: 1,
                                ease: "linear",
                              }}
                              className="size-4 rounded-full border-2 border-muted-foreground border-t-transparent"
                            />
                          ) : (
                            "Apply"
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Total */}
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold">Total</span>
                    <span className="text-xl font-bold">
                      {formatPrice(total)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button asChild size="lg" className="w-full gap-2 text-base">
                    <Link href="/checkout">
                      Proceed to Checkout
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    asChild
                    className="w-full text-muted-foreground"
                  >
                    <Link href="/products">Continue Shopping</Link>
                  </Button>

                  <Separator className="my-1" />

                  {/* Security & Payment */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="size-4 text-green-600" />
                    <span>Secure checkout guaranteed</span>
                  </div>

                  {/* Payment Method Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"].map(
                      (method) => (
                        <Badge
                          key={method}
                          variant="outline"
                          className="text-[10px] font-normal text-muted-foreground"
                        >
                          {method}
                        </Badge>
                      )
                    )}
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
