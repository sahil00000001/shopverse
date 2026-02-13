"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  Menu,
  Phone,
  Mail,
  ChevronDown,
  LogIn,
  UserPlus,
  Package,
  Settings,
  LogOut,
  Truck,
  Command,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { cn } from "@/lib/utils";

const categories = [
  { name: "All", href: "/products" },
  { name: "Electronics", href: "/products?category=electronics" },
  { name: "Fashion", href: "/products?category=fashion" },
  { name: "Home & Garden", href: "/products?category=home-garden" },
  { name: "Sports", href: "/products?category=sports" },
  { name: "Beauty", href: "/products?category=beauty" },
  { name: "Books", href: "/products?category=books" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/80 shadow-md backdrop-blur-xl"
          : "bg-background"
      )}
    >
      {/* Top Bar */}
      <div className="border-b border-border/50 bg-primary text-primary-foreground">
        <div className="container mx-auto flex h-9 items-center justify-between px-4 text-xs">
          <div className="hidden items-center gap-4 sm:flex">
            <div className="flex items-center gap-1.5">
              <Phone className="size-3" />
              <span>+1 (555) 123-4567</span>
            </div>
            <Separator orientation="vertical" className="h-3.5 bg-primary-foreground/30" />
            <div className="flex items-center gap-1.5">
              <Mail className="size-3" />
              <span>support@shopverse.com</span>
            </div>
          </div>
          <div className="flex w-full items-center justify-center sm:w-auto">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5"
            >
              <Truck className="size-3.5" />
              <span className="font-medium">
                Free shipping on orders over $50
              </span>
            </motion.div>
          </div>
          <div className="hidden items-center gap-3 sm:flex">
            <Link href="/track-order" className="transition-colors hover:text-primary-foreground/80">
              Track Order
            </Link>
            <Separator orientation="vertical" className="h-3.5 bg-primary-foreground/30" />
            <Link href="/help" className="transition-colors hover:text-primary-foreground/80">
              Help Center
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4 lg:gap-8">
          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">
                  <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold text-transparent">
                    ShopVerse
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-4 flex flex-col gap-1 px-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9"
                  />
                </div>
                <Separator className="mb-2" />
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categories
                </p>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={category.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {category.name}
                  </Link>
                ))}
                <Separator className="my-2" />
                <Link
                  href="/auth/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <LogIn className="size-4" />
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
                >
                  <UserPlus className="size-4" />
                  Create Account
                </Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <motion.span
              className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-xl font-bold tracking-tight text-transparent lg:text-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              ShopVerse
            </motion.span>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden max-w-xl flex-1 lg:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search for products, brands, and more..."
                className="h-10 pl-10 pr-20"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <kbd className="pointer-events-none flex h-6 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  <Command className="size-2.5" />K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Theme Toggle */}
            {mounted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setTheme(theme === "dark" ? "light" : "dark")
                  }
                  className="size-9"
                  aria-label="Toggle theme"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {theme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="size-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: -90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className="size-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </motion.div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9"
                aria-label="Wishlist"
              >
                <Heart className="size-4" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center p-0 text-[10px]">
                    {wishlistItems.length}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative size-9"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="size-4" />
                {cartItemCount > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15,
                    }}
                  >
                    <Badge className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center p-0 text-[10px]">
                      {cartItemCount}
                    </Badge>
                  </motion.div>
                )}
              </Button>
            </Link>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9"
                  aria-label="User menu"
                >
                  <Avatar className="size-7">
                    <AvatarFallback className="bg-primary/10 text-xs text-primary">
                      <User className="size-3.5" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Welcome</p>
                    <p className="text-xs text-muted-foreground">
                      Sign in to access your account
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/login" className="cursor-pointer">
                      <LogIn className="mr-2 size-4" />
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/auth/register" className="cursor-pointer">
                      <UserPlus className="mr-2 size-4" />
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="cursor-pointer">
                      <Package className="mr-2 size-4" />
                      Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist" className="cursor-pointer">
                      <Heart className="mr-2 size-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop */}
      <nav className="hidden border-t border-border/50 lg:block">
        <div className="container mx-auto px-4">
          <div className="flex h-11 items-center gap-1">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="relative rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                {category.name}
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-1 text-sm">
              <Link
                href="/deals"
                className="flex items-center gap-1 rounded-md px-3 py-1.5 font-medium text-red-500 transition-colors hover:bg-red-500/10 dark:text-red-400"
              >
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-red-500" />
                </span>
                Flash Deals
              </Link>
              <Separator orientation="vertical" className="mx-1 h-4" />
              <Link
                href="/new-arrivals"
                className="rounded-md px-3 py-1.5 font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
