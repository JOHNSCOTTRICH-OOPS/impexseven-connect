
-- Table for product variants/forms that link to other products
CREATE TABLE public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_product_id uuid NOT NULL REFERENCES public.seller_products(id) ON DELETE CASCADE,
  variant_name text NOT NULL,
  photo_url text,
  linked_product_id uuid REFERENCES public.seller_products(id) ON DELETE SET NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Anyone can view variants
CREATE POLICY "Anyone can view product variants"
ON public.product_variants FOR SELECT TO public
USING (true);

-- Admins can insert variants
CREATE POLICY "Admins can insert product variants"
ON public.product_variants FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update variants
CREATE POLICY "Admins can update product variants"
ON public.product_variants FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete variants
CREATE POLICY "Admins can delete product variants"
ON public.product_variants FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
