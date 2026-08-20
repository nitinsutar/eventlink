"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Trash2 } from "lucide-react";

interface MediaItemProps {
  id: string;
  url: string;
  caption?: string | null;
  isCover?: boolean;
  vendorId: string;
}

export function MediaItem({ id, url, caption, isCover, vendorId }: MediaItemProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Remove this photo from your portfolio?")) return;
    setDeleting(true);

    const supabase = createClient();

    // Soft delete
    await supabase
      .from("media")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id);

    // If this was cover, clear cover_image_url and promote next image
    if (isCover) {
      const { data: next } = await supabase
        .from("media")
        .select("id, url")
        .eq("vendor_id", vendorId)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (next) {
        await supabase.from("media").update({ is_cover: true }).eq("id", next.id);
        await supabase
          .from("vendor_profiles")
          .update({ cover_image_url: next.url })
          .eq("id", vendorId);
      } else {
        await supabase
          .from("vendor_profiles")
          .update({ cover_image_url: null })
          .eq("id", vendorId);
      }
    }

    setDeleting(false);
    router.refresh();
  };

  return (
    <div className="group relative aspect-square overflow-hidden rounded-xl border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt={caption || ""} className="h-full w-full object-cover" />
      {isCover && (
        <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
          Cover
        </span>
      )}
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
        aria-label="Delete photo"
      >
        {deleting ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Trash2 className="h-3.5 w-3.5" />
        )}
      </button>
    </div>
  );
}
