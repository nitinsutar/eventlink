"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";

interface StartChatButtonProps {
  vendorId: string;
  managerId: string;
  inquiryId?: string;
  initialMessage?: string;
  label?: string;
  variant?: "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
}

export function StartChatButton({
  vendorId,
  managerId,
  inquiryId,
  initialMessage,
  label = "Message",
  variant = "outline",
  size = "sm",
}: StartChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const supabase = createClient();

    // Find or create conversation
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("vendor_id", vendorId)
      .eq("manager_id", managerId)
      .maybeSingle();

    let conversationId = existing?.id;

    if (!conversationId) {
      const { data: created, error } = await supabase
        .from("conversations")
        .insert({
          vendor_id: vendorId,
          manager_id: managerId,
          inquiry_id: inquiryId || null,
        })
        .select("id")
        .single();

      if (error || !created) {
        setLoading(false);
        return;
      }
      conversationId = created.id;

      // Seed first message from inquiry if provided
      if (initialMessage) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: managerId,
          body: initialMessage,
        });
      }
    }

    router.push(`/dashboard/messages/${conversationId}`);
  };

  return (
    <Button variant={variant} size={size} onClick={handleClick} disabled={loading}>
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <MessageSquare className="h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}
