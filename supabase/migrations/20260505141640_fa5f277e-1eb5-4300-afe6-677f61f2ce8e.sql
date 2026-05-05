ALTER TABLE public.seller_products 
  ADD COLUMN IF NOT EXISTS min_price numeric,
  ADD COLUMN IF NOT EXISTS max_price numeric;

UPDATE public.seller_products 
  SET min_price = COALESCE(min_price, price_per_unit),
      max_price = COALESCE(max_price, price_per_unit)
  WHERE min_price IS NULL OR max_price IS NULL;