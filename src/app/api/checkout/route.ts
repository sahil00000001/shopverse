import { NextRequest, NextResponse } from "next/server";

const TAX_RATE = 0.08;
const FREE_SHIPPING_THRESHOLD = 50;

const SHIPPING_COSTS: Record<string, number> = {
  standard: 0,
  express: 9.99,
  overnight: 19.99,
};

const COUPON_CODES: Record<string, number> = {
  WELCOME10: 0.1,
  SAVE20: 0.2,
  HALFOFF: 0.5,
};

interface CheckoutItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  variantId?: string;
}

interface ShippingInfo {
  fullName: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  method: string;
  cost: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shipping, couponCode } = body as {
      items: CheckoutItem[];
      shipping: ShippingInfo;
      couponCode?: string;
    };

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Cart items are required" },
        { status: 400 }
      );
    }

    // Validate shipping
    if (!shipping || !shipping.fullName || !shipping.streetAddress) {
      return NextResponse.json(
        { error: "Shipping address is required" },
        { status: 400 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Calculate shipping cost
    const shippingMethod = shipping.method || "standard";
    let shippingCost = SHIPPING_COSTS[shippingMethod] ?? 0;
    if (subtotal >= FREE_SHIPPING_THRESHOLD && shippingMethod === "standard") {
      shippingCost = 0;
    }

    // Calculate discount
    let discount = 0;
    if (couponCode && COUPON_CODES[couponCode.toUpperCase()]) {
      discount = subtotal * COUPON_CODES[couponCode.toUpperCase()];
    }

    // Calculate tax
    const taxableAmount = subtotal - discount;
    const tax = taxableAmount * TAX_RATE;

    // Calculate total
    const total = taxableAmount + shippingCost + tax;

    // Generate order number and ID
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const orderNumber = `SV-${timestamp}-${random}`;
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      success: true,
      orderId,
      orderNumber,
      summary: {
        subtotal: Math.round(subtotal * 100) / 100,
        shipping: Math.round(shippingCost * 100) / 100,
        discount: Math.round(discount * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100,
        itemCount: items.reduce((count, item) => count + item.quantity, 0),
      },
      shippingAddress: {
        fullName: shipping.fullName,
        streetAddress: shipping.streetAddress,
        city: shipping.city,
        state: shipping.state,
        zipCode: shipping.zipCode,
        country: shipping.country,
      },
      shippingMethod,
      estimatedDelivery:
        shippingMethod === "overnight"
          ? "Next business day"
          : shippingMethod === "express"
            ? "2-3 business days"
            : "5-7 business days",
      createdAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process checkout. Please try again." },
      { status: 500 }
    );
  }
}
