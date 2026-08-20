-- Run this in Supabase SQL Editor
-- Adds company & designation fields for Event Managers

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS company_name text,
ADD COLUMN IF NOT EXISTS designation text,
ADD COLUMN IF NOT EXISTS city text;
