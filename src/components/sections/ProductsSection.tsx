import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Eye, ArrowRight, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import spicesImg from "@/assets/spices.jpg";
import seafoodImg from "@/assets/seafood.jpg";
import fruitsImg from "@/assets/fruits.jpg";
import vegetablesImg from "@/assets/vegetables.jpg";
const categories = ["All", "Spices", "Seafood", "Fruits", "Vegetables"];

// Fallback images for products without photos
const categoryImages: Record<string, string> = {
  Spices: spicesImg,
  Seafood: seafoodImg,
  Fruits: fruitsImg,
  Vegetables: vegetablesImg,
};

interface Product {
  id: string;
  product_name: string;
  category: string | null;
  location: string;
  price_per_unit: number;
  min_price: number | null;
  max_price: number | null;
  photo_url: string | null;
  verified: boolean;
}

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("seller_products")
        .select("id, product_name, category, location, price_per_unit, photo_url, verified")
        .eq("status", "active")
        .limit(6);

      if (!error && data) {
        setProducts(data);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const getProductImage = (product: Product) => {
    if (product.photo_url) return product.photo_url;
    return categoryImages[product.category || "Spices"] || spicesImg;
  };

  return (
    <section id="products" className="py-24 relative bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="led-dot" />
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Our Products
            </span>
          </div>

          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="text-foreground">Premium </span>
            <span className="text-gradient-led">Indian Products</span>
          </h2>

          <p className="text-muted-foreground text-lg">
            Discover our curated selection of India's finest spices, seafood, 
            fruits, and vegetables — all meeting international quality standards.
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
          <div className="text-center text-muted-foreground py-12">Loading products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No products available yet.</p>
            <Link to="/products">
              <Button variant="led">
                Browse Marketplace
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Link 
                key={product.id}
                to={`/product/${product.id}`}
                className="group card-glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 block"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={getProductImage(product)}
                    alt={product.product_name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                  
                  {/* Category Badge - Red */}
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    {product.category || "Other"}
                  </span>
                  
                  {/* Verified/Unverified Badge */}
                  <Badge 
                    variant={product.verified ? "default" : "destructive"}
                    className="absolute top-4 right-4"
                  >
                    {product.verified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {product.product_name}
                  </h3>
                  
                  {/* Location */}
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-2">
                    <MapPin className="w-4 h-4" />
                    <span>{product.location}</span>
                  </div>
                  
                  {/* Price */}
                  <p className="text-primary font-semibold text-lg mb-2">
                    ${product.price_per_unit.toFixed(2)} / Ton
                  </p>

                  {/* Actions - View button only since whole card is clickable */}
                  <div className="flex gap-3">
                    <Button variant="led" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Product
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View All Products Link */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Link to="/products">
              <Button variant="led" size="lg">
                View All Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
