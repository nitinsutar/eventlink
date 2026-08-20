"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";

interface BookingActionsProps {
  bookingId: string;
  conversationId?: string | null;
  vendorUserId: string;
  status: string;
}

export function BookingActions({
  bookingId,
  conversationId,
  vendorUserId,
  status,
}: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<"accept" | "decline" | null>(null);

  if (status !== "requested") {
    return (
      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize">
        {status}
      </span>
    );
  }

  const respond = async (next: "accepted" | "declined") => {
    setLoading(next === "accepted" ? "accept" : "decline");
    const supabase = createClient();

    const { error } = await supabase
      .from("bookings")
      .update({
        status: next,
        responded_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId);

    if (!error && conversationId) {
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: vendorUserId,
        body:
          next === "accepted"
            ? "✅ Booking accepted. Looking forward to working together."
            : "❌ Booking declined. Feel free to message if details change.",
      });

      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    setLoading(null);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        onClick={() => respond("accepted")}
        disabled={!!loading}
        className="flex-1 sm:flex-none"
      >
        {loading === "accept" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Check className="h-4 w-4" />
            Accept
          </>
        )}
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => respond("declined")}
        disabled={!!loading}
        className="flex-1 sm:flex-none"
      >
        {loading === "decline" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <X className="h-4 w-4" />
            Decline
          </>
        )}
      </Button>
    </div>
  );
}
