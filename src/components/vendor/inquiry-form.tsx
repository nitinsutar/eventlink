"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Send, Upload, FileText, X } from "lucide-react";
import { DESIGN_UPLOAD_CATEGORIES } from "@/types/database";

interface InquiryFormProps {
  vendorId: string;
  vendorName: string;
  vendorCategories?: string[];
}

export function InquiryForm({
  vendorId,
  vendorName,
  vendorCategories = [],
}: InquiryFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [city, setCity] = useState("");
  const [budget, setBudget] = useState("");

  // Contact details
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactWhatsapp, setContactWhatsapp] = useState("");

  // Design upload (Fabrication + Event Management Agency only)
  const [designFile, setDesignFile] = useState<File | null>(null);
  const designInputRef = useRef<HTMLInputElement>(null);

  const supportsDesignUpload = vendorCategories.some((c) =>
    (DESIGN_UPLOAD_CATEGORIES as readonly string[]).includes(c)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Please log in as an Event Manager to send an inquiry.");
      setLoading(false);
      return;
    }

    let designUrl: string | null = null;
    let designFilename: string | null = null;

    // Upload design if provided
    if (designFile && supportsDesignUpload) {
      const ext = designFile.name.split(".").pop();
      const path = `designs/${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(path, designFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError("Failed to upload design: " + uploadError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("portfolio").getPublicUrl(path);

      designUrl = publicUrl;
      designFilename = designFile.name;
    }

    const { error: insertError } = await supabase.from("inquiries").insert({
      vendor_id: vendorId,
      manager_id: user.id,
      message,
      event_type: eventType || null,
      event_date: eventDate || null,
      city: city || null,
      budget_range: budget || null,
      contact_name: contactName || null,
      contact_phone: contactPhone || null,
      contact_email: contactEmail || null,
      contact_whatsapp: contactWhatsapp || contactPhone || null,
      design_url: designUrl,
      design_filename: designFilename,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-border bg-card p-5"
    >
      <h3 className="font-semibold">Send Inquiry to {vendorName}</h3>

      {/* Contact Details */}
      <div className="space-y-3 rounded-xl bg-secondary/40 p-4">
        <p className="text-sm font-medium">Your contact details</p>
        <p className="text-xs text-muted-foreground">
          So the vendor can reach you directly
        </p>

        <div className="space-y-2">
          <Label htmlFor="contactName">Full name *</Label>
          <Input
            id="contactName"
            required
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone *</Label>
            <Input
              id="contactPhone"
              required
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="98765 43210"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contactWhatsapp">WhatsApp</Label>
            <Input
              id="contactWhatsapp"
              type="tel"
              value={contactWhatsapp}
              onChange={(e) => setContactWhatsapp(e.target.value)}
              placeholder="Same as phone"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>
      </div>

      {/* Message */}
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

      {/* Design Upload - only for Fabrication & Event Management Agency */}
      {supportsDesignUpload && (
        <div className="space-y-2">
          <Label>Upload Design / Drawing (optional)</Label>
          <p className="text-xs text-muted-foreground">
            Upload your design so the vendor can quote accurately
          </p>

          {!designFile ? (
            <button
              type="button"
              onClick={() => designInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-6 text-sm text-muted-foreground transition hover:border-accent/50 hover:bg-secondary/30"
            >
              <Upload className="h-4 w-4" />
              Upload PDF, JPG or PNG
            </button>
          ) : (
            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 px-4 py-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="h-4 w-4 text-accent" />
                <span className="truncate max-w-[180px]">{designFile.name}</span>
              </div>
              <button
                type="button"
                onClick={() => setDesignFile(null)}
                className="rounded-full p-1 hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <input
            ref={designInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setDesignFile(file);
            }}
          />
        </div>
      )}

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
