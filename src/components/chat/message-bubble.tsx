"use client";

import { motion } from "framer-motion";
import { Bot, User, Headset } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot" | "agent";
  timestamp: Date;
  isTyping?: boolean;
  avatar?: string;
  senderName?: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block size-1.5 rounded-full bg-muted-foreground/60"
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function formatMessageContent(content: string) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }

    const lines = part.split("\n");
    return lines.map((line, lineIndex) => {
      const bulletMatch = line.match(/^[-•]\s(.+)/);
      if (bulletMatch) {
        return (
          <span key={`${index}-${lineIndex}`} className="flex items-start gap-1.5">
            <span className="mt-1 block size-1 shrink-0 rounded-full bg-current opacity-60" />
            <span>{bulletMatch[1]}</span>
          </span>
        );
      }

      const numberedMatch = line.match(/^(\d+)\.\s(.+)/);
      if (numberedMatch) {
        return (
          <span key={`${index}-${lineIndex}`} className="flex items-start gap-1.5">
            <span className="shrink-0 font-medium opacity-70">{numberedMatch[1]}.</span>
            <span>{numberedMatch[2]}</span>
          </span>
        );
      }

      if (lineIndex > 0 && line === "") {
        return <span key={`${index}-${lineIndex}`} className="block h-2" />;
      }

      return (
        <span key={`${index}-${lineIndex}`}>
          {lineIndex > 0 && line !== "" && <br />}
          {line}
        </span>
      );
    });
  });
}

function formatTimestamp(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === "user";
  const isBot = message.sender === "bot";

  const senderIcon = isBot ? (
    <Bot className="size-3.5" />
  ) : message.sender === "agent" ? (
    <Headset className="size-3.5" />
  ) : (
    <User className="size-3.5" />
  );

  const senderLabel = isBot
    ? "AI Assistant"
    : message.sender === "agent"
      ? message.senderName || "Support Agent"
      : "You";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={cn(
        "flex gap-2.5 px-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <Avatar size="sm" className="mt-0.5 shrink-0 ring-2 ring-background">
          {message.avatar ? (
            <AvatarImage src={message.avatar} alt={senderLabel} />
          ) : null}
          <AvatarFallback
            className={cn(
              "text-white",
              isBot
                ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                : "bg-gradient-to-br from-emerald-500 to-teal-600"
            )}
          >
            {senderIcon}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message content */}
      <div
        className={cn(
          "flex max-w-[78%] flex-col gap-0.5",
          isUser ? "items-end" : "items-start"
        )}
      >
        {!isUser && (
          <span className="px-1 text-[10px] font-medium text-muted-foreground">
            {senderLabel}
          </span>
        )}

        <div
          className={cn(
            "rounded-2xl px-3.5 py-2 text-sm leading-relaxed",
            isUser
              ? "rounded-br-md bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md shadow-indigo-500/20"
              : "rounded-bl-md bg-muted/80 text-foreground shadow-sm",
            message.isTyping && "bg-muted/60"
          )}
        >
          {message.isTyping ? (
            <TypingDots />
          ) : (
            <div className="flex flex-col gap-0.5">
              {formatMessageContent(message.content)}
            </div>
          )}
        </div>

        {!message.isTyping && (
          <span className="px-1 text-[10px] text-muted-foreground/70">
            {formatTimestamp(message.timestamp)}
          </span>
        )}
      </div>
    </motion.div>
  );
}
