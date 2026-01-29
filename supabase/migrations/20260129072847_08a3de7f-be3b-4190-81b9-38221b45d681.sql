-- Drop and recreate view with SECURITY INVOKER (default, but explicit for clarity)
DROP VIEW IF EXISTS public.seller_products_with_email;

CREATE VIEW public.seller_products_with_email 
WITH (security_invoker = true)
AS
SELECT 
  sp.*,
  p.email as user_email,
  p.full_name as user_name
FROM public.seller_products sp
LEFT JOIN public.profiles p ON sp.user_id = p.user_id;