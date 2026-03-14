import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ShoppingCart,
  MapPin,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Info,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import RelatedProducts from "@/components/product/RelatedProducts";
import IncotermsSelector from "@/components/product/IncotermsSelector";
import AdminProductEditModal from "@/components/product/AdminProductEditModal";

const ADMIN_EMAIL = "njohnscottrich@gmail.com";

interface Product {
  id: string;
  user_id: string;
  product_name: string;
  description: string | null;
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
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [quantityUnit, setQuantityUnit] = useState("items");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // Incoterms state
  const [incoterm, setIncoterm] = useState("exw");
  const [portLocation, setPortLocation] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  
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
      if (!user?.email) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(user.email === ADMIN_EMAIL);
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

  const generateDescription = (p: Product) => {
    const cat = p.category || "premium";
    const loc = p.location || "India";
    return `${p.product_name} is a high-quality ${cat.toLowerCase()} product sourced directly from trusted suppliers in ${loc}. This product is carefully selected to meet international export standards, ensuring freshness, purity, and consistency in every batch. Available in quantities ranging from ${p.min_production} to ${p.max_production} Tons, it is ideal for bulk buyers, wholesalers, and international traders looking for reliable supply chains. ${p.expiry_days ? `With a shelf life of ${p.expiry_days} days, it maintains optimal quality throughout storage and transit.` : ''} Our rigorous quality control processes guarantee that each shipment meets the highest standards of food safety and compliance. Whether you are sourcing for retail distribution, food manufacturing, or hospitality, ${p.product_name} offers exceptional value and consistent quality that your business can depend on.`;
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

  const handleBuyNow = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (product) {
      addToCart(product.id, quantity, quantityUnit);
      navigate("/cart");
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
            <div className="lg:col-span-1">
              <div className="relative">
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
                    <Badge className="bg-primary/90 text-primary-foreground border-0 flex items-center gap-1 text-sm px-3 py-1">
                      <CheckCircle className="w-4 h-4" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-secondary/90 text-secondary-foreground border-0 flex items-center gap-1 text-sm px-3 py-1"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      Unverified
                    </Badge>
                  )}
                </div>

                {/* Category */}
                <Badge className="absolute top-4 left-4 bg-amber-500 text-black font-bold shadow-lg">
                  {product.category || "Other"}
                </Badge>
              </div>

              {/* Price Disclaimer - Under Picture */}
              <div className="p-3 rounded-xl bg-muted/50 border border-border mt-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-medium text-foreground">Price Disclaimer:</span> The displayed price is indicative and may vary. The final price will be confirmed when you receive the official invoice.
                  </p>
                </div>
              </div>

              {/* Incoterms Info - Under Picture */}
              <p className="text-xs text-muted-foreground mt-3">
                {incoterm === "exw" && "Ex Works: Buyer arranges all transportation from seller's location."}
                {incoterm === "fob" && "FOB: Seller delivers to the port, buyer arranges shipping from there."}
                {incoterm === "cif" && "CIF: Seller covers cost, insurance & freight to destination country."}
              </p>
            </div>

            {/* Details Section - Scrollable with big description */}
            <div className="lg:col-span-1 lg:max-h-[600px] lg:overflow-y-auto lg:pr-2 custom-scrollbar">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
                {product.product_name}
              </h1>

              {/* Location */}
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5" />
                <span className="text-base">{product.location}</span>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Product Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {product.description || generateDescription(product)}
                </p>
              </div>

              {/* Incoterms Selection */}
              <div className="mt-6">
                <IncotermsSelector
                  value={incoterm}
                  onChange={setIncoterm}
                  portLocation={portLocation}
                  onPortLocationChange={setPortLocation}
                  destinationCountry={destinationCountry}
                  onDestinationCountryChange={setDestinationCountry}
                />
              </div>

              {/* Admin Verification Toggle */}
              {isAdmin && (
                <div className="mt-4">
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
                </div>
              )}
            </div>

            {/* Right Column: Price + Quantity + Actions */}
            <div className="lg:col-span-1">
              <div className="card-glass p-6 rounded-2xl sticky top-28 space-y-5">
                {/* Price */}
                <div className="text-center">
                  <span className="text-sm text-muted-foreground uppercase tracking-wider">Price per Ton</span>
                  <div className="mt-2">
                    <span className="text-4xl font-bold text-gradient-led">
                      ${product.price_per_unit.toFixed(2)}
                    </span>
                  </div>
                </div>

                <hr className="border-border" />

                {/* Quantity */}
                <div>
                  <Label className="text-foreground mb-2 block text-sm">Quantity (Tons)</Label>
                  <div className="flex items-center gap-3">
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
                    <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">Tons</span>
                  </div>
                </div>

                {/* Estimated Total */}
                <div className="flex justify-between items-center p-3 rounded-xl bg-muted/30">
                  <span className="text-muted-foreground text-sm">Estimated Total:</span>
                  <span className="text-xl font-bold text-gradient-gold">
                    ${(product.price_per_unit * quantity).toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart */}
                <Button variant="led" size="lg" className="w-full" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>

                {/* Buy Now */}
                <Button variant="gold" size="lg" className="w-full" onClick={handleBuyNow}>
                  <Zap className="w-5 h-5 mr-2" />
                  Buy Now
                </Button>
              </div>
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
      
      {/* Admin Edit Modal */}
      <AdminProductEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        product={product}
        onProductUpdated={fetchProduct}
      />
    </div>
  );
}
