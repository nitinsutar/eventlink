import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  manager?: {
    full_name: string | null;
  } | null;
}

interface ReviewsListProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

export function ReviewsList({ reviews, averageRating, reviewCount }: ReviewsListProps) {
  if (reviewCount === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-10 text-center">
        <p className="text-muted-foreground">No reviews yet</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Be the first to share your experience
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Star className="h-6 w-6 fill-accent text-accent" />
          <span className="text-2xl font-bold">{Number(averageRating).toFixed(1)}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">
                  {review.manager?.full_name || "Event Manager"}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      review.rating >= star
                        ? "fill-accent text-accent"
                        : "text-muted-foreground/30"
                    )}
                  />
                ))}
              </div>
            </div>
            {review.comment && (
              <p className="mt-3 text-sm text-muted-foreground whitespace-pre-line">
                {review.comment}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
