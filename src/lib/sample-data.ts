export interface SampleProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  comparePrice: number | null;
  sku: string;
  stock: number;
  images: string[];
  featured: boolean;
  isActive: boolean;
  tags: string[];
  categoryId: string;
  category: { id: string; name: string; slug: string };
  brandId: string;
  brand: { id: string; name: string; slug: string };
  rating: number;
  reviewCount: number;
  variants: SampleVariant[];
  colors: string[];
  sizes: string[];
}

export interface SampleVariant {
  id: string;
  name: string;
  type: string;
  value: string;
  price?: number;
  stock: number;
}

export interface SampleReview {
  id: string;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  userName: string;
  userAvatar: string;
  createdAt: string;
  verified: boolean;
}

export interface SampleCategory {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface SampleBrand {
  id: string;
  name: string;
  slug: string;
  count: number;
}

// Gradient placeholder images for demo
const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff7eb3 100%)",
  "linear-gradient(135deg, #667eea 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
];

export const sampleCategories: SampleCategory[] = [
  { id: "cat-1", name: "Electronics", slug: "electronics", count: 4 },
  { id: "cat-2", name: "Fashion", slug: "fashion", count: 3 },
  { id: "cat-3", name: "Home & Garden", slug: "home-garden", count: 2 },
  { id: "cat-4", name: "Sports & Outdoors", slug: "sports-outdoors", count: 2 },
  { id: "cat-5", name: "Beauty & Health", slug: "beauty-health", count: 1 },
];

export const sampleBrands: SampleBrand[] = [
  { id: "br-1", name: "TechPro", slug: "techpro", count: 3 },
  { id: "br-2", name: "StyleHouse", slug: "stylehouse", count: 2 },
  { id: "br-3", name: "HomeElite", slug: "homeelite", count: 2 },
  { id: "br-4", name: "FitGear", slug: "fitgear", count: 2 },
  { id: "br-5", name: "PureGlow", slug: "pureglow", count: 1 },
  { id: "br-6", name: "UrbanEdge", slug: "urbanedge", count: 2 },
];

