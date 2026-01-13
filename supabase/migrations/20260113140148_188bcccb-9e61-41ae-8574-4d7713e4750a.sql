-- Fix storage policies - drop existing ones first with IF EXISTS
DROP POLICY IF EXISTS "Users can update their own product photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own product photos" ON storage.objects;

-- Recreate the policies that weren't created due to the error
CREATE POLICY "Users can update their own product photos"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own product photos"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Recreate view policy (it was dropped before the error)
DROP POLICY IF EXISTS "Users can view product photos" ON storage.objects;
CREATE POLICY "Users can view product photos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'product-photos' AND
  (
    -- Owner can always view their photos
    auth.uid()::text = (storage.foldername(name))[1]
    OR
    -- Others can view if the photo is associated with a product
    EXISTS (
      SELECT 1 FROM public.seller_products
      WHERE photo_url LIKE '%' || storage.filename(name) || '%'
    )
  )
);