import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ShoppingCart,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Package,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import ByproductsFlowchart from "@/components/product/ByproductsFlowchart";
import RelatedProducts from "@/components/product/RelatedProducts";

interface Product {
  id: string;
  user_id: string;
  product_name: string;
  location: string;
  photo_url: string | null;
  price_per_unit: number;
  verified: boolean;
  category: string | null;
  min_production: number;
  max_production: number;
  expiry_days: number | null;
  expiry_date: string | null;
  created_at: string;
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [quantityUnit, setQuantityUnit] = useState("items");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Check admin status when user changes
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error) throw error;
        setIsAdmin(data === true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("seller_products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (product) {
      addToCart(product.id, quantity, quantityUnit);
    }
  };

  const toggleVerification = async () => {
    if (!product || !isAdmin) return;

    setVerifying(true);
    try {
      // Use secure RPC function that validates admin role server-side
      const { data, error } = await supabase.rpc('toggle_product_verification', {
        _product_id: product.id
      });

      if (error) throw error;

      const newVerifiedStatus = data === true;
      setProduct({ ...product, verified: newVerifiedStatus });
      toast({
        title: newVerifiedStatus ? "Product verified" : "Product unverified",
        description: `Product has been marked as ${newVerifiedStatus ? "verified" : "unverified"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <div className="animate-pulse">
              <div className="h-96 bg-muted rounded-2xl mb-8" />
              <div className="h-8 bg-muted rounded w-1/2 mb-4" />
              <div className="h-4 bg-muted rounded w-1/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-display font-bold mb-4">Product not found</h1>
            <Link to="/products">
              <Button variant="led">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Link */}
          <Link
            to="/products"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Image Section */}
            <div className="relative lg:col-span-1">
              {product.photo_url ? (
                <img
                  src={product.photo_url}
                  alt={product.product_name}
                  className="w-full h-[400px] object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-[400px] bg-muted rounded-2xl flex items-center justify-center">
                  <span className="text-muted-foreground text-lg">No image available</span>
                </div>
              )}

              {/* Verification Badge */}
              <div className="absolute top-4 right-4">
                {product.verified ? (
                  <Badge className="bg-green-500/90 text-white border-0 flex items-center gap-1 text-sm px-3 py-1">
                    <CheckCircle className="w-4 h-4" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/90 text-black border-0 flex items-center gap-1 text-sm px-3 py-1"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    Unverified
                  </Badge>
                )}
              </div>

              {/* Category */}
              <Badge className="absolute top-4 left-4 bg-primary/80">
                {product.category || "Other"}
              </Badge>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-1">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                {product.product_name}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-base">{product.location}</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <span className="text-3xl font-bold text-gradient-led">
                  ${product.price_per_unit.toFixed(2)}
                </span>
                <span className="text-muted-foreground text-base ml-2">/ unit</span>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="card-glass p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-xs">Available Range</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {product.min_production} - {product.max_production} units
                  </p>
                </div>

                <div className="card-glass p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs">Shelf Life</span>
                  </div>
                  <p className="font-semibold text-foreground text-sm">
                    {product.expiry_days ? `${product.expiry_days} days` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-3 mb-6">
                <div>
                  <Label className="text-foreground mb-2 block text-sm">Quantity</Label>
                  <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === '') {
                        setQuantity(0);
                      } else {
                        setQuantity(parseInt(val) || 0);
                      }
                    }}
                    onBlur={() => {
                      if (quantity < 1) setQuantity(1);
                    }}
                    className="bg-muted/50 border-border"
                  />
                </div>

                <div>
                  <Label className="text-foreground mb-2 block text-sm">Unit Type</Label>
                  <RadioGroup
                    value={quantityUnit}
                    onValueChange={setQuantityUnit}
                    className="flex gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="items" id="items" />
                      <Label htmlFor="items" className="cursor-pointer text-sm">
                        Items
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tons" id="tons" />
                      <Label htmlFor="tons" className="cursor-pointer text-sm">
                        Tons
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kg" id="kg" />
                      <Label htmlFor="kg" className="cursor-pointer text-sm">
                        Kilograms
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Estimated Total */}
              <div className="card-glass p-3 rounded-xl mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm">Estimated Total:</span>
                  <span className="text-xl font-bold text-gradient-gold">
                    ${(product.price_per_unit * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button variant="led" size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                {/* Admin Verification Toggle */}
                {isAdmin && (
                  <Button
                    variant={product.verified ? "outline" : "gold"}
                    size="lg"
                    className="w-full"
                    onClick={toggleVerification}
                    disabled={verifying}
                  >
                    {product.verified ? (
                      <>
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        Mark as Unverified
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Mark as Verified
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Byproducts Flowchart Section */}
            <div className="lg:col-span-1">
              <ByproductsFlowchart 
                productName={product.product_name} 
                category={product.category} 
              />
            </div>
          </div>

          {/* Related Products Section */}
          <RelatedProducts 
            currentProductId={product.id} 
            category={product.category} 
          />
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
