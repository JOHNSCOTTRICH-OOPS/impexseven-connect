import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Send,
  MapPin,
  CheckCircle,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AuthModal from "@/components/auth/AuthModal";
import { getUserFriendlyError } from "@/lib/errorHandler";

export default function Quote() {
  const { items, clearCart, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const total = items.reduce((sum, item) => {
    const price = item.product?.price_per_unit || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before requesting a quote",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const quoteItems = items.map((item) => ({
        product_id: item.product_id,
        product_name: item.product?.product_name,
        quantity: item.quantity,
        quantity_unit: item.quantity_unit,
        price_per_unit: item.product?.price_per_unit,
        location: item.product?.location,
      }));

      // Create quote request
      const { data: quoteData, error: quoteError } = await supabase.from("quote_requests").insert({
        user_id: user.id,
        items: quoteItems,
        total_estimated: total,
        notes,
      }).select().single();

      if (quoteError) throw quoteError;

      // Also create an order for tracking
      const { error: orderError } = await supabase.from("orders").insert({
        user_id: user.id,
        quote_request_id: quoteData.id,
        customer_name: user.email?.split('@')[0] || 'Customer',
        customer_email: user.email || '',
        items: quoteItems,
        total_amount: total,
        notes,
        status: 'pending'
      });

      if (orderError) throw orderError;

      await clearCart();

      toast({
        title: "Quote request submitted!",
        description: "We'll get back to you with a detailed quote soon. Check your profile for order status.",
      });

      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl font-display font-bold mb-4">Sign in to request a quote</h1>
            <Button variant="led" onClick={() => setShowAuthModal(true)}>
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add items to your cart to request a quote</p>
            <Link to="/products">
              <Button variant="led">Browse Products</Button>
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
            to="/cart"
            className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="led-text">Request</span>{" "}
              <span className="text-gradient-gold">Quote</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Review your items and submit your quote request
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Order Items */}
            <div className="card-glass p-6 rounded-xl mb-8">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Order Items ({itemCount})
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg"
                  >
                    {item.product?.photo_url ? (
                      <img
                        src={item.product.photo_url}
                        alt={item.product.product_name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {item.product?.product_name}
                        </h3>
                        {item.product?.verified ? (
                          <Badge className="bg-green-500/90 text-white border-0 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/90 text-black border-0 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Unverified
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin className="w-3 h-3" />
                        <span>{item.product?.location}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-muted-foreground text-sm">
                        {item.quantity} {item.quantity_unit}
                      </p>
                      <p className="font-semibold text-foreground">
                        ${((item.product?.price_per_unit || 0) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border mt-6 pt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Estimated Total:</span>
                  <span className="text-gradient-gold">${total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Final pricing including shipping will be provided in your quote
                </p>
              </div>
            </div>

            {/* Notes */}
            <div className="card-glass p-6 rounded-xl mb-8">
              <Label htmlFor="notes" className="text-foreground text-lg font-semibold mb-4 block">
                Additional Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any special requirements, delivery preferences, or questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-muted/50 border-border min-h-[120px]"
              />
              {!user && (
                <p className="text-amber-500 text-sm mt-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  To submit your quote request, you need to login first
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              variant="led"
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Quote Request
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
