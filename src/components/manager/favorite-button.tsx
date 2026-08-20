"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  vendorId: string;
  className?: string;
  size?: "sm" | "md";
}

export function FavoriteButton({ vendorId, className, size = "md" }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from("favorites")
        .select("vendor_id")
        .eq("manager_id", user.id)
        .eq("vendor_id", vendorId)
        .maybeSingle();

      setIsFavorited(!!data);
    }
    check();
  }, [vendorId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      window.location.href = "/login";
      return;
    }

    setLoading(true);
    const supabase = createClient();

    if (isFavorited) {
      await supabase
        .from("favorites")
        .delete()
        .eq("manager_id", userId)
        .eq("vendor_id", vendorId);
      setIsFavorited(false);
    } else {
      await supabase.from("favorites").insert({
        manager_id: userId,
        vendor_id: vendorId,
      });
      setIsFavorited(true);
    }

    setLoading(false);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className={cn(
        "rounded-full bg-background/80 p-2 backdrop-blur transition hover:bg-background",
        className
      )}
      aria-label={isFavorited ? "Remove from shortlist" : "Add to shortlist"}
    >
      <Heart
        className={cn(
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
          isFavorited ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
