"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useSpring, useMotionValue } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Leaf,
  Lightbulb,
  ArrowRight,
  ShoppingBag,
  Package,
  Award,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const stats = [
  { label: "Products", value: 10000, suffix: "+", icon: Package },
  { label: "Customers", value: 50000, suffix: "+", icon: Users },
  { label: "Brands", value: 100, suffix: "+", icon: Award },
  { label: "Rating", value: 4.8, suffix: "", icon: Star, isDecimal: true },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Quality First",
    description:
      "We carefully curate every product in our catalog, ensuring only the highest quality items reach our customers. Every brand and product undergoes rigorous vetting.",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-950",
  },
  {
    icon: Users,
    title: "Customer Focus",
    description:
      "Our customers are at the heart of everything we do. From personalized recommendations to responsive support, your satisfaction is our top priority.",
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-950",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "We are committed to reducing our environmental footprint. From eco-friendly packaging to partnering with sustainable brands, we are building a greener future.",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-950",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We leverage cutting-edge technology to create a seamless shopping experience. From AI-powered search to real-time order tracking, innovation drives us forward.",
    color: "text-amber-600",
    bg: "bg-amber-100 dark:bg-amber-950",
  },
];

const team = [
  {
    name: "Sarah Chen",
    role: "CEO & Co-Founder",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    name: "Marcus Johnson",
    role: "CTO",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Emily Rodriguez",
    role: "Head of Design",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    name: "David Kim",
    role: "VP of Operations",
    gradient: "from-amber-500 to-orange-500",
  },
];

function AnimatedCounter({
  value,
  suffix,
  isDecimal = false,
}: {
  value: number;
  suffix: string;
  isDecimal?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInViewport = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    if (!isInViewport) return;

    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;

      if (isDecimal) {
        setDisplayValue(current.toFixed(1));
      } else {
        const formatted =
          current >= 1000
            ? `${(current / 1000).toFixed(current >= 10000 ? 0 : 1)}K`
            : Math.floor(current).toString();
        setDisplayValue(formatted);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (isDecimal) {
          setDisplayValue(value.toFixed(1));
        } else {
          const formatted =
            value >= 1000
              ? `${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}K`
              : value.toString();
          setDisplayValue(formatted);
        }
      }
    };

    requestAnimationFrame(animate);
  }, [isInViewport, value, isDecimal]);

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-primary/80"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTJ2LTZoMnptMC0xMHY2aC0ydi02aDJ6bTAtMTB2NmgtMlY0aDJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="flex flex-col items-center gap-6 text-center text-primary-foreground">
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl"
            >
              About ShopVerse
            </motion.h1>
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl text-lg text-primary-foreground/80"
            >
              We are on a mission to make online shopping delightful, accessible,
              and sustainable for everyone.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Our Story */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Story
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
            <p>
              ShopVerse was born in 2020 from a simple idea: what if online
              shopping could feel as personal and curated as visiting your
              favorite boutique? Our founders, seasoned technologists and retail
              veterans, saw an opportunity to bridge the gap between convenience
              and quality.
            </p>
            <p>
              Starting with just a handful of carefully selected brands, we have
              grown into a thriving marketplace that serves customers worldwide.
              Every product in our catalog is hand-picked by our team of experts
              who evaluate quality, value, and sustainability before it reaches
              our shelves.
            </p>
            <p>
              Today, ShopVerse is more than just a store -- it is a community of
              passionate shoppers, innovative brands, and dedicated team members
              who believe that everyone deserves access to exceptional products
              at fair prices.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-7 w-7 text-primary" />
                </div>
                <div className="text-4xl font-extrabold tracking-tight">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isDecimal={stat.isDecimal}
                  />
                </div>
                <p className="mt-1 text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Our Values
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            The principles that guide everything we do at ShopVerse.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {values.map((value) => (
            <motion.div
              key={value.title}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
            >
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <div
                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${value.bg}`}
                  >
                    <value.icon className={`h-7 w-7 ${value.color}`} />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{value.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
              The passionate people behind ShopVerse who work every day to
              deliver an exceptional experience.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
                <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                  <CardContent className="p-0">
                    <div
                      className={`flex h-48 items-center justify-center bg-gradient-to-br ${member.gradient}`}
                    >
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-bold text-white backdrop-blur-sm">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="text-base font-semibold">{member.name}</h3>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {member.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-8 text-center text-primary-foreground sm:p-14"
        >
          <ShoppingBag className="mx-auto mb-4 h-12 w-12" />
          <h2 className="text-3xl font-bold sm:text-4xl">
            Start Shopping Today
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Join thousands of happy customers and discover why ShopVerse is the
            preferred destination for quality products.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            asChild
          >
            <Link href="/products">
              Browse Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
