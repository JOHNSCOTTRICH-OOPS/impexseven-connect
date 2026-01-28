-- Create orders table for tracking quote/order status
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quote_request_id uuid REFERENCES public.quote_requests(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  items jsonb NOT NULL,
  total_amount numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Users can create orders
CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update orders (for confirming)
CREATE POLICY "Admins can update orders"
ON public.orders FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Create function for admin to confirm/update order status
CREATE OR REPLACE FUNCTION public.update_order_status(_order_id uuid, _status text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can update order status';
  END IF;
  
  IF _status NOT IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') THEN
    RAISE EXCEPTION 'Invalid status';
  END IF;
  
  UPDATE public.orders
  SET status = _status, updated_at = now()
  WHERE id = _order_id;
  
  RETURN _status;
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();