-- Create Gallery Table
CREATE TABLE IF NOT EXISTS public.gallery (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Services Table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  icon text
);

-- Create Testimonials Table
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  review text NOT NULL,
  rating integer NOT NULL DEFAULT 5,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 5. GALLERY POLICIES
DROP POLICY IF EXISTS "Gallery Public Select" ON public.gallery;
DROP POLICY IF EXISTS "Gallery Admin Insert" ON public.gallery;
DROP POLICY IF EXISTS "Gallery Admin Update" ON public.gallery;
DROP POLICY IF EXISTS "Gallery Admin Delete" ON public.gallery;

CREATE POLICY "Gallery Public Select" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Gallery Admin Insert" ON public.gallery FOR INSERT WITH CHECK (true);
CREATE POLICY "Gallery Admin Update" ON public.gallery FOR UPDATE USING (true);
CREATE POLICY "Gallery Admin Delete" ON public.gallery FOR DELETE USING (true);

-- 6. SERVICES POLICIES
DROP POLICY IF EXISTS "Services Public Select" ON public.services;
DROP POLICY IF EXISTS "Services Admin Insert" ON public.services;
DROP POLICY IF EXISTS "Services Admin Update" ON public.services;
DROP POLICY IF EXISTS "Services Admin Delete" ON public.services;

CREATE POLICY "Services Public Select" ON public.services FOR SELECT USING (true);
CREATE POLICY "Services Admin Insert" ON public.services FOR INSERT WITH CHECK (true);
CREATE POLICY "Services Admin Update" ON public.services FOR UPDATE USING (true);
CREATE POLICY "Services Admin Delete" ON public.services FOR DELETE USING (true);

-- 7. TESTIMONIALS POLICIES
DROP POLICY IF EXISTS "Testimonials Public Select" ON public.testimonials;
DROP POLICY IF EXISTS "Testimonials Admin Insert" ON public.testimonials;
DROP POLICY IF EXISTS "Testimonials Admin Update" ON public.testimonials;
DROP POLICY IF EXISTS "Testimonials Admin Delete" ON public.testimonials;

CREATE POLICY "Testimonials Public Select" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Testimonials Admin Insert" ON public.testimonials FOR INSERT WITH CHECK (true);
CREATE POLICY "Testimonials Admin Update" ON public.testimonials FOR UPDATE USING (true);
CREATE POLICY "Testimonials Admin Delete" ON public.testimonials FOR DELETE USING (true);

-- 8. SETTINGS POLICIES
DROP POLICY IF EXISTS "Settings Public Select" ON public.settings;
DROP POLICY IF EXISTS "Settings Admin Insert" ON public.settings;
DROP POLICY IF EXISTS "Settings Admin Update" ON public.settings;
DROP POLICY IF EXISTS "Settings Admin Delete" ON public.settings;

CREATE POLICY "Settings Public Select" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings Admin Insert" ON public.settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Settings Admin Update" ON public.settings FOR UPDATE USING (true);
CREATE POLICY "Settings Admin Delete" ON public.settings FOR DELETE USING (true);
