import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MapPin, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";

interface Product {
  id: string;
  product_name: string;
  location: string;
  photo_url: string | null;
  price_per_unit: number;
  verified: boolean;
  category: string | null;
  min_production: number;
  max_production: number;
}

const categories = ["All", "Spices", "Seafood", "Fruits", "Vegetables", "Other"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("seller_products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (productId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    addToCart(productId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="led-dot" />
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Marketplace
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-foreground">Browse </span>
              <span className="text-gradient-led">Products</span>
            </h1>

            <p className="text-muted-foreground text-lg">
              Discover premium Indian products from verified suppliers
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium text-sm uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground led-glow"
                    : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card-glass rounded-2xl h-96 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group card-glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
                >
                  {/* Image */}
                  <Link to={`/product/${product.id}`} className="block relative h-56 overflow-hidden">
                    {product.photo_url ? (
                      <img
                        src={product.photo_url}
                        alt={product.product_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <span className="text-muted-foreground">No image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                    
                    {/* Verified/Unverified Badge */}
                    <div className="absolute top-4 right-4">
                      {product.verified ? (
                        <Badge className="bg-green-500/90 text-white border-0 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-yellow-500/90 text-black border-0 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Unverified
                        </Badge>
                      )}
                    </div>

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium uppercase tracking-wider">
                      {product.category || "Other"}
                    </span>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {product.product_name}
                      </h3>
                    </Link>
                    
                    {/* Location */}
                    <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{product.location}</span>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-2xl font-bold text-gradient-led">
                        ${product.price_per_unit.toFixed(2)}
                      </span>
                      <span className="text-muted-foreground text-sm ml-1">/ unit</span>
                    </div>

                    {/* Production Range */}
                    <p className="text-muted-foreground text-xs mb-4">
                      Available: {product.min_production} - {product.max_production} units
                    </p>

                    {/* Actions */}
                    <Button
                      variant="led"
                      size="sm"
                      className="w-full"
                      onClick={() => handleAddToCart(product.id)}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
