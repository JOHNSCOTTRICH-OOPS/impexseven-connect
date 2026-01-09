-- Create seller_products table for the 4-step wizard form
CREATE TABLE public.seller_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    
    -- Step 1: Product Info
    product_name TEXT NOT NULL,
    location TEXT NOT NULL,
    
    -- Step 2: Product Details
    photo_url TEXT,
    min_production INTEGER NOT NULL,
    max_production INTEGER NOT NULL,
    
    -- Step 3: Pricing & Expiry
    price_per_unit DECIMAL(10,2) NOT NULL,
    expiry_days INTEGER,
    expiry_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending'
);

-- Enable Row Level Security
ALTER TABLE public.seller_products ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own products" 
ON public.seller_products 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own products" 
ON public.seller_products 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own products" 
ON public.seller_products 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own products" 
ON public.seller_products 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_seller_products_updated_at
BEFORE UPDATE ON public.seller_products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for product photos
INSERT INTO storage.buckets (id, name, public) VALUES ('product-photos', 'product-photos', true);

-- Create storage policies for product photos
CREATE POLICY "Product photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'product-photos');

CREATE POLICY "Authenticated users can upload product photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'product-photos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own product photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'product-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own product photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'product-photos' AND auth.uid()::text = (storage.foldername(name))[1]);