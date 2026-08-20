"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface MessageFormProps {
  conversationId: string;
  senderId: string;
}

export function MessageForm({ conversationId, senderId }: MessageFormProps) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: senderId,
      body: body.trim(),
    });

    if (!error) {
      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);

      setBody("");
      router.refresh();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-4">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !body.trim()} size="icon" className="h-10 w-10 shrink-0">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
      </Button>
    </form>
  );
}
