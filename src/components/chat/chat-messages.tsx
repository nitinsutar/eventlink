"use client";

import { useEffect, useRef } from "react";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  sender_id: string;
  body?: string | null;
  attachment_url?: string | null;
  attachment_filename?: string | null;
  created_at: string;
}

interface ChatMessagesProps {
  messages: Message[];
  currentUserId: string;
}

export function ChatMessages({ messages, currentUserId }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!messages.length) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No messages yet. Say hello.
      </p>
    );
  }

  return (
    <>
      {messages.map((msg) => {
        const mine = msg.sender_id === currentUserId;
        return (
          <div
            key={msg.id}
            className={cn("flex", mine ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm sm:max-w-[75%]",
                mine
                  ? "rounded-br-md bg-accent text-accent-foreground"
                  : "rounded-bl-md bg-secondary text-foreground"
              )}
            >
              {msg.body && (
                <p className="whitespace-pre-wrap break-words">{msg.body}</p>
              )}
              {msg.attachment_url && (
                <a
                  href={msg.attachment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "mt-2 flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium",
                    mine
                      ? "bg-black/10 hover:bg-black/15"
                      : "bg-background/80 hover:bg-background"
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {msg.attachment_filename || "Attachment"}
                  </span>
                </a>
              )}
              <p
                className={cn(
                  "mt-1 text-[10px]",
                  mine ? "text-accent-foreground/70" : "text-muted-foreground"
                )}
              >
                {new Date(msg.created_at).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </>
  );
}
