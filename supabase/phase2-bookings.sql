-- ============================================================
-- Phase 2.2 — Booking requests
-- Run in Supabase → SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  manager_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  inquiry_id uuid REFERENCES public.inquiries(id) ON DELETE SET NULL,
  conversation_id uuid REFERENCES public.conversations(id) ON DELETE SET NULL,

  event_type text,
  event_date date,
  event_end_date date,
  city text,
  venue text,
  budget_range text,
  package_title text,
  notes text,

  -- proposed amount (optional, INR)
  amount_min numeric,
  amount_max numeric,
  currency text DEFAULT 'INR',

  status text NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'accepted', 'declined', 'cancelled', 'completed')),

  vendor_note text,          -- reason / counter message from vendor
  responded_at timestamptz,

  deleted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_bookings_vendor
  ON public.bookings(vendor_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_manager
  ON public.bookings(manager_id, created_at DESC)
  WHERE deleted_at IS NULL;

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Managers see their own bookings
CREATE POLICY "Managers can view own bookings"
  ON public.bookings FOR SELECT
  USING (manager_id = auth.uid());

-- Vendors see bookings for their profile
CREATE POLICY "Vendors can view their bookings"
  ON public.bookings FOR SELECT
  USING (
    vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
  );

-- Managers create booking requests
CREATE POLICY "Managers can create bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (manager_id = auth.uid());

-- Managers can cancel their own requested bookings
CREATE POLICY "Managers can update own bookings"
  ON public.bookings FOR UPDATE
  USING (manager_id = auth.uid());

-- Vendors can accept/decline
CREATE POLICY "Vendors can update their bookings"
  ON public.bookings FOR UPDATE
  USING (
    vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
  );
