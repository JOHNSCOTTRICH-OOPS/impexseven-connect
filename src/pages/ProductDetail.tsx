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

// Owner user ID for verification access
const OWNER_USER_ID = "f10ea91f-f1e1-4479-b13d-2fd7c97b6961";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [quantityUnit, setQuantityUnit] = useState("items");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

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
    if (!product || user?.id !== OWNER_USER_ID) return;

    setVerifying(true);
    try {
      const { error } = await supabase
        .from("seller_products")
        .update({ verified: !product.verified })
        .eq("id", product.id);

      if (error) throw error;

      setProduct({ ...product, verified: !product.verified });
      toast({
        title: product.verified ? "Product unverified" : "Product verified",
        description: `Product has been marked as ${product.verified ? "unverified" : "verified"}`,
      });
    } catch (error: any) {
      console.error("Error updating verification:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update verification status",
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

  const isOwner = user?.id === OWNER_USER_ID;

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

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="relative">
              {product.photo_url ? (
                <img
                  src={product.photo_url}
                  alt={product.product_name}
                  className="w-full h-[500px] object-cover rounded-2xl"
                />
              ) : (
                <div className="w-full h-[500px] bg-muted rounded-2xl flex items-center justify-center">
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
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                {product.product_name}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">{product.location}</span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <span className="text-4xl font-bold text-gradient-led">
                  ${product.price_per_unit.toFixed(2)}
                </span>
                <span className="text-muted-foreground text-lg ml-2">/ unit</span>
              </div>

              {/* Product Info */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="card-glass p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Available Range</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {product.min_production} - {product.max_production} units
                  </p>
                </div>

                <div className="card-glass p-4 rounded-xl">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Shelf Life</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {product.expiry_days ? `${product.expiry_days} days` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Quantity Selection */}
              <div className="space-y-4 mb-8">
                <div>
                  <Label className="text-foreground mb-2 block">Quantity</Label>
                  <Input
                    type="number"
                    min={product.min_production}
                    max={product.max_production}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="bg-muted/50 border-border"
                  />
                </div>

                <div>
                  <Label className="text-foreground mb-2 block">Unit Type</Label>
                  <RadioGroup
                    value={quantityUnit}
                    onValueChange={setQuantityUnit}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="items" id="items" />
                      <Label htmlFor="items" className="cursor-pointer">
                        Items
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="tons" id="tons" />
                      <Label htmlFor="tons" className="cursor-pointer">
                        Tons
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="kg" id="kg" />
                      <Label htmlFor="kg" className="cursor-pointer">
                        Kilograms
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Estimated Total */}
              <div className="card-glass p-4 rounded-xl mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Estimated Total:</span>
                  <span className="text-2xl font-bold text-gradient-gold">
                    ${(product.price_per_unit * quantity).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <Button variant="led" size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                {/* Owner Verification Toggle */}
                {isOwner && (
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
          </div>
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
