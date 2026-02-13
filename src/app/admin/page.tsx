"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  MoreHorizontal,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

// Sample data
const stats = [
  {
    title: "Total Revenue",
    value: "$48,574",
    change: "+12.5%",
    changeType: "positive" as const,
    description: "from last month",
    icon: DollarSign,
    color: "bg-blue-500",
  },
  {
    title: "Total Orders",
    value: "1,247",
    change: "+8.2%",
    changeType: "positive" as const,
    description: "from last month",
    icon: ShoppingCart,
    color: "bg-emerald-500",
  },
  {
    title: "Total Customers",
    value: "3,891",
    change: "+15.3%",
    changeType: "positive" as const,
    description: "from last month",
    icon: Users,
    color: "bg-violet-500",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+2.1%",
    changeType: "positive" as const,
    description: "from last month",
    icon: TrendingUp,
    color: "bg-amber-500",
  },
];

const revenueData = [
  { month: "Mar", revenue: 28500 },
  { month: "Apr", revenue: 31200 },
  { month: "May", revenue: 29800 },
  { month: "Jun", revenue: 34500 },
  { month: "Jul", revenue: 32100 },
  { month: "Aug", revenue: 38700 },
  { month: "Sep", revenue: 36400 },
  { month: "Oct", revenue: 41200 },
  { month: "Nov", revenue: 39800 },
  { month: "Dec", revenue: 52300 },
  { month: "Jan", revenue: 45600 },
  { month: "Feb", revenue: 48574 },
];

const recentOrders = [
  { id: "SV-2847", customer: "John Doe", status: "Delivered", total: 127.0, date: "Feb 12, 2026" },
  { id: "SV-2846", customer: "Sarah Miller", status: "Shipped", total: 254.5, date: "Feb 12, 2026" },
  { id: "SV-2845", customer: "Mike Johnson", status: "Processing", total: 89.99, date: "Feb 11, 2026" },
  { id: "SV-2844", customer: "Emily Chen", status: "Pending", total: 342.0, date: "Feb 11, 2026" },
  { id: "SV-2843", customer: "Alex Rivera", status: "Delivered", total: 178.5, date: "Feb 10, 2026" },
  { id: "SV-2842", customer: "Lisa Park", status: "Shipped", total: 65.0, date: "Feb 10, 2026" },
  { id: "SV-2841", customer: "David Kim", status: "Cancelled", total: 199.99, date: "Feb 9, 2026" },
  { id: "SV-2840", customer: "Nina Patel", status: "Delivered", total: 430.0, date: "Feb 9, 2026" },
];

const topProducts = [
  { name: "Wireless Headphones Pro", sales: 245, revenue: 24255, color: "bg-blue-100 text-blue-700" },
  { name: "Smart Watch Ultra", sales: 189, revenue: 37611, color: "bg-emerald-100 text-emerald-700" },
  { name: "Laptop Stand Ergonomic", sales: 167, revenue: 8350, color: "bg-violet-100 text-violet-700" },
  { name: "USB-C Hub Multiport", sales: 143, revenue: 7150, color: "bg-amber-100 text-amber-700" },
  { name: "Mechanical Keyboard RGB", sales: 128, revenue: 16640, color: "bg-rose-100 text-rose-700" },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#3b82f6" },
  { name: "Clothing", value: 25, color: "#10b981" },
  { name: "Accessories", value: 20, color: "#8b5cf6" },
  { name: "Home & Garden", value: 12, color: "#f59e0b" },
  { name: "Sports", value: 8, color: "#ef4444" },
];

const statusStyles: Record<string, string> = {
  Delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Shipped: "bg-blue-50 text-blue-700 border-blue-200",
  Processing: "bg-amber-50 text-amber-700 border-amber-200",
  Pending: "bg-slate-50 text-slate-700 border-slate-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminDashboard() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, Admin
        </h1>
        <p className="text-sm text-slate-500 mt-1">{today}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.changeType === "positive";
          return (
            <motion.div key={stat.title} variants={itemVariants}>
              <Card className="relative overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-500">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        {stat.value}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-0.5 text-xs font-semibold",
                            isPositive ? "text-emerald-600" : "text-red-600"
                          )}
                        >
                          {isPositive ? (
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          ) : (
                            <ArrowDownRight className="h-3.5 w-3.5" />
                          )}
                          {stat.change}
                        </span>
                        <span className="text-xs text-slate-400">
                          {stat.description}
                        </span>
                      </div>
                    </div>
                    <div
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-lg",
                        stat.color
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Revenue Overview</CardTitle>
                <CardDescription>Monthly revenue for the last 12 months</CardDescription>
              </div>
              <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                    formatter={(value) => [formatPrice(value || 0), "Revenue"]}
                    labelStyle={{ color: "#94a3b8" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two Column: Recent Orders + Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Recent Orders</CardTitle>
                  <CardDescription>Latest 8 orders from your store</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead className="text-right">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium text-blue-600">
                        #{order.id}
                      </TableCell>
                      <TableCell>{order.customer}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn("text-xs", statusStyles[order.status])}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatPrice(order.total)}
                      </TableCell>
                      <TableCell className="text-right text-slate-500 text-sm">
                        {order.date}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>

        {/* Top Products */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Top Products</CardTitle>
              <CardDescription>Best performing products this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-center gap-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                      <Package className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {product.sales} sold
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">
                        {formatPrice(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Sales by Category */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sales by Category</CardTitle>
            <CardDescription>Distribution of sales across product categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "none",
                      borderRadius: "8px",
                      color: "#fff",
                      fontSize: "13px",
                    }}
                    formatter={(value: number) => [`${value}%`, "Share"]}
                  />
                  <Legend
                    verticalAlign="middle"
                    align="right"
                    layout="vertical"
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-sm text-slate-600 ml-1">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
