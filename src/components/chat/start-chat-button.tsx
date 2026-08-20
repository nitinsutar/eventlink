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
  variant?: "default" | "outline" | "accent" | "ghost";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function StartChatButton({
  vendorId,
  managerId,
  inquiryId,
  initialMessage,
  label = "Message",
  variant = "outline",
  size = "sm",
  className,
}: StartChatButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    const supabase = createClient();

    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("vendor_id", vendorId)
      .eq("manager_id", managerId)
      .is("deleted_at", null)
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

      if (initialMessage) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: managerId,
          body: initialMessage,
        });
        await supabase
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
      }
    }

    router.push(`/dashboard/messages/${conversationId}`);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <>
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="hidden xs:inline sm:inline">{label}</span>
        </>
      )}
    </Button>
  );
}
