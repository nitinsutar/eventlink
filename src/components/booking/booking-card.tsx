import { Calendar, MapPin, Building2 } from "lucide-react";
import { BookingActions } from "./booking-actions";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  booking: {
    id: string;
    status: string;
    event_type?: string | null;
    event_date?: string | null;
    event_end_date?: string | null;
    city?: string | null;
    venue?: string | null;
    budget_range?: string | null;
    package_title?: string | null;
    notes?: string | null;
    conversation_id?: string | null;
    created_at: string;
    vendor?: { business_name?: string } | null;
    manager?: { full_name?: string | null; company_name?: string | null } | null;
  };
  role: "vendor" | "manager";
  vendorUserId?: string;
}

const statusStyles: Record<string, string> = {
  requested: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  accepted: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  declined: "bg-red-500/15 text-red-700 dark:text-red-400",
  cancelled: "bg-secondary text-muted-foreground",
  completed: "bg-accent/20 text-accent-foreground",
};

export function BookingCard({ booking, role, vendorUserId }: BookingCardProps) {
  const title =
    role === "vendor"
      ? booking.manager?.full_name ||
        booking.manager?.company_name ||
        "Event Manager"
      : booking.vendor?.business_name || "Vendor";

  return (
    <div className="rounded-xl border border-border bg-card p-3.5 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{title}</p>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                statusStyles[booking.status] || "bg-secondary"
              )}
            >
              {booking.status}
            </span>
          </div>

          {booking.event_type && (
            <p className="text-sm text-muted-foreground">{booking.event_type}</p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {booking.event_date && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(booking.event_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {booking.event_end_date &&
                  ` → ${new Date(booking.event_end_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}`}
              </span>
            )}
            {booking.city && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {booking.city}
              </span>
            )}
            {booking.venue && (
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {booking.venue}
              </span>
            )}
          </div>

          {booking.budget_range && (
            <p className="text-sm font-medium">Budget: {booking.budget_range}</p>
          )}
          {booking.package_title && (
            <p className="text-sm text-muted-foreground">
              Package: {booking.package_title}
            </p>
          )}
          {booking.notes && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {booking.notes}
            </p>
          )}
        </div>

        {role === "vendor" && vendorUserId && (
          <div className="shrink-0">
            <BookingActions
              bookingId={booking.id}
              conversationId={booking.conversation_id}
              vendorUserId={vendorUserId}
              status={booking.status}
            />
          </div>
        )}
      </div>
    </div>
  );
}
