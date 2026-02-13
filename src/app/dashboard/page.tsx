"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Heart,
  Star,
  CalendarDays,
  ArrowRight,
  Eye,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const stats = [
  {
    label: "Total Orders",
    value: "24",
    icon: Package,
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-950",
  },
  {
    label: "Wishlist Items",
    value: "12",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-100 dark:bg-rose-950",
  },
  {
    label: "Reviews Written",
    value: "8",
    icon: Star,
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-950",
  },
  {
    label: "Member Since",
    value: "Jan 2024",
    icon: CalendarDays,
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-950",
  },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Shipped: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Processing: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Pending: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

const recentOrders = [
  {
    id: "SV-7K3M2N-A1B2",
    date: "Feb 10, 2026",
    status: "Delivered",
    total: 129.99,
  },
  {
    id: "SV-8L4N3P-C3D4",
    date: "Feb 5, 2026",
    status: "Shipped",
    total: 249.5,
  },
  {
    id: "SV-9M5P4Q-E5F6",
    date: "Jan 28, 2026",
    status: "Processing",
    total: 89.0,
  },
  {
    id: "SV-1N6Q5R-G7H8",
    date: "Jan 20, 2026",
    status: "Delivered",
    total: 349.99,
  },
  {
    id: "SV-2P7R6S-I9J0",
    date: "Jan 15, 2026",
    status: "Cancelled",
    total: 59.99,
  },
];

const quickActions = [
  {
    label: "Browse Products",
    href: "/products",
    icon: ShoppingBag,
    description: "Discover new arrivals",
  },
  {
    label: "View Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
    description: "Items you saved",
  },
  {
    label: "Track Order",
    href: "/dashboard/orders",
    icon: Truck,
    description: "Check delivery status",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

export default function DashboardOverviewPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Hello, Alex!</h1>
        <p className="mt-1 text-muted-foreground">
          Welcome back to your ShopVerse dashboard. Here&apos;s what&apos;s happening.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <Card className="relative overflow-hidden">
              <CardContent className="flex items-center gap-4">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.bg}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Recent Orders */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Your latest 5 orders</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/orders">
                  View All
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-medium font-mono text-xs">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {order.date}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            statusStyles[order.status]
                          }`}
                        >
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/orders/${order.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickActions.map((action) => (
            <motion.div
              key={action.label}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={action.href}>
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
