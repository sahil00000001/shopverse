import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
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
  await prisma.user.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();

  console.log("Cleaned existing data.");

  // Create Categories with images
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Electronics", slug: "electronics", description: "Latest gadgets & technology", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80" },
    }),
    prisma.category.create({
      data: { name: "Fashion", slug: "fashion", description: "Trending styles & apparel", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" },
    }),
    prisma.category.create({
      data: { name: "Home & Garden", slug: "home-garden", description: "Decor & home essentials", image: "https://images.unsplash.com/photo-1615529162924-f7c3fbe5f298?w=800&q=80" },
    }),
    prisma.category.create({
      data: { name: "Sports & Outdoors", slug: "sports-outdoors", description: "Gear & equipment", image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
    }),
    prisma.category.create({
      data: { name: "Beauty & Health", slug: "beauty-health", description: "Skincare & wellness", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80" },
    }),
  ]);

  console.log(`Created ${categories.length} categories.`);

  // Create Brands
  const brands = await Promise.all([
    prisma.brand.create({ data: { name: "TechPro", slug: "techpro", logo: "" } }),
    prisma.brand.create({ data: { name: "StyleHouse", slug: "stylehouse", logo: "" } }),
    prisma.brand.create({ data: { name: "HomeElite", slug: "homeelite", logo: "" } }),
    prisma.brand.create({ data: { name: "FitGear", slug: "fitgear", logo: "" } }),
    prisma.brand.create({ data: { name: "PureGlow", slug: "pureglow", logo: "" } }),
    prisma.brand.create({ data: { name: "UrbanEdge", slug: "urbanedge", logo: "" } }),
  ]);

  console.log(`Created ${brands.length} brands.`);

  // Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@shopverse.com",
      hashedPassword,
      role: "ADMIN",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    },
  });

  // Create Demo Customer
  const customerPassword = await bcrypt.hash("customer123", 12);
  const customer = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
      hashedPassword: customerPassword,
      role: "CUSTOMER",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    },
  });

  // Create Support Agent
  const agentPassword = await bcrypt.hash("support123", 12);
  await prisma.user.create({
    data: {
      name: "Sarah Support",
      email: "sarah@shopverse.com",
      hashedPassword: agentPassword,
      role: "SUPPORT",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    },
  });

  console.log("Created users (admin, customer, support).");

  // Create Address for customer
  await prisma.address.create({
    data: {
      userId: customer.id,
      label: "Home",
      fullName: "John Doe",
      phone: "+1 (555) 123-4567",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "US",
      isDefault: true,
    },
  });

  // Create Products with real images from Unsplash
  const productImages = {
    headphones: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80",
      "https://images.unsplash.com/photo-1545127398-14699f92334b?w=800&q=80"
    ],
    laptopStand: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80",
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800&q=80",
      "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=800&q=80"
    ],
    sweater: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
    ],
    securityCamera: [
      "https://images.unsplash.com/photo-1557324232-b8917d3c3dcb?w=800&q=80",
      "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&q=80",
      "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800&q=80"
    ],
    vase: [
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=800&q=80",
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80",
      "https://images.unsplash.com/photo-1493217465235-252dd9c0d632?w=800&q=80"
    ],
    runningShoes: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80"
    ],
    skincare: [
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
    ],
    smartwatch: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80",
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80"
    ],
    backpack: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&q=80"
    ],
    plant: [
      "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=800&q=80",
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=800&q=80",
      "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80"
    ],
    yogaMat: [
      "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&q=80",
      "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
    ],
    sunglasses: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80"
    ]
  };

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Wireless Noise-Cancelling Headphones",
        slug: "wireless-noise-cancelling-headphones",
        description: "Experience premium audio with advanced ANC technology, 40mm custom drivers, 30 hours battery life, Bluetooth 5.3 connectivity, and ultra-comfortable memory foam cushions. Perfect for work, travel, and leisure.",
        price: 199.99,
        comparePrice: 299.99,
        sku: "WH-NC-001",
        stock: 45,
        images: productImages.headphones,
        featured: true,
        tags: ["wireless", "headphones", "noise-cancelling", "bluetooth"],
        categoryId: categories[0].id,
        brandId: brands[0].id,
        variants: {
          create: [
            { name: "Color", value: "Midnight Black", stock: 20, sku: "WH-NC-001-BLK" },
            { name: "Color", value: "Arctic White", stock: 15, sku: "WH-NC-001-WHT" },
            { name: "Color", value: "Navy Blue", stock: 10, sku: "WH-NC-001-NVY" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Ultra-Slim Laptop Stand",
        slug: "ultra-slim-laptop-stand",
        description: "CNC-machined from aerospace-grade aluminum. Raises your laptop to ergonomic eye level with excellent heat dissipation. Compatible with 10 to 17 inch laptops. Folds flat to 4mm.",
        price: 79.99,
        comparePrice: 99.99,
        sku: "LS-US-002",
        stock: 120,
        images: productImages.laptopStand,
        featured: false,
        tags: ["laptop", "stand", "ergonomic", "aluminum"],
        categoryId: categories[0].id,
        brandId: brands[0].id,
        variants: {
          create: [
            { name: "Color", value: "Silver", stock: 60, sku: "LS-US-002-SLV" },
            { name: "Color", value: "Space Gray", stock: 60, sku: "LS-US-002-GRY" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Premium Cashmere Sweater",
        slug: "premium-cashmere-sweater",
        description: "100% Grade-A Mongolian cashmere with classic crew neck design. Ribbed cuffs and hem for a tailored fit. Ultra-soft hand feel. Available in timeless colors.",
        price: 189.99,
        comparePrice: 249.99,
        sku: "CS-PM-003",
        stock: 35,
        images: productImages.sweater,
        featured: true,
        tags: ["cashmere", "sweater", "luxury", "fashion"],
        categoryId: categories[1].id,
        brandId: brands[1].id,
        variants: {
          create: [
            { name: "Size", value: "S", stock: 7, sku: "CS-PM-003-S" },
            { name: "Size", value: "M", stock: 10, sku: "CS-PM-003-M" },
            { name: "Size", value: "L", stock: 10, sku: "CS-PM-003-L" },
            { name: "Size", value: "XL", stock: 8, sku: "CS-PM-003-XL" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Smart Home Security Camera",
        slug: "smart-home-security-camera",
        description: "2K QHD resolution, 360-degree pan and tilt, AI-powered person detection, night vision up to 30 feet, two-way audio, built-in siren. Compatible with Alexa and Google Home.",
        price: 69.99,
        sku: "SC-SH-004",
        stock: 200,
        images: productImages.securityCamera,
        featured: false,
        tags: ["security", "camera", "smart-home", "wifi"],
        categoryId: categories[0].id,
        brandId: brands[0].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Handcrafted Ceramic Vase Set",
        slug: "handcrafted-ceramic-vase-set",
        description: "Set of 3 artisan wheel-thrown ceramic vases with unique reactive matte glaze finish. Perfect for fresh or dried flower arrangements.",
        price: 129.99,
        comparePrice: 179.99,
        sku: "CV-HC-005",
        stock: 18,
        images: productImages.vase,
        featured: true,
        tags: ["ceramic", "vase", "handcrafted", "home-decor"],
        categoryId: categories[2].id,
        brandId: brands[2].id,
        variants: {
          create: [
            { name: "Color", value: "Sage Green", stock: 6, sku: "CV-HC-005-GRN" },
            { name: "Color", value: "Desert Sand", stock: 6, sku: "CV-HC-005-SND" },
            { name: "Color", value: "Ocean Blue", stock: 6, sku: "CV-HC-005-BLU" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Performance Running Shoes",
        slug: "performance-running-shoes",
        description: "Carbon-fiber plated running shoes with ZoomX foam for maximum energy return. Breathable Flyknit upper and waffle-inspired outsole for superior traction.",
        price: 159.99,
        comparePrice: 199.99,
        sku: "RS-PR-006",
        stock: 75,
        images: productImages.runningShoes,
        featured: true,
        tags: ["running", "shoes", "sports", "performance"],
        categoryId: categories[3].id,
        brandId: brands[3].id,
        variants: {
          create: [
            { name: "Size", value: "8", stock: 15, sku: "RS-PR-006-8" },
            { name: "Size", value: "9", stock: 15, sku: "RS-PR-006-9" },
            { name: "Size", value: "10", stock: 15, sku: "RS-PR-006-10" },
            { name: "Size", value: "11", stock: 15, sku: "RS-PR-006-11" },
            { name: "Size", value: "12", stock: 15, sku: "RS-PR-006-12" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Organic Skincare Gift Set",
        slug: "organic-skincare-gift-set",
        description: "4-piece certified organic skincare set: gentle foaming cleanser, hydrating toner, vitamin C serum, and rich moisturizer. Paraben and sulfate free.",
        price: 89.99,
        comparePrice: 119.99,
        sku: "SS-OG-007",
        stock: 50,
        images: productImages.skincare,
        featured: false,
        tags: ["skincare", "organic", "gift-set", "beauty"],
        categoryId: categories[4].id,
        brandId: brands[4].id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Minimalist Leather Backpack",
        slug: "minimalist-leather-backpack",
        description: "Full-grain Italian leather backpack with padded 15-inch laptop compartment, hidden anti-theft pocket, magnetic closure, and adjustable ergonomic straps.",
        price: 249.99,
        comparePrice: 329.99,
        sku: "LB-ML-008",
        stock: 22,
        images: productImages.backpack,
        featured: true,
        tags: ["backpack", "leather", "minimalist", "fashion"],
        categoryId: categories[1].id,
        brandId: brands[5].id,
        variants: {
          create: [
            { name: "Color", value: "Cognac Brown", stock: 8, sku: "LB-ML-008-BRN" },
            { name: "Color", value: "Black", stock: 8, sku: "LB-ML-008-BLK" },
            { name: "Color", value: "Tan", stock: 6, sku: "LB-ML-008-TAN" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Smart Fitness Tracker Pro",
        slug: "smart-fitness-tracker-pro",
        description: "1.4-inch AMOLED display, continuous heart rate and SpO2 monitoring, built-in GPS, 100+ workout modes, 14-day battery life. Water-resistant to 50 meters.",
        price: 149.99,
        sku: "FT-SP-009",
        stock: 95,
        images: productImages.smartwatch,
        featured: false,
        tags: ["fitness", "tracker", "smartwatch", "health"],
        categoryId: categories[0].id,
        brandId: brands[3].id,
        variants: {
          create: [
            { name: "Color", value: "Obsidian Black", stock: 35, sku: "FT-SP-009-BLK" },
            { name: "Color", value: "Rose Gold", stock: 30, sku: "FT-SP-009-RSG" },
            { name: "Color", value: "Midnight Blue", stock: 30, sku: "FT-SP-009-BLU" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Linen Blend Throw Blanket",
        slug: "linen-blend-throw-blanket",
        description: "French linen and organic cotton blend throw with herringbone weave and hand-knotted fringe. Pre-washed for immediate softness. Machine washable.",
        price: 99.99,
        comparePrice: 139.99,
        sku: "TB-LB-010",
        stock: 40,
        images: productImages.plant,
        featured: false,
        tags: ["blanket", "linen", "throw", "home-decor"],
        categoryId: categories[2].id,
        brandId: brands[2].id,
        variants: {
          create: [
            { name: "Color", value: "Natural Oat", stock: 15, sku: "TB-LB-010-OAT" },
            { name: "Color", value: "Dusty Rose", stock: 15, sku: "TB-LB-010-RSE" },
            { name: "Color", value: "Slate Gray", stock: 10, sku: "TB-LB-010-GRY" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Tailored Wool Blazer",
        slug: "tailored-wool-blazer",
        description: "Italian merino wool blazer with half-canvas construction, peak lapels, and hand-finished details. Bemberg lining for breathability.",
        price: 349.99,
        comparePrice: 450.00,
        sku: "WB-TW-011",
        stock: 15,
        images: productImages.sunglasses,
        featured: false,
        tags: ["blazer", "wool", "tailored", "fashion"],
        categoryId: categories[1].id,
        brandId: brands[1].id,
        variants: {
          create: [
            { name: "Size", value: "S", stock: 4, sku: "WB-TW-011-S" },
            { name: "Size", value: "M", stock: 4, sku: "WB-TW-011-M" },
            { name: "Size", value: "L", stock: 4, sku: "WB-TW-011-L" },
            { name: "Size", value: "XL", stock: 3, sku: "WB-TW-011-XL" },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        name: "Yoga Mat Premium Collection",
        slug: "yoga-mat-premium-collection",
        description: "6mm natural rubber yoga mat with wet-grip suede surface, alignment guides, and eco-friendly materials. Includes carrying strap and cotton bag.",
        price: 74.99,
        comparePrice: 94.99,
        sku: "YM-PC-012",
        stock: 65,
        images: productImages.yogaMat,
        featured: false,
        tags: ["yoga", "mat", "fitness", "eco-friendly"],
        categoryId: categories[3].id,
        brandId: brands[5].id,
        variants: {
          create: [
            { name: "Color", value: "Forest Green", stock: 25, sku: "YM-PC-012-GRN" },
            { name: "Color", value: "Twilight Purple", stock: 20, sku: "YM-PC-012-PRP" },
            { name: "Color", value: "Sunrise Coral", stock: 20, sku: "YM-PC-012-CRL" },
          ],
        },
      },
    }),
  ]);

  console.log(`Created ${products.length} products.`);

  // Create Reviews
  const reviewData = [
    { rating: 5, title: "Best headphones I have ever owned!", comment: "The noise cancellation is incredible. Sound quality is phenomenal with deep, rich bass and crisp highs. Highly recommend!", userName: "Alex Thompson" },
    { rating: 4, title: "Great quality, slightly tight fit", comment: "Sound quality and ANC are top-notch. My only minor complaint is they feel a bit snug after a few hours.", userName: "Sarah Chen" },
    { rating: 5, title: "Perfect for working from home", comment: "These headphones have been a game-changer for my WFH setup. The microphone quality is excellent for video calls.", userName: "Marcus Rivera" },
    { rating: 5, title: "Exceeded my expectations", comment: "The sound stage is wide and natural, the ANC adapts to your environment, and they are incredibly comfortable.", userName: "Emily Watson" },
    { rating: 3, title: "Good but not perfect", comment: "Sound quality is good but not quite audiophile-level. For the price, I expected slightly better in some areas.", userName: "David Kim" },
  ];

  for (const review of reviewData) {
    const reviewUser = await prisma.user.create({
      data: {
        name: review.userName,
        email: `${review.userName.toLowerCase().replace(" ", ".")}@example.com`,
        role: "CUSTOMER",
      },
    });
    await prisma.review.create({
      data: {
        userId: reviewUser.id,
        productId: products[0].id,
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        isVerified: true,
      },
    });
  }

  console.log("Created reviews.");

  // Create Coupons
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: "WELCOME10",
        description: "10% off your first order",
        discountType: "PERCENTAGE",
        discountValue: 10,
        minPurchase: 50,
        maxDiscount: 50,
        usageLimit: 1000,
        isActive: true,
        expiresAt: new Date("2026-12-31"),
      },
    }),
    prisma.coupon.create({
      data: {
        code: "SAVE20",
        description: "$20 off orders over $100",
        discountType: "FIXED",
        discountValue: 20,
        minPurchase: 100,
        isActive: true,
        expiresAt: new Date("2026-06-30"),
      },
    }),
    prisma.coupon.create({
      data: {
        code: "FLAT15",
        description: "15% off everything",
        discountType: "PERCENTAGE",
        discountValue: 15,
        maxDiscount: 75,
        isActive: true,
        expiresAt: new Date("2026-03-31"),
      },
    }),
  ]);

  console.log("Created coupons.");

  // Create a sample order for the customer
  await prisma.order.create({
    data: {
      orderNumber: "SV-DEMO-001",
      userId: customer.id,
      addressId: (await prisma.address.findFirst({ where: { userId: customer.id } }))!.id,
      status: "DELIVERED",
      paymentStatus: "PAID",
      subtotal: 199.99,
      shipping: 0,
      tax: 16.00,
      total: 215.99,
      items: {
        create: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 199.99,
            total: 199.99,
          },
        ],
      },
    },
  });

  console.log("Created sample order.");
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
