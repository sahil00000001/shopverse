"use client";

import { useState, useMemo, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ProductCard,
  type Product,
} from "@/components/product/product-card";
import {
  sampleProducts,
  sampleCategories,
  sampleBrands,
  type SampleProduct,
} from "@/lib/sample-data";
import { cn } from "@/lib/utils";

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
/*                           Sidebar Filters                                  */
/* -------------------------------------------------------------------------- */

interface FilterState {
  search: string;
  categories: string[];
  brands: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
}

function FiltersPanel({
  filters,
  onFilterChange,
  onClearAll,
}: {
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onClearAll: () => void;
}) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.categories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice !== "" ||
    filters.maxPrice !== "" ||
    filters.minRating > 0;

  const toggleCategory = (slug: string) => {
    const next = filters.categories.includes(slug)
      ? filters.categories.filter((c) => c !== slug)
      : [...filters.categories, slug];
    onFilterChange({ categories: next });
  };

  const toggleBrand = (slug: string) => {
    const next = filters.brands.includes(slug)
      ? filters.brands.filter((b) => b !== slug)
      : [...filters.brands, slug];
    onFilterChange({ brands: next });
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-semibold">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-9"
          />
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Categories</h4>
        <div className="space-y-2.5">
          {sampleCategories.map((cat) => (
            <label
              key={cat.id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.categories.includes(cat.slug)}
                onCheckedChange={() => toggleCategory(cat.slug)}
              />
              <span className="text-sm">{cat.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                ({cat.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="h-9"
            min={0}
          />
          <span className="text-muted-foreground">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="h-9"
            min={0}
          />
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Brands</h4>
        <div className="space-y-2.5">
          {sampleBrands.map((brand) => (
            <label
              key={brand.id}
              className="flex cursor-pointer items-center gap-2.5"
            >
              <Checkbox
                checked={filters.brands.includes(brand.slug)}
                onCheckedChange={() => toggleBrand(brand.slug)}
              />
              <span className="text-sm">{brand.name}</span>
              <span className="ml-auto text-xs text-muted-foreground">
                ({brand.count})
              </span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      {/* Rating */}
      <div>
        <h4 className="mb-3 text-sm font-semibold">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() =>
                onFilterChange({
                  minRating: filters.minRating === rating ? 0 : rating,
                })
              }
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
                filters.minRating === rating && "bg-muted font-medium"
              )}
            >
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "size-3.5",
                      i < rating
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
              <span>& Up</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Clear All */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full"
          onClick={onClearAll}
        >
          <X className="mr-2 size-4" />
          Clear All Filters
        </Button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Inner Page Content                              */
/* -------------------------------------------------------------------------- */

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Read filters from URL
  const filters: FilterState = useMemo(() => {
    const categoryParam = searchParams.get("category");
    const brandParam = searchParams.get("brand");
    return {
      search: searchParams.get("search") ?? "",
      categories: categoryParam ? categoryParam.split(",") : [],
      brands: brandParam ? brandParam.split(",") : [],
      minPrice: searchParams.get("minPrice") ?? "",
      maxPrice: searchParams.get("maxPrice") ?? "",
      minRating: Number(searchParams.get("rating") ?? 0),
    };
  }, [searchParams]);

  const sort = (searchParams.get("sort") as SortOption) ?? "featured";

  // Push filter changes to URL
  const updateFilters = useCallback(
    (updates: Partial<FilterState>) => {
      const next = { ...filters, ...updates };
      const params = new URLSearchParams();
      if (next.search) params.set("search", next.search);
      if (next.categories.length > 0)
        params.set("category", next.categories.join(","));
      if (next.brands.length > 0)
        params.set("brand", next.brands.join(","));
      if (next.minPrice) params.set("minPrice", next.minPrice);
      if (next.maxPrice) params.set("maxPrice", next.maxPrice);
      if (next.minRating > 0) params.set("rating", String(next.minRating));
      if (sort !== "featured") params.set("sort", sort);
      const qs = params.toString();
      router.push(`/products${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [filters, sort, router]
  );

  const updateSort = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "featured") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
      const qs = params.toString();
      router.push(`/products${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [searchParams, router]
  );

  const clearAllFilters = useCallback(() => {
    router.push("/products", { scroll: false });
  }, [router]);

  // Filter + sort products
  const filteredProducts = useMemo(() => {
    let products = sampleProducts.filter((p) => p.isActive);

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (filters.categories.length > 0) {
      products = products.filter((p) =>
        filters.categories.includes(p.category.slug)
      );
    }

    // Brand
    if (filters.brands.length > 0) {
      products = products.filter((p) =>
        filters.brands.includes(p.brand.slug)
      );
    }

    // Price
    const minP = filters.minPrice ? parseFloat(filters.minPrice) : 0;
    const maxP = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;
    products = products.filter((p) => p.price >= minP && p.price <= maxP);

    // Rating
    if (filters.minRating > 0) {
      products = products.filter((p) => p.rating >= filters.minRating);
    }

    // Sort
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
  }, [filters, sort]);

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    filters.categories.length +
    filters.brands.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              All Products
            </h1>
            <p className="mt-2 text-muted-foreground">
              Discover our curated collection of premium products
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">
              <FiltersPanel
                filters={filters}
                onFilterChange={updateFilters}
                onClearAll={clearAllFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Bar */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 lg:hidden"
                    >
                      <SlidersHorizontal className="size-4" />
                      Filters
                      {activeFilterCount > 0 && (
                        <Badge variant="secondary" className="ml-1 size-5 rounded-full p-0 text-[10px]">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                      <SheetDescription className="sr-only">
                        Filter products by category, price, brand, and rating.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="px-4 pb-8">
                      <FiltersPanel
                        filters={filters}
                        onFilterChange={(updates) => {
                          updateFilters(updates);
                        }}
                        onClearAll={() => {
                          clearAllFilters();
                          setMobileFiltersOpen(false);
                        }}
                      />
                    </div>
                  </SheetContent>
                </Sheet>

                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {filteredProducts.length}
                  </span>{" "}
                  products found
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select value={sort} onValueChange={updateSort}>
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

                {/* View Toggle */}
                <div className="hidden items-center rounded-md border sm:flex">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "flex size-9 items-center justify-center transition-colors",
                      viewMode === "grid"
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "flex size-9 items-center justify-center transition-colors",
                      viewMode === "list"
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    aria-label="List view"
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Badges */}
            {activeFilterCount > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Search: {filters.search}
                    <button
                      onClick={() => updateFilters({ search: "" })}
                      className="ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
                {filters.categories.map((slug) => {
                  const cat = sampleCategories.find((c) => c.slug === slug);
                  return (
                    <Badge key={slug} variant="secondary" className="gap-1">
                      {cat?.name ?? slug}
                      <button
                        onClick={() =>
                          updateFilters({
                            categories: filters.categories.filter(
                              (c) => c !== slug
                            ),
                          })
                        }
                        className="ml-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  );
                })}
                {filters.brands.map((slug) => {
                  const brand = sampleBrands.find((b) => b.slug === slug);
                  return (
                    <Badge key={slug} variant="secondary" className="gap-1">
                      {brand?.name ?? slug}
                      <button
                        onClick={() =>
                          updateFilters({
                            brands: filters.brands.filter((b) => b !== slug),
                          })
                        }
                        className="ml-0.5"
                      >
                        <X className="size-3" />
                      </button>
                    </Badge>
                  );
                })}
                {(filters.minPrice || filters.maxPrice) && (
                  <Badge variant="secondary" className="gap-1">
                    Price: ${filters.minPrice || "0"} - $
                    {filters.maxPrice || "..."}
                    <button
                      onClick={() =>
                        updateFilters({ minPrice: "", maxPrice: "" })
                      }
                      className="ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
                {filters.minRating > 0 && (
                  <Badge variant="secondary" className="gap-1">
                    {filters.minRating}+ Stars
                    <button
                      onClick={() => updateFilters({ minRating: 0 })}
                      className="ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <motion.div
                className={cn(
                  "grid gap-3 sm:gap-4",
                  viewMode === "grid"
                    ? "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-2"
                )}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((sp, i) => (
                    <ProductCard
                      key={sp.id}
                      product={toProductCard(sp)}
                      index={i}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted">
                  <Search className="size-7 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  No products found
                </h3>
                <p className="mb-6 max-w-sm text-sm text-muted-foreground">
                  We could not find any products matching your filters. Try
                  adjusting or clearing your filters.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  <X className="mr-2 size-4" />
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Default Export                                 */
/* -------------------------------------------------------------------------- */

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsPageContent />
    </Suspense>
  );
}
