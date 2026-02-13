"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Smile,
  Paperclip,
  Volume2,
  VolumeX,
  Loader2,
  Wifi,
  WifiOff,
  Headset,
  Clock,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MessageBubble, type ChatMessage } from "./message-bubble";

type ConnectionStatus = "connecting" | "queued" | "connected" | "disconnected";

interface AgentInfo {
  name: string;
  avatar?: string;
  department: string;
}

const SIMULATED_AGENT: AgentInfo = {
  name: "Sarah Mitchell",
  avatar: undefined,
  department: "Customer Support",
};

function generateId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const SIMULATED_RESPONSES = [
  "Thank you for reaching out! Let me look into that for you.",
  "I understand your concern. Let me check our system for the latest information.",
  "I've found the details you're looking for. Let me share them with you.",
  "Is there anything else I can help you with today?",
  "I've updated the records on our end. You should see the changes reflected shortly.",
  "That's a great question! Let me provide you with the most accurate information.",
];

export function LiveChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>("connecting");
  const [agent, setAgent] = useState<AgentInfo | null>(null);
  const [queuePosition, setQueuePosition] = useState(3);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const responseIndexRef = useRef(0);

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
  }, [messages, isAgentTyping, scrollToBottom]);

  // Simulate connection flow
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Phase 1: Connecting (1.5s)
    timers.push(
      setTimeout(() => {
        setConnectionStatus("queued");
        setQueuePosition(3);
      }, 1500)
    );

    // Phase 2: Queue countdown
    timers.push(setTimeout(() => setQueuePosition(2), 3500));
    timers.push(setTimeout(() => setQueuePosition(1), 5500));

    // Phase 3: Connected
    timers.push(
      setTimeout(() => {
        setConnectionStatus("connected");
        setAgent(SIMULATED_AGENT);

        const welcomeMsg: ChatMessage = {
          id: generateId(),
          content: `Hi! I'm ${SIMULATED_AGENT.name} from ${SIMULATED_AGENT.department}. How can I assist you today?`,
          sender: "agent",
          timestamp: new Date(),
          senderName: SIMULATED_AGENT.name,
          avatar: SIMULATED_AGENT.avatar,
        };
        setMessages([welcomeMsg]);
      }, 7500)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  const simulateAgentResponse = useCallback(() => {
    setIsAgentTyping(true);

    const delay = 1500 + Math.random() * 2000;

    setTimeout(() => {
      setIsAgentTyping(false);

      const response =
        SIMULATED_RESPONSES[responseIndexRef.current % SIMULATED_RESPONSES.length];
      responseIndexRef.current += 1;

      const agentMessage: ChatMessage = {
        id: generateId(),
        content: response,
        sender: "agent",
        timestamp: new Date(),
        senderName: SIMULATED_AGENT.name,
        avatar: SIMULATED_AGENT.avatar,
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsLoading(false);
    }, delay);
  }, []);

  const sendMessage = (content: string) => {
    if (!content.trim() || isLoading || connectionStatus !== "connected") return;

    const userMessage: ChatMessage = {
      id: generateId(),
      content: content.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate agent response
    setTimeout(() => {
      simulateAgentResponse();
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Agent info bar */}
      <div className="border-b px-4 py-2.5">
        {connectionStatus === "connected" && agent ? (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="relative">
              <Avatar size="sm">
                {agent.avatar ? (
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                ) : null}
                <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-[10px] text-white">
                  {agent.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 block size-2.5 rounded-full border-2 border-background bg-emerald-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium leading-tight truncate">{agent.name}</p>
              <p className="text-[10px] text-muted-foreground">{agent.department}</p>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                variant="outline"
                className="gap-1 bg-emerald-500/10 text-[10px] text-emerald-600 border-emerald-500/20"
              >
                <Wifi className="size-2.5" />
                Connected
              </Badge>
            </div>
          </motion.div>
        ) : connectionStatus === "connecting" ? (
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-full bg-muted">
              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium">Connecting...</p>
              <p className="text-[10px] text-muted-foreground">
                Finding an available agent
              </p>
            </div>
          </div>
        ) : connectionStatus === "queued" ? (
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-full bg-amber-500/10">
              <Clock className="size-3.5 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium">Waiting in queue</p>
              <p className="text-[10px] text-muted-foreground">
                Estimated wait: ~{queuePosition} min
              </p>
            </div>
            <Badge
              variant="outline"
              className="bg-amber-500/10 text-[10px] text-amber-600 border-amber-500/20"
            >
              #{queuePosition} in queue
            </Badge>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="flex size-6 items-center justify-center rounded-full bg-red-500/10">
              <WifiOff className="size-3.5 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-medium">Disconnected</p>
              <p className="text-[10px] text-muted-foreground">
                Connection lost. Please try again.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Messages area */}
      <ScrollArea ref={scrollRef} className="flex-1 overflow-hidden">
        <div className="flex flex-col gap-3 py-4">
          {/* Connecting / Queue state */}
          {connectionStatus !== "connected" && (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-8">
              {connectionStatus === "connecting" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="relative">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                      <Headset className="size-7 text-emerald-600" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-emerald-500/30"
                      animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Connecting to support</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Please wait while we connect you...
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="size-1.5 rounded-full bg-emerald-500"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{
                          duration: 1.2,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {connectionStatus === "queued" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="relative flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10">
                    <Clock className="size-7 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">You&apos;re in the queue</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Position <span className="font-semibold text-amber-600">#{queuePosition}</span>{" "}
                      - An agent will be with you shortly
                    </p>
                  </div>

                  {/* Queue progress */}
                  <div className="w-full max-w-[200px]">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500"
                        initial={{ width: "10%" }}
                        animate={{
                          width: queuePosition === 3 ? "33%" : queuePosition === 2 ? "60%" : "85%",
                        }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Chat messages */}
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {/* Agent typing indicator */}
          {isAgentTyping && (
            <MessageBubble
              message={{
                id: "agent-typing",
                content: "",
                sender: "agent",
                timestamp: new Date(),
                isTyping: true,
                senderName: agent?.name || "Agent",
              }}
            />
          )}
        </div>
      </ScrollArea>

      <Separator />

      {/* Action bar */}
      <div className="flex items-center justify-between px-4 py-1.5">
        <div className="flex items-center gap-0.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground"
                  disabled={connectionStatus !== "connected"}
                >
                  <Paperclip className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="text-muted-foreground"
                  disabled={connectionStatus !== "connected"}
                >
                  <ImageIcon className="size-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send image</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? (
                  <Volume2 className="size-3.5" />
                ) : (
                  <VolumeX className="size-3.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {soundEnabled ? "Mute notifications" : "Unmute notifications"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Separator />

      {/* Input area */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="shrink-0 text-muted-foreground"
          disabled={connectionStatus !== "connected"}
        >
          <Smile className="size-4" />
        </Button>
        <Input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={
            connectionStatus === "connected"
              ? "Type a message..."
              : "Waiting for agent..."
          }
          className="h-8 rounded-full border-none bg-muted/60 px-3 text-sm shadow-none focus-visible:ring-0"
          disabled={connectionStatus !== "connected" || isLoading}
        />
        <Button
          type="submit"
          size="icon-sm"
          disabled={!inputValue.trim() || isLoading || connectionStatus !== "connected"}
          className={cn(
            "shrink-0 rounded-full transition-all",
            inputValue.trim()
              ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/30"
              : "bg-muted text-muted-foreground"
          )}
        >
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  );
}
