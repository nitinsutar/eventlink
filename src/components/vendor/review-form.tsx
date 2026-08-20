"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
  vendorId: string;
  vendorName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ vendorId, vendorName, onSuccess }: ReviewFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in as an Event Manager to leave a review.");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "manager") {
      setError("Only Event Managers can leave reviews.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("reviews").insert({
      vendor_id: vendorId,
      manager_id: user.id,
      rating,
      comment: comment || null,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        setError("You have already reviewed this vendor.");
      } else {
        setError(insertError.message);
      }
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    onSuccess?.();
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
        <p className="font-medium text-accent">Thank you for your review!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Your feedback helps other event managers.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <Button variant="outline" onClick={() => setOpen(true)}>
        Write a Review
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold">Review {vendorName}</h3>

      <div className="space-y-2">
        <Label>Rating *</Label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              className="p-0.5 transition"
            >
              <Star
                className={cn(
                  "h-7 w-7 transition",
                  (hover || rating) >= star
                    ? "fill-accent text-accent"
                    : "text-muted-foreground/40"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Your experience (optional)</Label>
        <textarea
          id="comment"
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was working with this vendor?"
          className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading || rating === 0} className="flex-1">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Review"}
        </Button>
      </div>
    </form>
  );
}
