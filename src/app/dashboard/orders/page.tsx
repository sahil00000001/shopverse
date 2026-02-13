"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Eye,
  ChevronDown,
  ChevronUp,
  PackageSearch,
  ShoppingBag,
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  items: OrderItem[];
}

const statusStyles: Record<OrderStatus, string> = {
  Delivered:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  Shipped:
    "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  Processing:
    "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  Pending:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
  Cancelled:
    "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

const sampleOrders: Order[] = [
  {
    id: "SV-7K3M2N-A1B2",
    date: "Feb 10, 2026",
    status: "Delivered",
    total: 129.99,
    itemCount: 2,
    items: [
      {
        id: "item-1",
        name: "Wireless Noise-Cancelling Headphones",
        image: "/images/products/headphones.jpg",
        quantity: 1,
        price: 89.99,
      },
      {
        id: "item-2",
        name: "USB-C Charging Cable (3-Pack)",
        image: "/images/products/cables.jpg",
        quantity: 1,
        price: 19.99,
      },
    ],
  },
  {
    id: "SV-8L4N3P-C3D4",
    date: "Feb 5, 2026",
    status: "Shipped",
    total: 249.5,
    itemCount: 1,
    items: [
      {
        id: "item-3",
        name: "Mechanical Keyboard - Cherry MX Blue",
        image: "/images/products/keyboard.jpg",
        quantity: 1,
        price: 249.5,
      },
    ],
  },
  {
    id: "SV-9M5P4Q-E5F6",
    date: "Jan 28, 2026",
    status: "Processing",
    total: 89.0,
    itemCount: 3,
    items: [
      {
        id: "item-4",
        name: "Organic Cotton T-Shirt - Navy",
        image: "/images/products/tshirt.jpg",
        quantity: 2,
        price: 29.5,
      },
      {
        id: "item-5",
        name: "Canvas Tote Bag",
        image: "/images/products/tote.jpg",
        quantity: 1,
        price: 30.0,
      },
    ],
  },
  {
    id: "SV-1N6Q5R-G7H8",
    date: "Jan 20, 2026",
    status: "Pending",
    total: 349.99,
    itemCount: 1,
    items: [
      {
        id: "item-6",
        name: 'Ultra-Slim Laptop Stand - Silver 15"',
        image: "/images/products/stand.jpg",
        quantity: 1,
        price: 349.99,
      },
    ],
  },
  {
    id: "SV-2P7R6S-I9J0",
    date: "Jan 15, 2026",
    status: "Cancelled",
    total: 59.99,
    itemCount: 1,
    items: [
      {
        id: "item-7",
        name: "Portable Bluetooth Speaker",
        image: "/images/products/speaker.jpg",
        quantity: 1,
        price: 59.99,
      },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35 },
  },
};

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div variants={itemVariants} layout>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Order Row */}
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-medium">
                  {order.id}
                </p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-xs text-muted-foreground">
                {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  statusStyles[order.status]
                }`}
              >
                {order.status}
              </span>
              <span className="text-sm font-semibold">
                {formatPrice(order.total)}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/orders/${order.id}`}>
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    Details
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Expandable Items */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <Separator />
                <div className="bg-muted/30 p-5">
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-lg bg-background p-3"
                      >
                        <div className="h-14 w-14 shrink-0 rounded-md bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">
                            {item.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
        <PackageSearch className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold">No orders found</h3>
      <p className="mb-6 text-sm text-muted-foreground max-w-sm">
        You don&apos;t have any orders with this status yet. Start shopping to
        see your orders here.
      </p>
      <Button asChild>
        <Link href="/products">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Browse Products
        </Link>
      </Button>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");

  const filteredOrders =
    activeTab === "All"
      ? sampleOrders
      : sampleOrders.filter((order) => order.status === activeTab);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">My Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track and manage all your orders in one place.
        </p>
      </motion.div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full justify-start overflow-x-auto" variant="line">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (tab) => (
              <TabsTrigger key={tab} value={tab} className="text-xs sm:text-sm">
                {tab}
              </TabsTrigger>
            )
          )}
        </TabsList>

        <div className="mt-6">
          {filteredOrders.length === 0 ? (
            <EmptyState />
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={activeTab}
              className="space-y-4"
            >
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </motion.div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
