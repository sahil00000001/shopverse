"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProductCard,
  type Product,
} from "@/components/product/product-card";
import {
  sampleProducts,
  sampleCategories,
  type SampleProduct,
} from "@/lib/sample-data";

/* -------------------------------------------------------------------------- */
/*                        Map SampleProduct -> Product                        */
/* -------------------------------------------------------------------------- */

const productEmojis: Record<string, string> = {
  "prod-1": "\uD83C\uDFA7",
  "prod-2": "\uD83D\uDCBB",
  "prod-3": "\uD83E\uDDE5",
  "prod-4": "\uD83D\uDCF7",
  "prod-5": "\uD83C\uDFFA",
  "prod-6": "\uD83D\uDC5F",
  "prod-7": "\u2728",
  "prod-8": "\uD83C\uDF92",
  "prod-9": "\u231A",
  "prod-10": "\uD83D\uDECB\uFE0F",
  "prod-11": "\uD83E\uDDE5",
  "prod-12": "\uD83E\uDDD8",
};

const productGradients: Record<string, string> = {
  "prod-1": "bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-fuchsia-500/20",
  "prod-2": "bg-gradient-to-br from-slate-500/20 via-gray-500/10 to-zinc-500/20",
  "prod-3": "bg-gradient-to-br from-pink-500/20 via-rose-500/10 to-red-500/20",
  "prod-4": "bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-teal-500/20",
  "prod-5": "bg-gradient-to-br from-orange-500/20 via-amber-500/10 to-yellow-500/20",
  "prod-6": "bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-teal-500/20",
  "prod-7": "bg-gradient-to-br from-purple-500/20 via-violet-500/10 to-fuchsia-500/20",
  "prod-8": "bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-yellow-500/20",
  "prod-9": "bg-gradient-to-br from-indigo-500/20 via-blue-500/10 to-sky-500/20",
  "prod-10": "bg-gradient-to-br from-rose-500/20 via-pink-500/10 to-fuchsia-500/20",
  "prod-11": "bg-gradient-to-br from-slate-500/20 via-zinc-500/10 to-gray-500/20",
  "prod-12": "bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-teal-500/20",
};

function toProductCard(sp: SampleProduct): Product {
  return {
    id: sp.id,
    name: sp.name,
    slug: sp.slug,
    price: sp.price,
    comparePrice: sp.comparePrice ?? undefined,
    image: sp.images[0] ?? "",
    category: sp.category.name,
    rating: sp.rating,
    reviewCount: sp.reviewCount,
    badge: sp.comparePrice ? "sale" : sp.featured ? "new" : undefined,
    emoji: productEmojis[sp.id] ?? "\uD83D\uDED2",
    gradient: productGradients[sp.id] ?? "bg-gradient-to-br from-gray-500/20 to-gray-500/10",
  };
}

/* -------------------------------------------------------------------------- */
/*                            Category gradients                              */
/* -------------------------------------------------------------------------- */

const categoryGradients: Record<string, string> = {
  electronics: "from-blue-600 via-cyan-500 to-teal-400",
  fashion: "from-pink-600 via-rose-500 to-fuchsia-400",
  "home-garden": "from-green-600 via-emerald-500 to-teal-400",
  "sports-outdoors": "from-orange-600 via-amber-500 to-yellow-400",
  "beauty-health": "from-purple-600 via-violet-500 to-fuchsia-400",
};

const categoryDescriptions: Record<string, string> = {
  electronics:
    "Discover the latest gadgets, smart devices, and cutting-edge technology to power your digital lifestyle.",
  fashion:
    "Explore premium clothing, accessories, and footwear crafted with style and quality in mind.",
  "home-garden":
    "Transform your living space with beautifully designed home decor and garden essentials.",
  "sports-outdoors":
    "Gear up for adventure with high-performance sports equipment and outdoor essentials.",
  "beauty-health":
    "Pamper yourself with organic skincare, wellness products, and beauty essentials.",
};

const categoryEmojis: Record<string, string> = {
  electronics: "\uD83D\uDD0C",
  fashion: "\uD83D\uDC57",
  "home-garden": "\uD83C\uDFE1",
  "sports-outdoors": "\u26BD",
  "beauty-health": "\u2728",
};

/* -------------------------------------------------------------------------- */
/*                              Sort Options                                  */
/* -------------------------------------------------------------------------- */

type SortOption = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Best Rating" },
];

/* -------------------------------------------------------------------------- */
/*                              Page Component                                */
/* -------------------------------------------------------------------------- */

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [sort, setSort] = useState<SortOption>("featured");

  const category = sampleCategories.find((c) => c.slug === slug);

  const categoryProducts = useMemo(() => {
    if (!category) return [];
    let products = sampleProducts.filter(
      (p) => p.categoryId === category.id && p.isActive
    );

    const sorted = [...products];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.reverse();
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "featured":
      default:
        sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return sorted;
  }, [category, sort]);

  if (!category) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-4 flex justify-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted">
              <Package className="size-7 text-muted-foreground" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold">Category Not Found</h1>
          <p className="mb-6 text-muted-foreground">
            The category you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const gradient = categoryGradients[slug] ?? "from-gray-600 to-gray-400";
  const description =
    categoryDescriptions[slug] ??
    `Browse all products in the ${category.name} category.`;
  const emoji = categoryEmojis[slug] ?? "\uD83D\uDED2";

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10`}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 -top-20 size-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 size-64 rounded-full bg-primary/5 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 py-12 lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="mb-4 block text-5xl">{emoji}</span>
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {category.name}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </motion.div>
        </div>
      </section>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-6 flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {categoryProducts.length}
            </span>{" "}
            {categoryProducts.length === 1 ? "product" : "products"} in{" "}
            {category.name}
          </p>
          <Select
            value={sort}
            onValueChange={(val) => setSort(val as SortOption)}
          >
            <SelectTrigger size="sm" className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Product Grid */}
        {categoryProducts.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05 } },
            }}
          >
            {categoryProducts.map((sp, i) => (
              <ProductCard
                key={sp.id}
                product={toProductCard(sp)}
                index={i}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
              <Package className="size-7 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">
              No products in this category yet
            </h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              We are working on adding products to this category. Check back
              soon or browse our other categories.
            </p>
            <Button asChild>
              <Link href="/products">Browse All Products</Link>
            </Button>
          </motion.div>
        )}

        {/* Browse All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" className="gap-2" asChild>
            <Link href="/products">
              Browse All Products
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
