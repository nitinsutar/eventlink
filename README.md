# EventLink

**India’s premier marketplace connecting event managers with vendors & artists.**

Built with Next.js 15 + TypeScript + Supabase + Tailwind CSS.

## Quick Start

1. Clone the repo
2. Copy `.env.example` → `.env.local` and fill in your Supabase keys
3. Run the SQL schema in Supabase Dashboard → SQL Editor:
   - Open `supabase/schema.sql`
   - Paste & Run
4. Create a public Storage bucket named `media`
5. `npm install && npm run dev`

## Environment Variables (Vercel)

Add these in Vercel Project Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL` = `https://feodtlkrvcqjdakmbiob.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (your anon key)

## Features (MVP)

- Vendor & Event Manager roles
- Rich vendor profiles with multi-category support
- City-first public URLs (`/mumbai/photo-video/slug`)
- Reviews, favorites, inquiries
- Beautiful mobile-first UI with dark mode
- Profile completion score

## Categories

Production, Fabrication, Printing, Sound, Lights, AV, Pyro, Security, Security Equipment, Photo/Video, Anchors, Wedding Decor, Furniture, Car Rentals, Teleprompters, Power Management, Vanity Vans

---

Made for the Indian event industry.
