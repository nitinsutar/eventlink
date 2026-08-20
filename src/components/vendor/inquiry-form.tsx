"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send } from "lucide-react";

interface InquiryFormProps {
  vendorId: string;
  vendorName: string;
}

export function InquiryForm({ vendorId, vendorName }: InquiryFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in as an Event Manager to send an inquiry.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("inquiries").insert({
      vendor_id: vendorId,
      manager_id: user.id,
      message,
      event_type: eventType || null,
      event_date: eventDate || null,
      city: city || null,
      budget_range: budget || null,
      status: "pending",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
        <p className="font-medium text-accent">Inquiry sent!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {vendorName} will get back to you soon.
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <Button size="lg" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
        Send Inquiry
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold">Send Inquiry to {vendorName}</h3>

      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <textarea
          id="message"
          required
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell them about your event..."
          className="flex w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="eventType">Event type</Label>
          <Input
            id="eventType"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            placeholder="Wedding, Corporate..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventDate">Event date</Label>
          <Input
            id="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Mumbai"
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

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Inquiry
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
