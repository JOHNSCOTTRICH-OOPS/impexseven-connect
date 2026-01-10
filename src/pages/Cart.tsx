import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  MapPin,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";

export default function Cart() {
  const { items, loading, removeFromCart, updateQuantity, itemCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const total = items.reduce((sum, item) => {
    const price = item.product?.price_per_unit || 0;
    return sum + price * item.quantity;
  }, 0);

  const handleProceedToQuote = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    navigate("/quote");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold mb-4">Sign in to view your cart</h1>
            <p className="text-muted-foreground mb-6">
              You need to be signed in to access your shopping cart
            </p>
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

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="led-text">Your</span>{" "}
              <span className="text-gradient-gold">Cart</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-display font-semibold mb-4">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Browse our products and add items to your cart
              </p>
              <Link to="/products">
                <Button variant="led">Browse Products</Button>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="card-glass p-4 rounded-xl flex flex-col md:flex-row gap-4"
                  >
                    {/* Product Image */}
                    <Link to={`/product/${item.product_id}`} className="shrink-0">
                      {item.product?.photo_url ? (
                        <img
                          src={item.product.photo_url}
                          alt={item.product.product_name}
                          className="w-full md:w-32 h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full md:w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-muted-foreground text-sm">No image</span>
                        </div>
                      )}
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            to={`/product/${item.product_id}`}
                            className="font-display text-lg font-semibold text-foreground hover:text-primary transition-colors"
                          >
                            {item.product?.product_name}
                          </Link>
                          <div className="flex items-center gap-1 text-muted-foreground text-sm">
                            <MapPin className="w-3 h-3" />
                            <span>{item.product?.location}</span>
                          </div>
                        </div>
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

                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-xl font-bold text-gradient-led">
                          ${item.product?.price_per_unit?.toFixed(2)}
                        </span>
                        <span className="text-muted-foreground text-sm">/ unit</span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label className="text-sm text-muted-foreground">Qty:</Label>
                          <Input
                            type="number"
                            min={1}
                            value={item.quantity}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value) || 1, item.quantity_unit)
                            }
                            className="w-20 h-8 bg-muted/50 border-border text-sm"
                          />
                        </div>

                        <RadioGroup
                          value={item.quantity_unit}
                          onValueChange={(value) => updateQuantity(item.id, item.quantity, value)}
                          className="flex gap-3"
                        >
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="items" id={`items-${item.id}`} className="w-3 h-3" />
                            <Label htmlFor={`items-${item.id}`} className="text-xs cursor-pointer">
                              Items
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="tons" id={`tons-${item.id}`} className="w-3 h-3" />
                            <Label htmlFor={`tons-${item.id}`} className="text-xs cursor-pointer">
                              Tons
                            </Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="kg" id={`kg-${item.id}`} className="w-3 h-3" />
                            <Label htmlFor={`kg-${item.id}`} className="text-xs cursor-pointer">
                              KG
                            </Label>
                          </div>
                        </RadioGroup>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 ml-auto"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right mt-2">
                        <span className="text-muted-foreground text-sm">Subtotal: </span>
                        <span className="font-semibold text-foreground">
                          ${((item.product?.price_per_unit || 0) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card-glass p-6 rounded-xl sticky top-24">
                  <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({itemCount} items)</span>
                      <span className="text-foreground">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-foreground">Calculated at quote</span>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Estimated Total</span>
                        <span className="text-gradient-gold">${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button variant="led" size="lg" className="w-full" onClick={handleProceedToQuote}>
                    Get Quote
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Final pricing will be provided in the quote
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
