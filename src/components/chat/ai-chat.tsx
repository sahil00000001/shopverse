"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Smile,
  Bot,
  ThumbsUp,
  ThumbsDown,
  Headset,
  Package,
  RotateCcw,
  Truck,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageBubble, type ChatMessage } from "./message-bubble";

interface AiChatProps {
  onEscalateToAgent: () => void;
}

const QUICK_REPLIES = [
  { label: "Track my order", icon: Package, query: "How can I track my order?" },
  { label: "Return policy", icon: RotateCcw, query: "What is your return policy?" },
  { label: "Shipping info", icon: Truck, query: "What shipping options do you offer?" },
  { label: "Product help", icon: HelpCircle, query: "I need help with a product" },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  content:
    "Hi there! I'm ShopVerse's AI Assistant. I can help you with orders, shipping, returns, payments, and more. What can I help you with today?",
  sender: "bot",
  timestamp: new Date(),
};

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AiChat({ onEscalateToAgent }: AiChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<Set<string>>(new Set());
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      const viewport = scrollRef.current.querySelector(
        "[data-slot='scroll-area-viewport']"
      );
      if (viewport) {
        requestAnimationFrame(() => {
          viewport.scrollTop = viewport.scrollHeight;
        });
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowQuickReplies(false);
    setIsLoading(true);

    // Show typing indicator
    const typingMessage: ChatMessage = {
      id: "typing",
      content: "",
      sender: "bot",
      timestamp: new Date(),
      isTyping: true,
    };
    setMessages((prev) => [...prev, typingMessage]);

    try {
      const response = await fetch("/api/chat/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content.trim(),
          conversationHistory: messages
            .filter((m) => !m.isTyping && m.id !== "welcome")
            .map((m) => ({ role: m.sender === "user" ? "user" : "assistant", content: m.content })),
        }),
      });

      const data = await response.json();

      const botMessage: ChatMessage = {
        id: generateId(),
        content: data.message,
        sender: "bot",
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => prev.filter((m) => m.id !== "typing").concat(botMessage));
    } catch {
      const errorMessage: ChatMessage = {
        id: generateId(),
        content:
          "I'm sorry, I encountered an error. Please try again or connect to a live agent for assistance.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => prev.filter((m) => m.id !== "typing").concat(errorMessage));
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleQuickReply = (query: string) => {
    sendMessage(query);
  };

  const handleFeedback = (messageId: string, isPositive: boolean) => {
    setFeedbackGiven((prev) => new Set(prev).add(messageId));
    // In production, send feedback to analytics
    console.log(`Feedback for ${messageId}: ${isPositive ? "positive" : "negative"}`);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <ScrollArea ref={scrollRef} className="flex-1 overflow-hidden">
        <div className="flex flex-col gap-3 py-4">
          {/* AI branding header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-2 flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 px-3 py-2.5"
          >
            <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-sm">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-foreground">AI-Powered Support</p>
              <p className="text-[10px] text-muted-foreground">
                Instant answers, 24/7
              </p>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              Online
            </Badge>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <div key={message.id} className="flex flex-col gap-1">
                <MessageBubble message={message} />

                {/* Feedback buttons for bot messages */}
                {message.sender === "bot" &&
                  !message.isTyping &&
                  message.id !== "welcome" &&
                  !feedbackGiven.has(message.id) && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="ml-11 flex items-center gap-1 px-4"
                    >
                      <span className="mr-1 text-[10px] text-muted-foreground">
                        Helpful?
                      </span>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-emerald-500"
                        onClick={() => handleFeedback(message.id, true)}
                      >
                        <ThumbsUp className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        className="text-muted-foreground hover:text-red-500"
                        onClick={() => handleFeedback(message.id, false)}
                      >
                        <ThumbsDown className="size-3" />
                      </Button>
                    </motion.div>
                  )}

                {/* Feedback confirmed */}
                {message.sender === "bot" &&
                  !message.isTyping &&
                  feedbackGiven.has(message.id) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="ml-11 px-4"
                    >
                      <span className="text-[10px] text-muted-foreground">
                        Thanks for your feedback!
                      </span>
                    </motion.div>
                  )}
              </div>
            ))}
          </AnimatePresence>

          {/* Quick replies */}
          {showQuickReplies && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mx-4 mt-1"
            >
              <p className="mb-2 text-[11px] font-medium text-muted-foreground">
                Quick actions
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {QUICK_REPLIES.map((reply) => (
                  <Button
                    key={reply.label}
                    variant="outline"
                    size="sm"
                    className="h-auto justify-start gap-2 px-2.5 py-2 text-xs font-normal"
                    onClick={() => handleQuickReply(reply.query)}
                    disabled={isLoading}
                  >
                    <reply.icon className="size-3.5 shrink-0 text-muted-foreground" />
                    <span className="truncate">{reply.label}</span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Escalate to agent button */}
      <div className="flex items-center justify-center px-4 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-[11px] text-muted-foreground hover:text-foreground"
          onClick={onEscalateToAgent}
        >
          <Headset className="size-3" />
          Connect to live agent
        </Button>
      </div>

      <Separator />

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground"
        >
          <Smile className="size-4" />
        </Button>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
          className="h-8 rounded-full border-none bg-muted/60 px-3 text-sm shadow-none focus-visible:ring-0"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon-sm"
          disabled={!inputValue.trim() || isLoading}
          className={cn(
            "shrink-0 rounded-full transition-all",
            inputValue.trim()
              ? "bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}
