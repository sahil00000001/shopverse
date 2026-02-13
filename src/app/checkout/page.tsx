"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  CreditCard,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Lock,
  ShieldCheck,
  Truck,
  Zap,
  Clock,
  Check,
  Loader2,
  MapPin,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCartStore } from "@/store/cart-store";
import { cn, formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

// ---- Constants ----
const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;
const STANDARD_SHIPPING = 0;
const EXPRESS_SHIPPING = 9.99;
const OVERNIGHT_SHIPPING = 19.99;

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Brazil",
  "India",
  "Mexico",
  "Spain",
  "Italy",
  "Netherlands",
  "Sweden",
  "Switzerland",
];

type ShippingMethod = "standard" | "express" | "overnight";

const SHIPPING_METHODS: {
  id: ShippingMethod;
  label: string;
  description: string;
  price: number;
  eta: string;
  icon: React.ElementType;
}[] = [
  {
    id: "standard",
    label: "Standard Shipping",
    description: "Delivered by postal service",
    price: STANDARD_SHIPPING,
    eta: "5-7 business days",
    icon: Truck,
  },
  {
    id: "express",
    label: "Express Shipping",
    description: "Fast courier delivery",
    price: EXPRESS_SHIPPING,
    eta: "2-3 business days",
    icon: Zap,
  },
  {
    id: "overnight",
    label: "Overnight Shipping",
    description: "Next-day delivery guaranteed",
    price: OVERNIGHT_SHIPPING,
    eta: "Next business day",
    icon: Clock,
  },
];

// ---- Steps ----
const STEPS = [
  { id: 1, label: "Shipping", icon: Package },
  { id: 2, label: "Payment", icon: CreditCard },
  { id: 3, label: "Review", icon: ClipboardCheck },
];

// ---- Zod Schema ----
const shippingSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  phone: z
    .string()
    .min(7, "Phone number must be at least 7 digits")
    .max(20, "Phone number is too long")
    .regex(/^[+]?[\d\s()-]+$/, "Please enter a valid phone number"),
  streetAddress: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(200, "Street address is too long"),
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City name is too long"),
  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(100, "State name is too long"),
  zipCode: z
    .string()
    .min(3, "Zip code must be at least 3 characters")
    .max(20, "Zip code is too long"),
  country: z.string().min(1, "Please select a country"),
  saveAddress: z.boolean().optional(),
});

type ShippingFormData = z.infer<typeof shippingSchema>;

