import { NextRequest, NextResponse } from "next/server";

function getAiResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("track") || lowerMessage.includes("order")) {
    return "To track your order, visit your Dashboard \u2192 Orders. You'll find tracking numbers and real-time status updates there. Need help with a specific order?";
  }

  if (lowerMessage.includes("return") || lowerMessage.includes("refund")) {
    return "We offer hassle-free returns within 30 days. Simply go to Dashboard \u2192 Orders, select your order, and click 'Request Return'. Refunds are processed within 5-7 business days.";
  }

  if (
    lowerMessage.includes("shipping") ||
    lowerMessage.includes("delivery") ||
    lowerMessage.includes("deliver")
  ) {
    return "We offer three shipping options:\n\u2022 **Standard** (5-7 days) \u2014 Free on orders over $50\n\u2022 **Express** (2-3 days) \u2014 $9.99\n\u2022 **Overnight** (Next day) \u2014 $19.99\nInternational shipping available to 50+ countries!";
  }

  if (
    lowerMessage.includes("payment") ||
    lowerMessage.includes("pay") ||
    lowerMessage.includes("card")
  ) {
    return "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and Apple Pay. All transactions are secured with 256-bit SSL encryption through Stripe.";
  }

  if (
    lowerMessage.includes("discount") ||
    lowerMessage.includes("coupon") ||
    lowerMessage.includes("code") ||
    lowerMessage.includes("sale")
  ) {
    return "Great news! Use code **WELCOME10** for 10% off your first order! Check our homepage for current flash deals and seasonal promotions.";
  }

  if (lowerMessage.includes("size") || lowerMessage.includes("fit")) {
    return "Each product page has a detailed size guide. If you're between sizes, we recommend going up. Not sure? Our 30-day free returns make it risk-free to try!";
  }

  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("phone") ||
    lowerMessage.includes("email")
  ) {
    return "You can reach us at:\n\u2022 Email: support@shopverse.com\n\u2022 Phone: 1-800-SHOPVERSE\n\u2022 Live chat: You're already here! \ud83d\ude0a\nOur team is available Mon-Fri, 9AM-6PM EST.";
  }

  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! Welcome to ShopVerse! \ud83d\udc4b How can I help you today? I can assist with orders, shipping, returns, payments, and more!";
  }

  return "I can help with:\n\u2022 \ud83d\udce6 Order tracking & status\n\u2022 \ud83d\ude9a Shipping information\n\u2022 \ud83d\udd04 Returns & refunds\n\u2022 \ud83d\udcb3 Payment questions\n\u2022 \ud83c\udff7\ufe0f Discounts & promotions\n\nJust ask about any of these topics!";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required and must be a string" },
        { status: 400 }
      );
    }

    // Artificial delay to simulate AI processing (500-1000ms)
    const delay = 500 + Math.random() * 500;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const responseMessage = getAiResponse(message);

    return NextResponse.json({
      message: responseMessage,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to process chat message" },
      { status: 500 }
    );
  }
}
