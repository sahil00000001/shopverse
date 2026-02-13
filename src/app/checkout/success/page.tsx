"use client";

import { useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

// Confetti dot component
function ConfettiDot({
  delay,
  x,
  color,
  size,
}: {
  delay: number;
  x: number;
  color: string;
  size: number;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        left: `${x}%`,
        top: -10,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0 }}
      animate={{
        y: ["-20px", "100vh"],
        opacity: [1, 1, 0.8, 0],
        rotate: [0, 360, 720],
        x: [0, Math.random() > 0.5 ? 30 : -30, Math.random() > 0.5 ? -20 : 20],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay,
        ease: "easeIn",
        repeat: Infinity,
        repeatDelay: Math.random() * 3,
      }}
    />
  );
}

const CONFETTI_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
];

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((state) => state.clearCart);

  // Generate confetti dots only once
  const confettiDots = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        delay: Math.random() * 2,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 8,
      })),
    []
  );

  // Clear cart on mount
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Confetti */}
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {confettiDots.map((dot) => (
          <ConfettiDot
            key={dot.id}
            delay={dot.delay}
            x={dot.x}
            color={dot.color}
            size={dot.size}
          />
        ))}
      </div>

      {/* Content */}
      <div className="container relative z-20 mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-16">
        {/* Animated Checkmark */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
        >
          <div className="relative">
            {/* Outer glow ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-emerald-400/20"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 2 }}
            />

            <svg
              className="size-28"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circle */}
              <motion.circle
                cx="60"
                cy="60"
                r="54"
                stroke="url(#gradient)"
                strokeWidth="4"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
              {/* Background fill */}
              <motion.circle
                cx="60"
                cy="60"
                r="52"
                fill="#10b981"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                style={{ transformOrigin: "60px 60px" }}
              />
              {/* Checkmark */}
              <motion.path
                d="M38 62L52 76L82 46"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="120" y2="120">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="mb-3 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
        >
          Order Confirmed!
        </motion.h1>

        {/* Order number */}
        {orderId && (
          <motion.div
            className="mb-4 rounded-full border border-gray-200 bg-gray-50 px-5 py-2 dark:border-gray-700 dark:bg-gray-800"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            <p className="text-sm text-muted-foreground">
              Order ID:{" "}
              <span className="font-mono font-semibold text-foreground">
                {orderId}
              </span>
            </p>
          </motion.div>
        )}

        {/* Thank you message */}
        <motion.p
          className="mb-2 text-center text-lg text-muted-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7, duration: 0.4 }}
        >
          Thank you for shopping with ShopVerse!
        </motion.p>

        {/* Confirmation email */}
        <motion.p
          className="mb-10 text-center text-sm text-muted-foreground/80"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.9, duration: 0.4 }}
        >
          A confirmation email has been sent to your email address.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.1, duration: 0.5 }}
        >
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <ShoppingBag className="size-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/dashboard/orders">
              <ClipboardList className="size-4" />
              View Orders
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
