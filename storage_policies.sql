-- Create the Storage Bucket if it does not exist, and set it to public
INSERT INTO storage.buckets (id, name, public)
VALUES ('wedding-gallery', 'wedding-gallery', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Enable RLS on storage objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to prevent errors when re-running)
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Anon upload access" ON storage.objects;
DROP POLICY IF EXISTS "Anon update access" ON storage.objects;
DROP POLICY IF EXISTS "Anon delete access" ON storage.objects;

-- Allow public to select/read files
CREATE POLICY "Public read access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'wedding-gallery' );

-- Allow anon/all to insert/upload files
-- NOTE: Since your app's admin login is local (localStorage), the actual Supabase requests use the 'anon' role
CREATE POLICY "Anon upload access" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'wedding-gallery' );

-- Allow anon/all to update files
CREATE POLICY "Anon update access" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'wedding-gallery' );

-- Allow anon/all to delete files
CREATE POLICY "Anon delete access" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'wedding-gallery' );
