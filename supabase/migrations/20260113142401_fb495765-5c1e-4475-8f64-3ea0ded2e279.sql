-- Create RPC function for admins to update product status (approve/archive)
CREATE OR REPLACE FUNCTION public.update_product_status(_product_id UUID, _status TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only admins can update product status
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can update product status';
  END IF;
  
  -- Validate status
  IF _status NOT IN ('pending', 'active', 'archived') THEN
    RAISE EXCEPTION 'Invalid status. Must be pending, active, or archived';
  END IF;
  
  -- Check if product exists
  IF NOT EXISTS (SELECT 1 FROM public.seller_products WHERE id = _product_id) THEN
    RAISE EXCEPTION 'Product not found';
  END IF;
  
  -- Update product status
  UPDATE public.seller_products
  SET status = _status, updated_at = now()
  WHERE id = _product_id;
  
  RETURN _status;
END;
$$;