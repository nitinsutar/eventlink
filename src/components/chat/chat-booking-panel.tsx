"use client";

import { useState } from "react";
import { BookingRequestForm } from "@/components/booking/booking-request-form";
import { Button } from "@/components/ui/button";
import { CalendarCheck, X } from "lucide-react";

interface ChatBookingPanelProps {
  vendorId: string;
  vendorName: string;
  managerId: string;
  conversationId: string;
  isManager: boolean;
}

export function ChatBookingPanel({
  vendorId,
  vendorName,
  managerId,
  conversationId,
  isManager,
}: ChatBookingPanelProps) {
  const [show, setShow] = useState(false);

  if (!isManager) return null;

  if (!show) {
    return (
      <div className="border-b border-border px-3 py-2 sm:px-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShow(true)}
          className="w-full sm:w-auto"
        >
          <CalendarCheck className="h-4 w-4" />
          Request Booking
        </Button>
      </div>
    );
  }

  return (
    <div className="border-b border-border p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium">New booking request</p>
        <button
          type="button"
          onClick={() => setShow(false)}
          className="rounded-full p-1 hover:bg-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <BookingRequestForm
        vendorId={vendorId}
        vendorName={vendorName}
        managerId={managerId}
        conversationId={conversationId}
        onSuccess={() => setShow(false)}
      />
    </div>
  );
}
