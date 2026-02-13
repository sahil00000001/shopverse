"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Ticket,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  Bell,
  LogOut,
  User,
  Moon,
  Sun,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Coupons",
    href: "/admin/coupons",
    icon: Ticket,
  },
  {
    label: "Chat Support",
    href: "/admin/chat",
    icon: MessageSquare,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-white/10 text-white shadow-sm"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            )}
          >
            <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-blue-400")} />
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="truncate"
              >
                {item.label}
              </motion.span>
            )}
            {isActive && !collapsed && (
              <motion.div
                layoutId="sidebar-active-indicator"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 72 : 260 }}
        transition={{ duration: 0.3 }}
        className="hidden md:flex flex-col bg-slate-900 border-r border-slate-800 relative z-30"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-sm">
            SV
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-lg font-bold text-white tracking-tight">
                ShopVerse
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                Admin Panel
              </p>
            </motion.div>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex-1 overflow-y-auto py-4">
          <SidebarNav collapsed={collapsed} />
        </div>

        {/* Collapse Toggle */}
        <Separator className="bg-slate-800" />
        <div className="p-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-slate-400 hover:text-white hover:bg-white/5"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>

        {/* User Section */}
        <Separator className="bg-slate-800" />
        <div className="p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2",
              collapsed && "justify-center px-0"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src="/admin-avatar.png" />
              <AvatarFallback className="bg-blue-600 text-white text-xs">
                AD
              </AvatarFallback>
            </Avatar>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">
                  Admin User
                </p>
                <p className="text-xs text-slate-500 truncate">
                  admin@shopverse.com
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 bg-slate-900 border-slate-800 p-0">
          <SheetHeader className="px-4 pt-4 pb-0">
            <SheetTitle className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white text-sm">
                SV
              </div>
              <div>
                <span className="text-lg font-bold text-white">ShopVerse</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">
                  Admin Panel
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>
          <div className="py-4">
            <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </div>
          <Separator className="bg-slate-800" />
          <div className="p-3">
            <div className="flex items-center gap-3 rounded-lg px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  AD
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-white">Admin User</p>
                <p className="text-xs text-slate-500">admin@shopverse.com</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center gap-4 border-b bg-white px-4 md:px-6 shrink-0">
          {/* Mobile Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search products, orders, customers..."
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-blue-500/20"
            />
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5 text-slate-600" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-[10px] bg-red-500 text-white border-2 border-white">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">New order received</p>
                    <p className="text-xs text-muted-foreground">
                      Order #SV-2847 from John Doe - $127.00
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">Low stock alert</p>
                    <p className="text-xs text-muted-foreground">
                      &quot;Wireless Headphones&quot; has only 3 items left
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">New review posted</p>
                    <p className="text-xs text-muted-foreground">
                      5-star review on &quot;Smart Watch Pro&quot;
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Separator orientation="vertical" className="h-8" />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-600 text-white text-xs">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">
                    Admin
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>Admin User</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      admin@shopverse.com
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
