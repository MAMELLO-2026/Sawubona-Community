/*
# Create tables for Sawubona Community - TKZ Help Hub

## Overview
Creates three tables to support the Thokoza township community help app:
1. `reported_issues` — citizen-reported municipal issues (potholes, water leaks, etc.)
2. `ubuntu_posts` — community share board posts (offering help or needing help)
3. `trusted_services` — directory of vetted local service providers

All tables are single-tenant (no sign-in). The app uses the anon key, so policies
are scoped to `anon, authenticated` with `USING (true)` because the data is
intentionally public/shared within the community.

## Tables

### reported_issues
- `id` (uuid, PK)
- `issue_type` (text, not null) — Pothole, Water Leak, No Electricity, Street Light, Waste
- `description` (text, not null)
- `location` (text, not null)
- `photo_url` (text, nullable) — base64 or storage URL of uploaded photo
- `status` (text, not null, default 'Reported') — Reported / In Progress / Resolved
- `created_at` (timestamptz, default now())

### ubuntu_posts
- `id` (uuid, PK)
- `post_type` (text, not null) — 'offering' or 'needing'
- `name` (text, not null)
- `item` (text, not null) — what they offer or need
- `location` (text, not null) — Thokoza, Eden Park, Thinasonke, etc.
- `whatsapp` (text, not null) — WhatsApp contact number
- `created_at` (timestamptz, default now())

### trusted_services
- `id` (uuid, PK)
- `category` (text, not null) — Plumber, Electrician, Tutor, Hairdresser, Gardener
- `name` (text, not null)
- `rating` (integer, default 5) — 1-5 star rating
- `price_range` (text, not null) — e.g. "R150/call"
- `phone` (text, not null)
- `verified` (boolean, default false)
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on all three tables.
- All CRUD operations allowed for `anon, authenticated` because this is a
  no-auth community app where data is intentionally public/shared.
*/

CREATE TABLE IF NOT EXISTS reported_issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_type text NOT NULL,
  description text NOT NULL,
  location text NOT NULL,
  photo_url text,
  status text NOT NULL DEFAULT 'Reported',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reported_issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_issues" ON reported_issues;
CREATE POLICY "anon_select_issues" ON reported_issues FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_issues" ON reported_issues;
CREATE POLICY "anon_insert_issues" ON reported_issues FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_issues" ON reported_issues;
CREATE POLICY "anon_update_issues" ON reported_issues FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_issues" ON reported_issues;
CREATE POLICY "anon_delete_issues" ON reported_issues FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS ubuntu_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_type text NOT NULL CHECK (post_type IN ('offering', 'needing')),
  name text NOT NULL,
  item text NOT NULL,
  location text NOT NULL,
  whatsapp text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ubuntu_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_posts" ON ubuntu_posts;
CREATE POLICY "anon_select_posts" ON ubuntu_posts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_posts" ON ubuntu_posts;
CREATE POLICY "anon_insert_posts" ON ubuntu_posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_posts" ON ubuntu_posts;
CREATE POLICY "anon_delete_posts" ON ubuntu_posts FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS trusted_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  price_range text NOT NULL,
  phone text NOT NULL,
  verified boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trusted_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_services" ON trusted_services;
CREATE POLICY "anon_select_services" ON trusted_services FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_services" ON trusted_services;
CREATE POLICY "anon_insert_services" ON trusted_services FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_services" ON trusted_services;
CREATE POLICY "anon_update_services" ON trusted_services FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_services" ON trusted_services;
CREATE POLICY "anon_delete_services" ON trusted_services FOR DELETE
  TO anon, authenticated USING (true);