// ---- Step Indicator ----
function StepIndicator({
  currentStep,
  completedSteps,
}: {
  currentStep: number;
  completedSteps: number[];
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isActive
                      ? "hsl(var(--primary))"
                      : isCompleted
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                  }}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full transition-colors sm:size-12",
                    (isActive || isCompleted) && "text-primary-foreground",
                    !isActive && !isCompleted && "text-muted-foreground"
                  )}
                >
                  {isCompleted && !isActive ? (
                    <Check className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </motion.div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium sm:text-sm",
                    isActive
                      ? "text-primary"
                      : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className="mx-2 mb-6 sm:mx-4">
                  <div
                    className={cn(
                      "h-0.5 w-12 sm:w-24 md:w-32",
                      isCompleted ? "bg-primary" : "bg-muted"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- Checkout Page ----
export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, getItemCount, clearCart } = useCartStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(
    null
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = getTotal();
  const itemCount = getItemCount();
  const selectedShipping = SHIPPING_METHODS.find(
    (m) => m.id === shippingMethod
  )!;
  const shippingCost =
    subtotal >= FREE_SHIPPING_THRESHOLD && shippingMethod === "standard"
      ? 0
      : selectedShipping.price;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shippingCost + tax;

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      saveAddress: false,
    },
  });

  const countryValue = watch("country");

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !isPlacingOrder) {
      router.push("/cart");
    }
  }, [items.length, router, isPlacingOrder]);

  if (items.length === 0 && !isPlacingOrder) return null;

  // ---- Step Handlers ----
  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    setCompletedSteps((prev) =>
      prev.includes(1) ? prev : [...prev, 1]
    );
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentContinue = () => {
    setCompletedSteps((prev) =>
      prev.includes(2) ? prev : [...prev, 2]
    );
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variantId: item.variantId,
          })),
          shipping: {
            ...shippingData,
            method: shippingMethod,
            cost: shippingCost,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId } = await response.json();
      clearCart();
      router.push(`/checkout/success?orderId=${orderId}`);
    } catch {
      toast.error(
        "There was a problem placing your order. Please try again."
      );
      setIsPlacingOrder(false);
    }
  };

  // ---- Step Transition Variants ----
  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({
      x: direction > 0 ? -30 : 30,
      opacity: 0,
    }),
  };

  const direction = 1;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait" custom={direction}>
            {/* Step 1: Shipping */}
            {currentStep === 1 && (
              <motion.div
                key="shipping"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5 text-primary" />
                      Shipping Address
                    </CardTitle>
                    <CardDescription>
                      Enter the address where you want your order delivered
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      id="shipping-form"
                      onSubmit={handleSubmit(onShippingSubmit)}
                      className="space-y-5"
                    >
                      {/* Full Name & Phone */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name</Label>
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            {...register("fullName")}
                            aria-invalid={!!errors.fullName}
                          />
                          {errors.fullName && (
                            <p className="text-xs text-destructive">
                              {errors.fullName.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            placeholder="+1 (555) 000-0000"
                            {...register("phone")}
                            aria-invalid={!!errors.phone}
                          />
                          {errors.phone && (
                            <p className="text-xs text-destructive">
                              {errors.phone.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Street Address */}
                      <div className="space-y-2">
                        <Label htmlFor="streetAddress">Street Address</Label>
                        <Input
                          id="streetAddress"
                          placeholder="123 Main Street, Apt 4B"
                          {...register("streetAddress")}
                          aria-invalid={!!errors.streetAddress}
                        />
                        {errors.streetAddress && (
                          <p className="text-xs text-destructive">
                            {errors.streetAddress.message}
                          </p>
                        )}
                      </div>

                      {/* City & State */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="New York"
                            {...register("city")}
                            aria-invalid={!!errors.city}
                          />
                          {errors.city && (
                            <p className="text-xs text-destructive">
                              {errors.city.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State / Province</Label>
                          <Input
                            id="state"
                            placeholder="NY"
                            {...register("state")}
                            aria-invalid={!!errors.state}
                          />
                          {errors.state && (
                            <p className="text-xs text-destructive">
                              {errors.state.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Zip & Country */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Zip / Postal Code</Label>
                          <Input
                            id="zipCode"
                            placeholder="10001"
                            {...register("zipCode")}
                            aria-invalid={!!errors.zipCode}
                          />
                          {errors.zipCode && (
                            <p className="text-xs text-destructive">
                              {errors.zipCode.message}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Country</Label>
                          <Select
                            value={countryValue}
                            onValueChange={(value) =>
                              setValue("country", value, {
                                shouldValidate: true,
                              })
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.country && (
                            <p className="text-xs text-destructive">
                              {errors.country.message}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Save Address */}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="saveAddress"
                          onCheckedChange={(checked) =>
                            setValue("saveAddress", checked === true)
                          }
                        />
                        <Label
                          htmlFor="saveAddress"
                          className="cursor-pointer text-sm font-normal"
                        >
                          Save this address for future orders
                        </Label>
                      </div>
                    </form>
                  </CardContent>
                </Card>

                {/* Shipping Method */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="size-5 text-primary" />
                      Shipping Method
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred delivery speed
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={shippingMethod}
                      onValueChange={(value) =>
                        setShippingMethod(value as ShippingMethod)
                      }
                      className="space-y-3"
                    >
                      {SHIPPING_METHODS.map((method) => {
                        const Icon = method.icon;
                        const isFree =
                          method.id === "standard" &&
                          subtotal >= FREE_SHIPPING_THRESHOLD;

                        return (
                          <label
                            key={method.id}
                            htmlFor={method.id}
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all hover:border-primary/50",
                              shippingMethod === method.id &&
                                "border-primary bg-primary/5 ring-1 ring-primary"
                            )}
                          >
                            <div className="flex items-center gap-4">
                              <RadioGroupItem
                                value={method.id}
                                id={method.id}
                              />
                              <Icon
                                className={cn(
                                  "size-5",
                                  shippingMethod === method.id
                                    ? "text-primary"
                                    : "text-muted-foreground"
                                )}
                              />
                              <div>
                                <div className="font-medium">
                                  {method.label}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {method.description} &middot; {method.eta}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold">
                              {isFree || method.price === 0 ? (
                                <span className="text-green-600">Free</span>
                              ) : (
                                formatPrice(method.price)
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Continue Button */}
                <div className="mt-6 flex justify-end">
                  <Button
                    type="submit"
                    form="shipping-form"
                    size="lg"
                    className="gap-2"
                  >
                    Continue to Payment
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <motion.div
                key="payment"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="size-5 text-primary" />
                      Payment Method
                    </CardTitle>
                    <CardDescription>
                      Your payment is processed securely by Stripe
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stripe Elements Placeholder */}
                    <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8">
                      <div
                        id="payment-element"
                        className="min-h-[200px] flex items-center justify-center"
                      >
                        <div className="text-center">
                          <CreditCard className="mx-auto mb-3 size-12 text-muted-foreground/50" />
                          <p className="text-sm font-medium text-muted-foreground">
                            Stripe Payment Element
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground/70">
                            Card details form will be rendered here by Stripe
                            Elements
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Security Badge */}
                    <div className="flex items-center justify-center gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-950/20">
                      <div className="flex size-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <Lock className="size-5 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="border-green-200 bg-green-100 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-400"
                          >
                            <ShieldCheck className="mr-1 size-3" />
                            Secure Checkout
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Your payment information is encrypted and never stored
                          on our servers. All transactions are processed
                          securely through Stripe.
                        </p>
                      </div>
                    </div>

                    {/* Accepted Payment Methods */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {[
                        "Visa",
                        "Mastercard",
                        "Amex",
                        "Discover",
                        "Apple Pay",
                        "Google Pay",
                      ].map((method) => (
                        <Badge
                          key={method}
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2"
                    onClick={() => {
                      setCurrentStep(1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <ChevronLeft className="size-4" />
                    Back
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2"
                    onClick={handlePaymentContinue}
                  >
                    Review Order
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <motion.div
                key="review"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="size-5 text-primary" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4"
                        >
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium line-clamp-1">
                              {item.name}
                            </p>
                            {item.variantName && (
                              <p className="text-sm text-muted-foreground">
                                {item.variantName}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="font-semibold">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Info */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="size-5 text-primary" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {/* Address */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                          Delivery Address
                        </h4>
                        {shippingData && (
                          <div className="text-sm leading-relaxed">
                            <p className="font-medium">
                              {shippingData.fullName}
                            </p>
                            <p>{shippingData.streetAddress}</p>
                            <p>
                              {shippingData.city}, {shippingData.state}{" "}
                              {shippingData.zipCode}
                            </p>
                            <p>{shippingData.country}</p>
                            <p className="mt-1 text-muted-foreground">
                              {shippingData.phone}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Method */}
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                          Shipping Method
                        </h4>
                        <div className="flex items-center gap-2">
                          <selectedShipping.icon className="size-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              {selectedShipping.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedShipping.eta}
                            </p>
                          </div>
                        </div>

                        <h4 className="mb-2 mt-4 text-sm font-medium text-muted-foreground">
                          Payment Method
                        </h4>
                        <div className="flex items-center gap-2">
                          <CreditCard className="size-4 text-primary" />
                          <p className="text-sm font-medium">
                            Credit / Debit Card via Stripe
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Price Breakdown */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Price Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {shippingCost === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          formatPrice(shippingCost)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Tax (8%)
                      </span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span className="text-lg">{formatPrice(total)}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Place Order */}
                <div className="mt-6 space-y-4">
                  <Button
                    size="lg"
                    className="w-full gap-2 text-base"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                  >
                    {isPlacingOrder ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Processing Order...
                      </>
                    ) : (
                      <>
                        <Lock className="size-4" />
                        Place Order &middot; {formatPrice(total)}
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-muted-foreground">
                    By placing this order you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline hover:text-foreground"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline hover:text-foreground"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>

                  <div className="flex justify-start">
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        setCurrentStep(2);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      disabled={isPlacingOrder}
                    >
                      <ChevronLeft className="size-4" />
                      Back to Payment
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Items */}
                <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                    >
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium">
                          {item.name}
                        </p>
                        {item.variantName && (
                          <p className="text-xs text-muted-foreground">
                            {item.variantName}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Subtotal ({itemCount}{" "}
                      {itemCount === 1 ? "item" : "items"})
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>
                      {shippingCost === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shippingCost)
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-lg">{formatPrice(total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
