-- Create storage bucket for about page images
INSERT INTO storage.buckets (id, name, public) VALUES ('about-images', 'about-images', true);

-- Allow anyone to view about images
CREATE POLICY "About images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'about-images');

-- Allow admin to upload about images
CREATE POLICY "Admins can upload about images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'about-images' 
  AND (SELECT public.is_admin())
);

-- Allow admin to update about images
CREATE POLICY "Admins can update about images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'about-images' 
  AND (SELECT public.is_admin())
);

-- Allow admin to delete about images
CREATE POLICY "Admins can delete about images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'about-images' 
  AND (SELECT public.is_admin())
);

-- Create a table to store about page settings
CREATE TABLE public.about_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on about_settings
ALTER TABLE public.about_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read about settings
CREATE POLICY "Anyone can view about settings"
ON public.about_settings FOR SELECT
USING (true);

-- Only admins can modify about settings
CREATE POLICY "Admins can insert about settings"
ON public.about_settings FOR INSERT
WITH CHECK ((SELECT public.is_admin()));

CREATE POLICY "Admins can update about settings"
ON public.about_settings FOR UPDATE
USING ((SELECT public.is_admin()));

CREATE POLICY "Admins can delete about settings"
ON public.about_settings FOR DELETE
USING ((SELECT public.is_admin()));

-- Insert default settings
INSERT INTO public.about_settings (setting_key, setting_value) VALUES
('company_photo_url', NULL),
('founder_photo_url', NULL);