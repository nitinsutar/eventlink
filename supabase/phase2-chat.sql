-- ============================================================
-- Phase 2.1 — Chat / Messaging
-- Run in Supabase → SQL Editor
-- ============================================================

-- Conversations (one thread between a vendor and a manager)
CREATE TABLE IF NOT EXISTS public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  manager_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  inquiry_id uuid REFERENCES public.inquiries(id) ON DELETE SET NULL,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE (vendor_id, manager_id)
);

-- Messages
CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_conversations_vendor ON public.conversations(vendor_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_manager ON public.conversations(manager_id, last_message_at DESC);

-- RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Conversations: participants only
CREATE POLICY "Participants can view conversations"
  ON public.conversations FOR SELECT
  USING (
    manager_id = auth.uid()
    OR vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Managers can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (manager_id = auth.uid());

CREATE POLICY "Vendors can create conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (
    vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Participants can update conversations"
  ON public.conversations FOR UPDATE
  USING (
    manager_id = auth.uid()
    OR vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
  );

-- Messages: participants only
CREATE POLICY "Participants can view messages"
  ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE manager_id = auth.uid()
         OR vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Participants can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
    AND conversation_id IN (
      SELECT id FROM public.conversations
      WHERE manager_id = auth.uid()
         OR vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Participants can mark messages read"
  ON public.messages FOR UPDATE
  USING (
    conversation_id IN (
      SELECT id FROM public.conversations
      WHERE manager_id = auth.uid()
         OR vendor_id IN (SELECT id FROM public.vendor_profiles WHERE user_id = auth.uid())
    )
  );
