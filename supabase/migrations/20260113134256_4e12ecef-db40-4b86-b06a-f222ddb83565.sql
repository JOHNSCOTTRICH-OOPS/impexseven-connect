-- Fix CLIENT_SIDE_AUTH: Product verification should only be allowed for admins via RPC

-- Create a secure RPC function for toggling product verification
-- Only admins can verify/unverify products
CREATE OR REPLACE FUNCTION public.toggle_product_verification(_product_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _current_verified BOOLEAN;
BEGIN
  -- Only admins can verify products
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can verify products';
  END IF;
  
  -- Get current verification status
  SELECT verified INTO _current_verified
  FROM public.seller_products
  WHERE id = _product_id;
  
  IF _current_verified IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Toggle verification status
  UPDATE public.seller_products
  SET verified = NOT _current_verified, updated_at = now()
  WHERE id = _product_id;
  
  RETURN NOT _current_verified;
END;
$$;

-- Drop existing update policy
DROP POLICY IF EXISTS "Users can update their own products" ON public.seller_products;

-- Create new UPDATE policy that prevents users from modifying verified column
-- Users can only update their own products (except verified column)
CREATE POLICY "Users can update their own products except verified"
ON public.seller_products
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
);

-- Create a function to check if user is admin for frontend use
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;