"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CalendarCheck } from "lucide-react";

interface BookingRequestFormProps {
  vendorId: string;
  vendorName: string;
  managerId: string;
  conversationId?: string;
  inquiryId?: string;
  defaultEventType?: string;
  defaultCity?: string;
  onSuccess?: () => void;
}

export function BookingRequestForm({
  vendorId,
  vendorName,
  managerId,
  conversationId,
  inquiryId,
  defaultEventType = "",
  defaultCity = "",
  onSuccess,
}: BookingRequestFormProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [eventType, setEventType] = useState(defaultEventType);
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [city, setCity] = useState(defaultCity);
  const [venue, setVenue] = useState("");
  const [budget, setBudget] = useState("");
  const [packageTitle, setPackageTitle] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate) {
      setError("Event date is required");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { data: booking, error: insertError } = await supabase
      .from("bookings")
      .insert({
        vendor_id: vendorId,
        manager_id: managerId,
        inquiry_id: inquiryId || null,
        conversation_id: conversationId || null,
        event_type: eventType || null,
        event_date: eventDate,
        event_end_date: eventEndDate || null,
        city: city || null,
        venue: venue || null,
        budget_range: budget || null,
        package_title: packageTitle || null,
        notes: notes || null,
        status: "requested",
      })
      .select("id")
      .single();

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    // Notify in chat if conversation exists
    if (conversationId && booking) {
      const summary = [
        `📅 Booking request sent`,
        eventType ? `Event: ${eventType}` : null,
        `Date: ${eventDate}${eventEndDate ? ` → ${eventEndDate}` : ""}`,
        city ? `City: ${city}` : null,
        venue ? `Venue: ${venue}` : null,
        budget ? `Budget: ${budget}` : null,
        notes ? `Notes: ${notes}` : null,
      ]
        .filter(Boolean)
        .join("\n");

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: managerId,
        body: summary,
      });

      await supabase
        .from("conversations")
        .update({ last_message_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    setSuccess(true);
    setLoading(false);
    onSuccess?.();
    router.refresh();
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-5 text-center">
        <CalendarCheck className="mx-auto h-8 w-8 text-accent" />
        <p className="mt-2 font-medium text-accent">Booking request sent</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {vendorName} will review and respond.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="w-full sm:w-auto"
      >
        <CalendarCheck className="h-4 w-4" />
        Request Booking
      </Button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-border bg-card p-4 sm:p-5"
    >
      <h3 className="font-semibold">Request booking with {vendorName}</h3>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event date *</Label>
          <Input
            id="eventDate"
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventEndDate">End date (optional)</Label>
          <Input
            id="eventEndDate"
            type="date"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventType">Event type</Label>
          <Input
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="Wedding, Corporate, Expo..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="venue">Venue</Label>
          <Input
            id="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Hotel / ground name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget range</Label>
          <Input
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="₹50k – 1L"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="packageTitle">Package / service</Label>
        <Input
          id="packageTitle"
          value={packageTitle}
          onChange={(e) => setPackageTitle(e.target.value)}
          placeholder="Full day setup, Basic package..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any special requirements..."
          className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex flex-col-reverse gap-2 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen(false)}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <CalendarCheck className="h-4 w-4" />
              Send request
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
