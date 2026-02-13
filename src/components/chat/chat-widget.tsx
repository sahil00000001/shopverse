"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Bot,
  Headphones,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AiChat } from "./ai-chat";
import { LiveChat } from "./live-chat";

type ChatMode = "select" | "ai" | "live";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("select");

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBack = () => {
    setMode("select");
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      setMode("select");
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
            style={{ transformOrigin: "bottom right" }}
            className="flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl border border-white/20 bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-xl dark:border-gray-700/50 dark:bg-gray-900/90"
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between border-b border-gray-200/60 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 px-4 py-3 dark:border-gray-700/60">
              <div className="flex items-center gap-3">
                {mode !== "select" && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0 text-muted-foreground hover:text-foreground"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="size-4" />
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <div className="relative flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
                    <Sparkles className="size-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      ShopVerse Support
                    </h3>
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Online
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={handleClose}
              >
                <X className="size-4" />
              </Button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                {mode === "select" && (
                  <motion.div
                    key="select"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-full flex-col items-center justify-center gap-6 px-6"
                  >
                    <div className="text-center">
                      <h4 className="text-base font-semibold text-foreground">
                        How can we help?
                      </h4>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Choose how you&apos;d like to connect with us
                      </p>
                    </div>

                    <div className="grid w-full grid-cols-2 gap-3">
                      {/* AI Assistant Card */}
                      <button
                        onClick={() => setMode("ai")}
                        className={cn(
                          "group flex flex-col items-center gap-3 rounded-xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/80 p-5 text-center transition-all hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/10",
                          "dark:border-gray-700/80 dark:from-gray-800/80 dark:to-gray-900/80 dark:hover:border-indigo-600/50"
                        )}
                      >
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 transition-transform group-hover:scale-110">
                          <Bot className="size-7 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            AI Assistant
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Instant answers 24/7
                          </p>
                        </div>
                      </button>

                      {/* Live Support Card */}
                      <button
                        onClick={() => setMode("live")}
                        className={cn(
                          "group flex flex-col items-center gap-3 rounded-xl border border-gray-200/80 bg-gradient-to-b from-white to-gray-50/80 p-5 text-center transition-all hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10",
                          "dark:border-gray-700/80 dark:from-gray-800/80 dark:to-gray-900/80 dark:hover:border-emerald-600/50"
                        )}
                      >
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 transition-transform group-hover:scale-110">
                          <Headphones className="size-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            Live Support
                          </p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            Talk to a real agent
                          </p>
                        </div>
                      </button>
                    </div>

                    <p className="text-[10px] text-muted-foreground/70">
                      Average response time: under 2 minutes
                    </p>
                  </motion.div>
                )}

                {mode === "ai" && (
                  <motion.div
                    key="ai"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <AiChat onEscalateToAgent={() => setMode("live")} />
                  </motion.div>
                )}

                {mode === "live" && (
                  <motion.div
                    key="live"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <LiveChat />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="group relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-xl hover:shadow-indigo-500/40 active:scale-95"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {/* Pulsing ring */}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full">
            <span className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-20" />
            <span
              className="absolute inset-0 animate-pulse rounded-full bg-indigo-400 opacity-10"
              style={{ animationDelay: "0.5s" }}
            />
          </span>
        )}

        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="size-6" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="size-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
