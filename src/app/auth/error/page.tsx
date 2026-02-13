"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const errorMessages: Record<string, string> = {
  Configuration:
    "There is a problem with the server configuration. Please contact support if this issue persists.",
  AccessDenied:
    "Access denied. You do not have permission to sign in. Please verify your credentials or contact support.",
  Verification:
    "The verification link has expired or has already been used. Please request a new one.",
  OAuthSignin:
    "Could not start the sign-in process with the selected provider. Please try again.",
  OAuthCallback:
    "Could not complete the sign-in process with the selected provider. Please try again.",
  OAuthCreateAccount:
    "Could not create an account with the selected provider. An account may already exist with a different provider.",
  EmailCreateAccount:
    "Could not create an account with this email. An account may already exist.",
  Callback:
    "An unexpected error occurred during the sign-in callback. Please try again.",
  OAuthAccountNotLinked:
    "This email is already associated with another account. Please sign in with the provider you originally used.",
  EmailSignin:
    "The email sign-in link could not be sent. Please check your email address and try again.",
  CredentialsSignin:
    "Invalid email or password. Please check your credentials and try again.",
  SessionRequired:
    "You must be signed in to access this page. Please sign in to continue.",
  Default:
    "An unexpected authentication error occurred. Please try again.",
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const iconPulse = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "Default";
  const errorMessage =
    errorMessages[errorType] || errorMessages["Default"];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-900">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <span>ShopVerse</span>
        </Link>
      </motion.div>

      {/* Error Card */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="border-destructive/20 shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              variants={iconPulse}
              initial="hidden"
              animate="visible"
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10"
            >
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </motion.div>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription className="text-base">
              {errorMessage}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="rounded-lg bg-muted/50 p-3 text-center">
              <p className="text-xs text-muted-foreground">
                Error code:{" "}
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {errorType}
                </code>
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button asChild className="h-11 w-full" size="lg">
              <Link href="/auth/login">
                <RefreshCw className="h-4 w-4" />
                Try again
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 w-full"
              size="lg"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to home
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Support link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        Need help?{" "}
        <Link
          href="/support"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Contact support
        </Link>
      </motion.p>
    </div>
  );
}
