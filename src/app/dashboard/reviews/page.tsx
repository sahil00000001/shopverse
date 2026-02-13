"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Pencil,
  Trash2,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface UserReview {
  id: string;
  productName: string;
  productSlug: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
}

const initialReviews: UserReview[] = [
  {
    id: "ur-1",
    productName: "Wireless Noise-Cancelling Headphones",
    productSlug: "wireless-noise-cancelling-headphones",
    rating: 5,
    title: "Best headphones I have ever owned!",
    comment:
      "The noise cancellation is incredible. I use these on my daily commute and they completely block out the train noise. Sound quality is phenomenal with deep, rich bass and crisp highs. The 30-hour battery life means I only charge them once a week.",
    date: "Jan 15, 2026",
  },
  {
    id: "ur-2",
    productName: "Premium Cashmere Sweater",
    productSlug: "premium-cashmere-sweater",
    rating: 4,
    title: "Incredibly soft and warm",
    comment:
      "The cashmere quality is outstanding. It is super soft and lightweight while still providing great warmth. The fit runs slightly large, so I would recommend sizing down. The color is exactly as shown in the photos. Great value for Grade-A cashmere.",
    date: "Dec 28, 2025",
  },
  {
    id: "ur-3",
    productName: "Performance Running Shoes",
    productSlug: "performance-running-shoes",
    rating: 5,
    title: "Perfect for marathon training",
    comment:
      "These shoes are a game-changer for my marathon training. The carbon-fiber plate gives incredible energy return, and the Flyknit upper feels like a second skin. I have run over 200 miles in them and they still feel great. Highly recommended for serious runners.",
    date: "Nov 10, 2025",
  },
];

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
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<UserReview[]>(initialReviews);

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success("Review deleted successfully.");
  };

  const handleEdit = (review: UserReview) => {
    toast.info("Edit review", {
      description: `Editing review for "${review.productName}" is not available in the demo.`,
    });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight">My Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {reviews.length === 0
            ? "You haven't written any reviews yet."
            : `You have written ${reviews.length} review${reviews.length !== 1 ? "s" : ""}.`}
        </p>
      </motion.div>

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <motion.div variants={itemVariants} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="overflow-hidden transition-shadow hover:shadow-md">
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4">
                      {/* Top Row: Product Name & Actions */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1.5">
                          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            Product
                          </p>
                          <h3 className="text-sm font-semibold leading-snug">
                            {review.productName}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(review)}
                          >
                            <Pencil className="mr-1 h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="mr-1 h-3.5 w-3.5" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Delete Review
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this review?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  variant="destructive"
                                  onClick={() => handleDelete(review.id)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* Rating & Date */}
                      <div className="flex items-center gap-3">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-muted-foreground">
                          {review.date}
                        </span>
                      </div>

                      {/* Review Content */}
                      <div className="space-y-1.5">
                        <h4 className="text-sm font-semibold">{review.title}</h4>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <MessageSquare className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="mb-2 text-lg font-semibold">No reviews yet</h3>
          <p className="mb-6 max-w-sm text-sm text-muted-foreground">
            You haven&apos;t written any reviews yet. Share your experience with
            products you&apos;ve purchased to help other shoppers.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