export const sampleProducts: SampleProduct[] = [
  {
    id: "prod-1",
    name: "Wireless Noise-Cancelling Headphones",
    slug: "wireless-noise-cancelling-headphones",
    description:
      "Experience premium audio with our Wireless Noise-Cancelling Headphones. Featuring advanced ANC technology, 40mm custom drivers deliver rich, immersive sound with deep bass and crystal-clear highs. The memory foam ear cushions and adjustable headband ensure all-day comfort. With 30 hours of battery life, Bluetooth 5.3 connectivity, and multipoint pairing, these headphones are perfect for work, travel, and leisure. The built-in microphone with AI-powered noise reduction ensures crystal-clear calls. Foldable design with premium carrying case included.",
    shortDescription:
      "Premium ANC headphones with 30hr battery, Bluetooth 5.3, and ultra-comfortable memory foam cushions.",
    price: 199.99,
    comparePrice: 299.99,
    sku: "WH-NC-001",
    stock: 45,
    images: [gradients[0], gradients[1], gradients[2], gradients[3]],
    featured: true,
    isActive: true,
    tags: ["wireless", "headphones", "noise-cancelling", "bluetooth"],
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Electronics", slug: "electronics" },
    brandId: "br-1",
    brand: { id: "br-1", name: "TechPro", slug: "techpro" },
    rating: 4.7,
    reviewCount: 234,
    variants: [
      { id: "v1", name: "Midnight Black", type: "color", value: "#1a1a2e", stock: 20 },
      { id: "v2", name: "Arctic White", type: "color", value: "#f0f0f0", stock: 15 },
      { id: "v3", name: "Navy Blue", type: "color", value: "#16213e", stock: 10 },
    ],
    colors: ["#1a1a2e", "#f0f0f0", "#16213e"],
    sizes: [],
  },
  {
    id: "prod-2",
    name: "Ultra-Slim Laptop Stand",
    slug: "ultra-slim-laptop-stand",
    description:
      "Elevate your workspace with the Ultra-Slim Laptop Stand. CNC-machined from a single block of aerospace-grade aluminum, this stand raises your laptop to ergonomic eye level while providing excellent heat dissipation. The anti-slip silicone pads protect your device, and the hollow center design allows optimal airflow. Compatible with laptops from 10 to 17 inches. Folds flat to just 4mm for easy portability.",
    shortDescription:
      "Aerospace-grade aluminum laptop stand with ergonomic design and superior heat dissipation.",
    price: 79.99,
    comparePrice: 99.99,
    sku: "LS-US-002",
    stock: 120,
    images: [gradients[1], gradients[0], gradients[4]],
    featured: false,
    isActive: true,
    tags: ["laptop", "stand", "ergonomic", "aluminum"],
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Electronics", slug: "electronics" },
    brandId: "br-1",
    brand: { id: "br-1", name: "TechPro", slug: "techpro" },
    rating: 4.5,
    reviewCount: 89,
    variants: [
      { id: "v4", name: "Silver", type: "color", value: "#c0c0c0", stock: 60 },
      { id: "v5", name: "Space Gray", type: "color", value: "#4a4a4a", stock: 60 },
    ],
    colors: ["#c0c0c0", "#4a4a4a"],
    sizes: [],
  },
  {
    id: "prod-3",
    name: "Premium Cashmere Sweater",
    slug: "premium-cashmere-sweater",
    description:
      "Wrap yourself in luxury with our Premium Cashmere Sweater. Made from 100% Grade-A Mongolian cashmere, this sweater offers unparalleled softness and warmth without bulk. The classic crew neck design features ribbed cuffs and hem for a tailored fit. Each sweater undergoes a special washing process for an incredibly soft hand feel. Available in timeless colors that pair effortlessly with any wardrobe.",
    shortDescription:
      "100% Grade-A Mongolian cashmere sweater with classic crew neck and ultra-soft finish.",
    price: 189.99,
    comparePrice: 249.99,
    sku: "CS-PM-003",
    stock: 35,
    images: [gradients[5], gradients[6], gradients[7]],
    featured: true,
    isActive: true,
    tags: ["cashmere", "sweater", "luxury", "fashion"],
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Fashion", slug: "fashion" },
    brandId: "br-2",
    brand: { id: "br-2", name: "StyleHouse", slug: "stylehouse" },
    rating: 4.8,
    reviewCount: 156,
    variants: [
      { id: "v6", name: "Camel", type: "color", value: "#c19a6b", stock: 10 },
      { id: "v7", name: "Charcoal", type: "color", value: "#36454f", stock: 10 },
      { id: "v8", name: "Ivory", type: "color", value: "#fffff0", stock: 15 },
    ],
    colors: ["#c19a6b", "#36454f", "#fffff0"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "prod-4",
    name: "Smart Home Security Camera",
    slug: "smart-home-security-camera",
    description:
      "Keep your home safe with the Smart Home Security Camera. Featuring 2K QHD resolution, 360-degree pan and tilt, AI-powered person detection, and advanced night vision up to 30 feet. Two-way audio lets you communicate with visitors, and the built-in siren deters intruders. Compatible with Alexa and Google Home. Includes free cloud storage for 30 days of recordings. Easy setup in under 5 minutes via our companion app.",
    shortDescription:
      "2K QHD smart camera with 360-degree view, AI detection, night vision, and voice assistant support.",
    price: 69.99,
    comparePrice: null,
    sku: "SC-SH-004",
    stock: 200,
    images: [gradients[2], gradients[3], gradients[0]],
    featured: false,
    isActive: true,
    tags: ["security", "camera", "smart-home", "wifi"],
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Electronics", slug: "electronics" },
    brandId: "br-1",
    brand: { id: "br-1", name: "TechPro", slug: "techpro" },
    rating: 4.3,
    reviewCount: 412,
    variants: [],
    colors: [],
    sizes: [],
  },
  {
    id: "prod-5",
    name: "Handcrafted Ceramic Vase Set",
    slug: "handcrafted-ceramic-vase-set",
    description:
      "Add artisan elegance to your space with our Handcrafted Ceramic Vase Set. Each piece is individually wheel-thrown and glazed by master ceramicists, making every set unique. The collection includes three complementary sizes with organic shapes and a matte reactive glaze finish. Perfect for fresh or dried flower arrangements, or as standalone sculptural pieces. The weighted bases ensure stability on any surface.",
    shortDescription:
      "Set of 3 artisan wheel-thrown ceramic vases with unique reactive matte glaze finish.",
    price: 129.99,
    comparePrice: 179.99,
    sku: "CV-HC-005",
    stock: 18,
    images: [gradients[7], gradients[5], gradients[11]],
    featured: true,
    isActive: true,
    tags: ["ceramic", "vase", "handcrafted", "home-decor"],
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Home & Garden", slug: "home-garden" },
    brandId: "br-3",
    brand: { id: "br-3", name: "HomeElite", slug: "homeelite" },
    rating: 4.9,
    reviewCount: 67,
    variants: [
      { id: "v9", name: "Sage Green", type: "color", value: "#9caf88", stock: 6 },
      { id: "v10", name: "Desert Sand", type: "color", value: "#edc9af", stock: 6 },
      { id: "v11", name: "Ocean Blue", type: "color", value: "#4f86c6", stock: 6 },
    ],
    colors: ["#9caf88", "#edc9af", "#4f86c6"],
    sizes: [],
  },
  {
    id: "prod-6",
    name: "Performance Running Shoes",
    slug: "performance-running-shoes",
    description:
      "Engineered for speed and comfort, our Performance Running Shoes feature a revolutionary carbon-fiber plate embedded in responsive ZoomX foam for maximum energy return. The breathable Flyknit upper provides a sock-like fit that adapts to your foot, while the waffle-inspired outsole delivers superior traction on any surface. Whether you are training for a marathon or hitting the gym, these shoes will elevate your performance.",
    shortDescription:
      "Carbon-fiber plated running shoes with ZoomX foam for maximum energy return and breathable Flyknit upper.",
    price: 159.99,
    comparePrice: 199.99,
    sku: "RS-PR-006",
    stock: 75,
    images: [gradients[4], gradients[8], gradients[9]],
    featured: true,
    isActive: true,
    tags: ["running", "shoes", "sports", "performance"],
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Sports & Outdoors", slug: "sports-outdoors" },
    brandId: "br-4",
    brand: { id: "br-4", name: "FitGear", slug: "fitgear" },
    rating: 4.6,
    reviewCount: 321,
    variants: [
      { id: "v12", name: "Volt Green", type: "color", value: "#b5d43b", stock: 25 },
      { id: "v13", name: "Core Black", type: "color", value: "#1a1a1a", stock: 25 },
      { id: "v14", name: "Cloud White", type: "color", value: "#f5f5f5", stock: 25 },
    ],
    colors: ["#b5d43b", "#1a1a1a", "#f5f5f5"],
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    id: "prod-7",
    name: "Organic Skincare Gift Set",
    slug: "organic-skincare-gift-set",
    description:
      "Treat yourself or a loved one to our Organic Skincare Gift Set. This luxurious collection includes a gentle foaming cleanser, hydrating toner, vitamin C serum, and rich moisturizer -- all formulated with certified organic botanicals. Free from parabens, sulfates, and synthetic fragrances. Each product is dermatologist-tested and suitable for all skin types. Beautifully packaged in a recyclable gift box with a natural linen pouch.",
    shortDescription:
      "4-piece certified organic skincare set with cleanser, toner, serum, and moisturizer in gift packaging.",
    price: 89.99,
    comparePrice: 119.99,
    sku: "SS-OG-007",
    stock: 50,
    images: [gradients[6], gradients[5], gradients[7]],
    featured: false,
    isActive: true,
    tags: ["skincare", "organic", "gift-set", "beauty"],
    categoryId: "cat-5",
    category: { id: "cat-5", name: "Beauty & Health", slug: "beauty-health" },
    brandId: "br-5",
    brand: { id: "br-5", name: "PureGlow", slug: "pureglow" },
    rating: 4.4,
    reviewCount: 178,
    variants: [],
    colors: [],
    sizes: [],
  },
  {
    id: "prod-8",
    name: "Minimalist Leather Backpack",
    slug: "minimalist-leather-backpack",
    description:
      "Our Minimalist Leather Backpack combines timeless style with modern functionality. Crafted from full-grain Italian leather that develops a beautiful patina over time. Features a padded 15-inch laptop compartment, hidden anti-theft back pocket, magnetic closure, and adjustable ergonomic straps. The water-resistant lining protects your essentials, while the YKK zippers ensure long-lasting durability. Perfect for the modern professional.",
    shortDescription:
      "Full-grain Italian leather backpack with laptop compartment, anti-theft pocket, and ergonomic design.",
    price: 249.99,
    comparePrice: 329.99,
    sku: "LB-ML-008",
    stock: 22,
    images: [gradients[3], gradients[0], gradients[10]],
    featured: true,
    isActive: true,
    tags: ["backpack", "leather", "minimalist", "fashion"],
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Fashion", slug: "fashion" },
    brandId: "br-6",
    brand: { id: "br-6", name: "UrbanEdge", slug: "urbanedge" },
    rating: 4.7,
    reviewCount: 93,
    variants: [
      { id: "v15", name: "Cognac Brown", type: "color", value: "#834a20", stock: 8 },
      { id: "v16", name: "Black", type: "color", value: "#1a1a1a", stock: 8 },
      { id: "v17", name: "Tan", type: "color", value: "#d2b48c", stock: 6 },
    ],
    colors: ["#834a20", "#1a1a1a", "#d2b48c"],
    sizes: [],
  },
  {
    id: "prod-9",
    name: "Smart Fitness Tracker Pro",
    slug: "smart-fitness-tracker-pro",
    description:
      "Take your fitness to the next level with the Smart Fitness Tracker Pro. Features a vibrant 1.4-inch AMOLED always-on display, continuous heart rate and SpO2 monitoring, built-in GPS, and 100+ workout modes. Track your sleep quality with advanced REM analysis, manage stress with guided breathing exercises, and stay connected with smart notifications. Water-resistant to 50 meters with a 14-day battery life.",
    shortDescription:
      "Advanced fitness tracker with AMOLED display, GPS, SpO2, 100+ workouts, and 14-day battery life.",
    price: 149.99,
    comparePrice: null,
    sku: "FT-SP-009",
    stock: 95,
    images: [gradients[9], gradients[10], gradients[2]],
    featured: false,
    isActive: true,
    tags: ["fitness", "tracker", "smartwatch", "health"],
    categoryId: "cat-1",
    category: { id: "cat-1", name: "Electronics", slug: "electronics" },
    brandId: "br-4",
    brand: { id: "br-4", name: "FitGear", slug: "fitgear" },
    rating: 4.2,
    reviewCount: 567,
    variants: [
      { id: "v18", name: "Obsidian Black", type: "color", value: "#0d0d0d", stock: 35 },
      { id: "v19", name: "Rose Gold", type: "color", value: "#b76e79", stock: 30 },
      { id: "v20", name: "Midnight Blue", type: "color", value: "#003366", stock: 30 },
    ],
    colors: ["#0d0d0d", "#b76e79", "#003366"],
    sizes: [],
  },
  {
    id: "prod-10",
    name: "Linen Blend Throw Blanket",
    slug: "linen-blend-throw-blanket",
    description:
      "Add a touch of luxury to any room with our Linen Blend Throw Blanket. Woven from a premium blend of French linen and organic cotton, this throw is soft, breathable, and perfect year-round. The subtle herringbone weave adds texture and sophistication, while the hand-knotted fringe edges provide a refined finish. Pre-washed for immediate softness. Machine washable and gets softer with every wash.",
    shortDescription:
      "French linen and organic cotton blend throw with herringbone weave and hand-knotted fringe.",
    price: 99.99,
    comparePrice: 139.99,
    sku: "TB-LB-010",
    stock: 40,
    images: [gradients[11], gradients[7], gradients[5]],
    featured: false,
    isActive: true,
    tags: ["blanket", "linen", "throw", "home-decor"],
    categoryId: "cat-3",
    category: { id: "cat-3", name: "Home & Garden", slug: "home-garden" },
    brandId: "br-3",
    brand: { id: "br-3", name: "HomeElite", slug: "homeelite" },
    rating: 4.8,
    reviewCount: 145,
    variants: [
      { id: "v21", name: "Natural Oat", type: "color", value: "#d4c5a9", stock: 15 },
      { id: "v22", name: "Dusty Rose", type: "color", value: "#c4a4a7", stock: 15 },
      { id: "v23", name: "Slate Gray", type: "color", value: "#708090", stock: 10 },
    ],
    colors: ["#d4c5a9", "#c4a4a7", "#708090"],
    sizes: [],
  },
  {
    id: "prod-11",
    name: "Tailored Wool Blazer",
    slug: "tailored-wool-blazer",
    description:
      "Make a statement with our Tailored Wool Blazer. Crafted from superfine Italian merino wool with a half-canvas construction for a natural drape. Features peak lapels, functional surgeon cuffs, and a double-vent back for ease of movement. The Bemberg lining ensures breathability and comfort. Each blazer is finished by hand with meticulous attention to detail. A versatile piece that transitions effortlessly from office to evening.",
    shortDescription:
      "Italian merino wool blazer with half-canvas construction, peak lapels, and hand-finished details.",
    price: 349.99,
    comparePrice: 450.0,
    sku: "WB-TW-011",
    stock: 15,
    images: [gradients[10], gradients[3], gradients[8]],
    featured: false,
    isActive: true,
    tags: ["blazer", "wool", "tailored", "fashion"],
    categoryId: "cat-2",
    category: { id: "cat-2", name: "Fashion", slug: "fashion" },
    brandId: "br-2",
    brand: { id: "br-2", name: "StyleHouse", slug: "stylehouse" },
    rating: 4.6,
    reviewCount: 48,
    variants: [
      { id: "v24", name: "Navy", type: "color", value: "#1b2a4a", stock: 5 },
      { id: "v25", name: "Charcoal", type: "color", value: "#36454f", stock: 5 },
      { id: "v26", name: "Burgundy", type: "color", value: "#722f37", stock: 5 },
    ],
    colors: ["#1b2a4a", "#36454f", "#722f37"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "prod-12",
    name: "Yoga Mat Premium Collection",
    slug: "yoga-mat-premium-collection",
    description:
      "Elevate your practice with the Yoga Mat Premium Collection. Our 6mm thick mat is made from sustainable natural tree rubber with a microfiber suede top layer that actually grips better when wet. The alignment guide system helps perfect your poses, while the antimicrobial treatment keeps your mat fresh. Comes with a premium carrying strap and cotton bag. Each mat is free from PVC, latex, and toxic chemicals.",
    shortDescription:
      "6mm natural rubber yoga mat with wet-grip suede surface, alignment guides, and eco-friendly materials.",
    price: 74.99,
    comparePrice: 94.99,
    sku: "YM-PC-012",
    stock: 65,
    images: [gradients[8], gradients[4], gradients[6]],
    featured: false,
    isActive: true,
    tags: ["yoga", "mat", "fitness", "eco-friendly"],
    categoryId: "cat-4",
    category: { id: "cat-4", name: "Sports & Outdoors", slug: "sports-outdoors" },
    brandId: "br-6",
    brand: { id: "br-6", name: "UrbanEdge", slug: "urbanedge" },
    rating: 4.5,
    reviewCount: 203,
    variants: [
      { id: "v27", name: "Forest Green", type: "color", value: "#2d5a27", stock: 25 },
      { id: "v28", name: "Twilight Purple", type: "color", value: "#5b2c6f", stock: 20 },
      { id: "v29", name: "Sunrise Coral", type: "color", value: "#ff6f61", stock: 20 },
    ],
    colors: ["#2d5a27", "#5b2c6f", "#ff6f61"],
    sizes: [],
  },
];

export const sampleReviews: SampleReview[] = [
  {
    id: "rev-1",
    rating: 5,
    title: "Best headphones I have ever owned!",
    comment:
      "The noise cancellation is incredible. I use these on my daily commute and they completely block out the train noise. Sound quality is phenomenal with deep, rich bass and crisp highs. The 30-hour battery life means I only charge them once a week. Highly recommend!",
    images: [],
    userName: "Alex Thompson",
    userAvatar: "",
    createdAt: "2025-12-15",
    verified: true,
  },
  {
    id: "rev-2",
    rating: 4,
    title: "Great quality, slightly tight fit",
    comment:
      "Sound quality and ANC are top-notch. My only minor complaint is that they feel a bit snug on larger heads after a few hours. The ear cushions are super comfortable though, and the build quality feels very premium. Good value for the price.",
    images: [],
    userName: "Sarah Chen",
    userAvatar: "",
    createdAt: "2025-11-28",
    verified: true,
  },
  {
    id: "rev-3",
    rating: 5,
    title: "Perfect for working from home",
    comment:
      "These headphones have been a game-changer for my WFH setup. The microphone quality is excellent for video calls, and the ANC helps me focus in my noisy apartment. The multipoint connection lets me switch between my laptop and phone seamlessly. Worth every penny.",
    images: [],
    userName: "Marcus Rivera",
    userAvatar: "",
    createdAt: "2025-11-20",
    verified: true,
  },
  {
    id: "rev-4",
    rating: 5,
    title: "Exceeded my expectations",
    comment:
      "I was skeptical about spending this much on headphones, but these have completely won me over. The sound stage is wide and natural, the ANC adapts to your environment, and they are incredibly comfortable. The carrying case is a nice premium touch too.",
    images: [],
    userName: "Emily Watson",
    userAvatar: "",
    createdAt: "2025-10-15",
    verified: false,
  },
  {
    id: "rev-5",
    rating: 3,
    title: "Good but not perfect",
    comment:
      "Sound quality is good but not quite audiophile-level. ANC works well for constant noise but struggles with sudden sounds. Battery life is as advertised. For the price, I expected slightly better in some areas, but overall a solid product.",
    images: [],
    userName: "David Kim",
    userAvatar: "",
    createdAt: "2025-10-02",
    verified: true,
  },
  {
    id: "rev-6",
    rating: 4,
    title: "Stylish and functional",
    comment:
      "Love the design and the white color option looks sleek. Audio quality is very good across all genres. Comfortable for long listening sessions. The app could use some improvements for EQ customization, but overall very happy with this purchase.",
    images: [],
    userName: "Jessica Park",
    userAvatar: "",
    createdAt: "2025-09-18",
    verified: true,
  },
  {
    id: "rev-7",
    rating: 5,
    title: "Outstanding product",
    comment:
      "These are the best wireless headphones in this price range, hands down. The build quality is premium, ANC is excellent, and the sound signature is warm and detailed. I have recommended these to all my friends and colleagues.",
    images: [],
    userName: "Michael Brooks",
    userAvatar: "",
    createdAt: "2025-09-05",
    verified: true,
  },
  {
    id: "rev-8",
    rating: 4,
    title: "Almost perfect",
    comment:
      "Very impressed with these headphones. The noise cancellation rivals the big brands at a fraction of the price. Only thing I would improve is adding more cushion to the headband for extra-long sessions. Otherwise, fantastic value.",
    images: [],
    userName: "Lisa Nguyen",
    userAvatar: "",
    createdAt: "2025-08-22",
    verified: false,
  },
];

export function getProductBySlug(slug: string): SampleProduct | undefined {
  return sampleProducts.find((p) => p.slug === slug);
}

export function getRelatedProducts(
  productId: string,
  categoryId: string,
  limit: number = 4
): SampleProduct[] {
  return sampleProducts
    .filter((p) => p.id !== productId && p.categoryId === categoryId)
    .slice(0, limit)
    .concat(
      sampleProducts
        .filter((p) => p.id !== productId && p.categoryId !== categoryId)
        .slice(0, limit)
    )
    .slice(0, limit);
}
