import { createRequire } from "module";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));

// Load env
const dotenv = require("dotenv");
dotenv.config({ path: join(__dirname, "..", ".env") });

const { PrismaClient } = require(join(__dirname, "..", "src", "generated", "prisma"));
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data in order
  await prisma.chatMessage.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  console.log("Cleaned existing data.");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Electronics", slug: "electronics", description: "Latest gadgets & technology" } }),
    prisma.category.create({ data: { name: "Fashion", slug: "fashion", description: "Trending styles & apparel" } }),
    prisma.category.create({ data: { name: "Home & Garden", slug: "home-garden", description: "Decor & home essentials" } }),
    prisma.category.create({ data: { name: "Sports & Outdoors", slug: "sports-outdoors", description: "Gear & equipment" } }),
    prisma.category.create({ data: { name: "Beauty & Health", slug: "beauty-health", description: "Skincare & wellness" } }),
  ]);
  console.log(`Created ${categories.length} categories.`);

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: "TechPro", slug: "techpro" } }),
    prisma.brand.create({ data: { name: "StyleHouse", slug: "stylehouse" } }),
    prisma.brand.create({ data: { name: "HomeElite", slug: "homeelite" } }),
    prisma.brand.create({ data: { name: "FitGear", slug: "fitgear" } }),
    prisma.brand.create({ data: { name: "PureGlow", slug: "pureglow" } }),
    prisma.brand.create({ data: { name: "UrbanEdge", slug: "urbanedge" } }),
  ]);
  console.log(`Created ${brands.length} brands.`);

  // Create Users
  const adminPw = await bcrypt.hash("admin123", 12);
  const custPw = await bcrypt.hash("customer123", 12);
  const supportPw = await bcrypt.hash("support123", 12);

  const admin = await prisma.user.create({ data: { name: "Admin User", email: "admin@shopverse.com", hashedPassword: adminPw, role: "ADMIN" } });
  const customer = await prisma.user.create({ data: { name: "John Doe", email: "john@example.com", hashedPassword: custPw, role: "CUSTOMER" } });
  await prisma.user.create({ data: { name: "Sarah Support", email: "sarah@shopverse.com", hashedPassword: supportPw, role: "SUPPORT" } });
  console.log("Created users.");

  // Create Address
  const address = await prisma.address.create({
    data: {
      userId: customer.id, label: "Home", fullName: "John Doe",
      phone: "+1 (555) 123-4567", street: "123 Main Street",
      city: "New York", state: "NY", zipCode: "10001", country: "US", isDefault: true,
    },
  });

  // Gradients for images
  const g = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
    "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  ];

  // Create Products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Wireless Noise-Cancelling Headphones", slug: "wireless-noise-cancelling-headphones",
        description: "Experience premium audio with advanced ANC technology, 40mm custom drivers, 30 hours battery life, Bluetooth 5.3, and ultra-comfortable memory foam cushions.",
        price: 199.99, comparePrice: 299.99, sku: "WH-NC-001", stock: 45,
        images: [g[0], g[1], g[2]], featured: true,
        tags: ["wireless", "headphones", "noise-cancelling", "bluetooth"],
        categoryId: categories[0].id, brandId: brands[0].id,
        variants: { create: [
          { name: "Color", value: "Midnight Black", stock: 20, sku: "WH-NC-001-BLK" },
          { name: "Color", value: "Arctic White", stock: 15, sku: "WH-NC-001-WHT" },
          { name: "Color", value: "Navy Blue", stock: 10, sku: "WH-NC-001-NVY" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Ultra-Slim Laptop Stand", slug: "ultra-slim-laptop-stand",
        description: "CNC-machined from aerospace-grade aluminum. Ergonomic eye level, excellent heat dissipation, compatible with 10-17 inch laptops. Folds to 4mm.",
        price: 79.99, comparePrice: 99.99, sku: "LS-US-002", stock: 120,
        images: [g[1], g[0], g[4]], featured: false,
        tags: ["laptop", "stand", "ergonomic"], categoryId: categories[0].id, brandId: brands[0].id,
        variants: { create: [
          { name: "Color", value: "Silver", stock: 60, sku: "LS-US-002-SLV" },
          { name: "Color", value: "Space Gray", stock: 60, sku: "LS-US-002-GRY" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Premium Cashmere Sweater", slug: "premium-cashmere-sweater",
        description: "100% Grade-A Mongolian cashmere with classic crew neck, ribbed cuffs. Ultra-soft hand feel in timeless colors.",
        price: 189.99, comparePrice: 249.99, sku: "CS-PM-003", stock: 35,
        images: [g[5], g[6], g[7]], featured: true,
        tags: ["cashmere", "sweater", "luxury", "fashion"], categoryId: categories[1].id, brandId: brands[1].id,
        variants: { create: [
          { name: "Size", value: "S", stock: 7, sku: "CS-PM-003-S" },
          { name: "Size", value: "M", stock: 10, sku: "CS-PM-003-M" },
          { name: "Size", value: "L", stock: 10, sku: "CS-PM-003-L" },
          { name: "Size", value: "XL", stock: 8, sku: "CS-PM-003-XL" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Smart Home Security Camera", slug: "smart-home-security-camera",
        description: "2K QHD, 360-degree pan, AI person detection, night vision 30ft, two-way audio, siren. Alexa & Google Home compatible.",
        price: 69.99, sku: "SC-SH-004", stock: 200,
        images: [g[2], g[3], g[0]], featured: false,
        tags: ["security", "camera", "smart-home"], categoryId: categories[0].id, brandId: brands[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Handcrafted Ceramic Vase Set", slug: "handcrafted-ceramic-vase-set",
        description: "Set of 3 artisan wheel-thrown ceramic vases with unique reactive matte glaze. Perfect for fresh or dried flowers.",
        price: 129.99, comparePrice: 179.99, sku: "CV-HC-005", stock: 18,
        images: [g[7], g[5], g[3]], featured: true,
        tags: ["ceramic", "vase", "handcrafted", "home-decor"], categoryId: categories[2].id, brandId: brands[2].id,
        variants: { create: [
          { name: "Color", value: "Sage Green", stock: 6, sku: "CV-HC-005-GRN" },
          { name: "Color", value: "Desert Sand", stock: 6, sku: "CV-HC-005-SND" },
          { name: "Color", value: "Ocean Blue", stock: 6, sku: "CV-HC-005-BLU" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Performance Running Shoes", slug: "performance-running-shoes",
        description: "Carbon-fiber plate with ZoomX foam for energy return. Breathable Flyknit upper, waffle outsole for traction.",
        price: 159.99, comparePrice: 199.99, sku: "RS-PR-006", stock: 75,
        images: [g[4], g[0], g[2]], featured: true,
        tags: ["running", "shoes", "sports"], categoryId: categories[3].id, brandId: brands[3].id,
        variants: { create: [
          { name: "Size", value: "8", stock: 15, sku: "RS-PR-006-8" },
          { name: "Size", value: "9", stock: 15, sku: "RS-PR-006-9" },
          { name: "Size", value: "10", stock: 15, sku: "RS-PR-006-10" },
          { name: "Size", value: "11", stock: 15, sku: "RS-PR-006-11" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Organic Skincare Gift Set", slug: "organic-skincare-gift-set",
        description: "4-piece certified organic skincare: cleanser, toner, vitamin C serum, moisturizer. Paraben & sulfate free.",
        price: 89.99, comparePrice: 119.99, sku: "SS-OG-007", stock: 50,
        images: [g[6], g[5], g[7]], featured: false,
        tags: ["skincare", "organic", "gift-set", "beauty"], categoryId: categories[4].id, brandId: brands[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Minimalist Leather Backpack", slug: "minimalist-leather-backpack",
        description: "Full-grain Italian leather, padded 15in laptop pocket, anti-theft hidden pocket, magnetic closure, ergonomic straps.",
        price: 249.99, comparePrice: 329.99, sku: "LB-ML-008", stock: 22,
        images: [g[3], g[0], g[6]], featured: true,
        tags: ["backpack", "leather", "minimalist", "fashion"], categoryId: categories[1].id, brandId: brands[5].id,
        variants: { create: [
          { name: "Color", value: "Cognac Brown", stock: 8, sku: "LB-ML-008-BRN" },
          { name: "Color", value: "Black", stock: 8, sku: "LB-ML-008-BLK" },
          { name: "Color", value: "Tan", stock: 6, sku: "LB-ML-008-TAN" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Smart Fitness Tracker Pro", slug: "smart-fitness-tracker-pro",
        description: "1.4in AMOLED, heart rate, SpO2, GPS, 100+ workouts, 14-day battery. Water-resistant 50m.",
        price: 149.99, sku: "FT-SP-009", stock: 95,
        images: [g[2], g[4], g[1]], featured: false,
        tags: ["fitness", "tracker", "smartwatch"], categoryId: categories[0].id, brandId: brands[3].id,
        variants: { create: [
          { name: "Color", value: "Obsidian Black", stock: 35, sku: "FT-SP-009-BLK" },
          { name: "Color", value: "Rose Gold", stock: 30, sku: "FT-SP-009-RSG" },
          { name: "Color", value: "Midnight Blue", stock: 30, sku: "FT-SP-009-BLU" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Linen Blend Throw Blanket", slug: "linen-blend-throw-blanket",
        description: "French linen & organic cotton, herringbone weave, hand-knotted fringe. Pre-washed. Machine washable.",
        price: 99.99, comparePrice: 139.99, sku: "TB-LB-010", stock: 40,
        images: [g[7], g[5], g[3]], featured: false,
        tags: ["blanket", "linen", "throw", "home-decor"], categoryId: categories[2].id, brandId: brands[2].id,
        variants: { create: [
          { name: "Color", value: "Natural Oat", stock: 15, sku: "TB-LB-010-OAT" },
          { name: "Color", value: "Dusty Rose", stock: 15, sku: "TB-LB-010-RSE" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Tailored Wool Blazer", slug: "tailored-wool-blazer",
        description: "Italian merino wool, half-canvas, peak lapels, hand-finished. Bemberg lining.",
        price: 349.99, comparePrice: 450, sku: "WB-TW-011", stock: 15,
        images: [g[6], g[3], g[0]], featured: false,
        tags: ["blazer", "wool", "tailored", "fashion"], categoryId: categories[1].id, brandId: brands[1].id,
        variants: { create: [
          { name: "Size", value: "S", stock: 4, sku: "WB-TW-011-S" },
          { name: "Size", value: "M", stock: 4, sku: "WB-TW-011-M" },
          { name: "Size", value: "L", stock: 4, sku: "WB-TW-011-L" },
          { name: "Size", value: "XL", stock: 3, sku: "WB-TW-011-XL" },
        ]},
      },
    }),
    prisma.product.create({
      data: {
        name: "Yoga Mat Premium Collection", slug: "yoga-mat-premium-collection",
        description: "6mm natural rubber, wet-grip suede surface, alignment guides. Includes strap and cotton bag.",
        price: 74.99, comparePrice: 94.99, sku: "YM-PC-012", stock: 65,
        images: [g[4], g[2], g[6]], featured: false,
        tags: ["yoga", "mat", "fitness", "eco-friendly"], categoryId: categories[3].id, brandId: brands[5].id,
        variants: { create: [
          { name: "Color", value: "Forest Green", stock: 25, sku: "YM-PC-012-GRN" },
          { name: "Color", value: "Twilight Purple", stock: 20, sku: "YM-PC-012-PRP" },
          { name: "Color", value: "Sunrise Coral", stock: 20, sku: "YM-PC-012-CRL" },
        ]},
      },
    }),
  ]);
  console.log(`Created ${products.length} products.`);

  // Create Reviews for first product
  const reviewers = [
    { name: "Alex Thompson", email: "alex@example.com", rating: 5, title: "Best headphones ever!", comment: "The noise cancellation is incredible. Sound quality is phenomenal." },
    { name: "Sarah Chen", email: "sarah.c@example.com", rating: 4, title: "Great quality", comment: "Sound quality and ANC are top-notch. Slightly snug after a few hours." },
    { name: "Marcus Rivera", email: "marcus@example.com", rating: 5, title: "Perfect for WFH", comment: "Game-changer for my WFH setup. Microphone quality is excellent." },
    { name: "Emily Watson", email: "emily@example.com", rating: 5, title: "Exceeded expectations", comment: "Sound stage is wide and natural, ANC adapts to environment." },
    { name: "David Kim", email: "david@example.com", rating: 3, title: "Good but not perfect", comment: "Sound quality is good but not audiophile-level for the price." },
  ];

  for (const r of reviewers) {
    const u = await prisma.user.create({ data: { name: r.name, email: r.email, role: "CUSTOMER" } });
    await prisma.review.create({
      data: { userId: u.id, productId: products[0].id, rating: r.rating, title: r.title, comment: r.comment, isVerified: true },
    });
  }
  console.log("Created reviews.");

  // Create Coupons
  await Promise.all([
    prisma.coupon.create({ data: { code: "WELCOME10", description: "10% off first order", discountType: "PERCENTAGE", discountValue: 10, minPurchase: 50, maxDiscount: 50, usageLimit: 1000, isActive: true, expiresAt: new Date("2026-12-31") } }),
    prisma.coupon.create({ data: { code: "SAVE20", description: "$20 off over $100", discountType: "FIXED", discountValue: 20, minPurchase: 100, isActive: true, expiresAt: new Date("2026-06-30") } }),
    prisma.coupon.create({ data: { code: "FLAT15", description: "15% off everything", discountType: "PERCENTAGE", discountValue: 15, maxDiscount: 75, isActive: true, expiresAt: new Date("2026-03-31") } }),
  ]);
  console.log("Created coupons.");

  // Create sample order
  await prisma.order.create({
    data: {
      orderNumber: "SV-DEMO-001", userId: customer.id, addressId: address.id,
      status: "DELIVERED", paymentStatus: "PAID",
      subtotal: 199.99, shipping: 0, tax: 16, total: 215.99,
      items: { create: [{ productId: products[0].id, quantity: 1, price: 199.99, total: 199.99 }] },
    },
  });
  console.log("Created sample order.");
  console.log("Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
