"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ShoppingBag,
  ArrowRight,
  Loader2,
  Check,
  X,
  Shield,
  Gift,
  Heart,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    terms: z.literal(true, {
      error: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const,
    },
  },
};

function getPasswordStrength(password: string) {
  let score = 0;
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[^a-zA-Z0-9]/.test(password),
  };

  if (checks.length) score++;
  if (checks.lowercase) score++;
  if (checks.uppercase) score++;
  if (checks.number) score++;
  if (checks.special) score++;

  return { score, checks };
}

function getStrengthLabel(score: number) {
  if (score === 0) return { label: "", color: "" };
  if (score <= 2) return { label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { label: "Fair", color: "bg-orange-500" };
  if (score <= 4) return { label: "Good", color: "bg-yellow-500" };
  return { label: "Strong", color: "bg-green-500" };
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: undefined,
    },
  });

  const passwordValue = watch("password") || "";
  const passwordStrength = useMemo(
    () => getPasswordStrength(passwordValue),
    [passwordValue]
  );
  const strengthInfo = getStrengthLabel(passwordStrength.score);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          result.errors.forEach(
            (err: { field: string; message: string }) => {
              toast.error(err.message);
            }
          );
        } else {
          toast.error(result.message || "Registration failed");
        }
        return;
      }

      toast.success("Account created successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: "google" | "github") => {
    try {
      if (provider === "google") setIsGoogleLoading(true);
      if (provider === "github") setIsGithubLoading(true);

      await signIn(provider, { callbackUrl: "/" });
    } catch {
      toast.error("Something went wrong with social login.");
    } finally {
      setIsGoogleLoading(false);
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Brand & Illustration */}
      <motion.div
        variants={slideInLeft}
        initial="hidden"
        animate="visible"
        className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 lg:flex lg:flex-col lg:items-center lg:justify-center"
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Gradient orbs */}
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-emerald-500/20 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-teal-500/20 blur-[100px]" />

        <div className="relative z-10 px-12 text-center">
          {/* Logo */}
          <motion.div
            variants={floatingAnimation}
            animate="animate"
            className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 shadow-2xl backdrop-blur-sm"
          >
            <ShoppingBag className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-white">
            Join ShopVerse
          </h1>
          <p className="mb-12 text-lg text-neutral-300">
            Start your premium shopping journey today
          </p>

          {/* Benefit cards */}
          <div className="space-y-4">
            {[
              {
                icon: Gift,
                title: "Welcome Bonus",
                description: "Get 10% off your first order",
              },
              {
                icon: Heart,
                title: "Wishlist & Alerts",
                description: "Save items and get price drop alerts",
              },
              {
                icon: Shield,
                title: "Secure Shopping",
                description: "Your data is protected & encrypted",
              },
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                custom={index + 3}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="flex items-center gap-4 rounded-xl bg-white/5 p-4 text-left backdrop-blur-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <benefit.icon className="h-5 w-5 text-emerald-300" />
                </div>
                <div>
                  <p className="font-medium text-white">{benefit.title}</p>
                  <p className="text-sm text-neutral-400">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating decorative elements */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" as const }}
            className="absolute -left-6 bottom-20 opacity-20"
          >
            <Package className="h-16 w-16 text-emerald-300" />
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel - Register Form */}
      <motion.div
        variants={slideInRight}
        initial="hidden"
        animate="visible"
        className="flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-8"
      >
        <div className="w-full max-w-md space-y-6">
          {/* Mobile logo */}
          <motion.div
            custom={0}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center lg:hidden"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-neutral-900">
              <ShoppingBag className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold">ShopVerse</h2>
          </motion.div>

          {/* Header */}
          <motion.div
            custom={1}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            <h2 className="text-3xl font-bold tracking-tight">
              Create an account
            </h2>
            <p className="mt-2 text-muted-foreground">
              Join thousands of happy shoppers on ShopVerse
            </p>
          </motion.div>

          {/* Social Signup Buttons */}
          <motion.div
            custom={2}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 gap-3"
          >
            <Button
              variant="outline"
              className="h-11"
              onClick={() => handleSocialSignIn("google")}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>Google</span>
            </Button>

            <Button
              variant="outline"
              className="h-11"
              onClick={() => handleSocialSignIn("github")}
              disabled={isGithubLoading || isLoading}
            >
              {isGithubLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              )}
              <span>GitHub</span>
            </Button>
          </motion.div>

          {/* Divider */}
          <motion.div
            custom={3}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or register with email
              </span>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.form
            custom={4}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="h-11 pl-10"
                  {...register("name")}
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.name.message}
                </motion.p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 pl-10"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="h-11 pl-10 pr-10"
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.password.message}
                </motion.p>
              )}

              {/* Password Strength Indicator */}
              {passwordValue.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength.score
                            ? strengthInfo.color
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      Password strength
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        passwordStrength.score <= 2
                          ? "text-red-500"
                          : passwordStrength.score <= 3
                            ? "text-orange-500"
                            : passwordStrength.score <= 4
                              ? "text-yellow-500"
                              : "text-green-500"
                      }`}
                    >
                      {strengthInfo.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    {[
                      { key: "length" as const, label: "8+ characters" },
                      { key: "lowercase" as const, label: "Lowercase" },
                      { key: "uppercase" as const, label: "Uppercase" },
                      { key: "number" as const, label: "Number" },
                      { key: "special" as const, label: "Special character" },
                    ].map((req) => (
                      <div
                        key={req.key}
                        className="flex items-center gap-1.5"
                      >
                        {passwordStrength.checks[req.key] ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span
                          className={`text-xs ${
                            passwordStrength.checks[req.key]
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="h-11 pl-10 pr-10"
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => {
                    const val = checked === true;
                    setAcceptedTerms(val);
                    setValue("terms", val as true, {
                      shouldValidate: true,
                    });
                  }}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="terms"
                  className="cursor-pointer text-sm font-normal leading-snug text-muted-foreground"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-primary underline-offset-4 hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
              {errors.terms && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive"
                >
                  {errors.terms.message}
                </motion.p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-11 w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </motion.form>

          {/* Sign In Link */}
          <motion.p
            custom={5}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-semibold text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
