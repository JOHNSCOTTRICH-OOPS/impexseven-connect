
CREATE TABLE public.password_reset_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  new_password TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a reset request
CREATE POLICY "Anyone can request password reset"
ON public.password_reset_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Only admins can view all requests
CREATE POLICY "Admins can view reset requests"
ON public.password_reset_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can update requests
CREATE POLICY "Admins can update reset requests"
ON public.password_reset_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_password_reset_requests_updated_at
  BEFORE UPDATE ON public.password_reset_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
