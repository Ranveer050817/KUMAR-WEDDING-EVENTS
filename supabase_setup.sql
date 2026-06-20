-- SUPABASE STORAGE & DATABASE RLS POLICIES FOR WEDDING GALLERY APP

-- 1. Create the Storage Bucket if it does not exist, and set it to public
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-gallery', 'wedding-gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing overlapping policies (optional, but protects against duplicates if run multiple times)
DROP POLICY IF EXISTS "Public View Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Images" ON storage.objects;

-- 2. Allow public users to view images
CREATE POLICY "Public View Images" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'wedding-gallery' );

-- 3. Allow Admin to Upload, Update, and Delete Images
-- Note: Since the application handles Admin login via local React state and standard Supabase anon key, 
-- we must use the anon role for these policies, OR rely on a custom auth setup if used in the backend.
CREATE POLICY "Admin Upload Images" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'wedding-gallery' );

CREATE POLICY "Admin Update Images" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'wedding-gallery' );

CREATE POLICY "Admin Delete Images" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'wedding-gallery' );

-- ==========================================
-- 4. DATABASE TABLES POLICIES
-- ==========================================

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
