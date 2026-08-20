-- ============================================================
-- Phase 2 enhancements: attachments + soft delete
-- Run in Supabase → SQL Editor
-- ============================================================

-- Message attachments
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS attachment_url text,
ADD COLUMN IF NOT EXISTS attachment_filename text,
ADD COLUMN IF NOT EXISTS attachment_type text;

-- Soft delete columns
ALTER TABLE public.messages
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.inquiries
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.media
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.reviews
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

ALTER TABLE public.vendor_profiles
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Indexes for soft-delete filtering
CREATE INDEX IF NOT EXISTS idx_messages_not_deleted
  ON public.messages(conversation_id, created_at)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_not_deleted
  ON public.conversations(last_message_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_inquiries_not_deleted
  ON public.inquiries(vendor_id, created_at DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_media_not_deleted
  ON public.media(vendor_id, sort_order)
  WHERE deleted_at IS NULL;
