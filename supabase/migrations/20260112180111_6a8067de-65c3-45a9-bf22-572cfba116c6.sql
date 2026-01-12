-- Fix support_requests RLS policies

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create support requests" ON public.support_requests;
DROP POLICY IF EXISTS "Users can view their own requests" ON public.support_requests;

-- Create new INSERT policy requiring authenticated users
CREATE POLICY "Authenticated users can create support requests"
ON public.support_requests
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create new SELECT policy with proper access control
-- Users can view their own requests, admins can view all
CREATE POLICY "Users can view their own requests or admins can view all"
ON public.support_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id OR
  public.has_role(auth.uid(), 'admin')
);