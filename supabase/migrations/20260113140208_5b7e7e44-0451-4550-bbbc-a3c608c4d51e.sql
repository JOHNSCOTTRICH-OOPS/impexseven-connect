-- Make product photos publicly viewable (required for marketplace to work)
-- But keep upload/update/delete restricted to authenticated owners

-- Drop the authenticated-only view policy
DROP POLICY IF EXISTS "Users can view product photos" ON storage.objects;

-- Create a public view policy for product-photos
CREATE POLICY "Anyone can view product photos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'product-photos'
);

-- Note: Upload/Update/Delete policies remain restricted to authenticated users who own the folder