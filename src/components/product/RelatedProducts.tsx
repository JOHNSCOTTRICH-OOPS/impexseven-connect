import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle, AlertTriangle, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Product {
  id: string;
  product_name: string;
  location: string;
  photo_url: string | null;
  price_per_unit: number;
  verified: boolean;
  category: string | null;
}

interface RelatedProductsProps {
  currentProductId: string;
  category: string | null;
}

const categoryImages: Record<string, string> = {
  "Fresh Produce": "/placeholder.svg",
  "Spices": "/placeholder.svg",
  "Seafood": "/placeholder.svg",
  "Fruits": "/placeholder.svg",
  "Vegetables": "/placeholder.svg",
  "Grains": "/placeholder.svg",
  "Dairy": "/placeholder.svg",
  "Other": "/placeholder.svg",
};

export default function RelatedProducts({ currentProductId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRelatedProducts();
  }, [currentProductId, category]);

  const fetchRelatedProducts = async () => {
    try {
      let query = supabase
        .from("seller_products")
        .select("id, product_name, location, photo_url, price_per_unit, verified, category")
        .neq("id", currentProductId)
        .eq("status", "active")
        .limit(4);

      // If category exists, prioritize same category products
      if (category) {
        query = query.eq("category", category);
      }

      const { data, error } = await query;

      if (error) throw error;

      // If we didn't get enough products from the same category, fetch more
      if (data && data.length < 4) {
        const { data: moreProducts, error: moreError } = await supabase
          .from("seller_products")
          .select("id, product_name, location, photo_url, price_per_unit, verified, category")
          .neq("id", currentProductId)
          .eq("status", "active")
          .not("id", "in", `(${data.map(p => p.id).join(",")})`)
          .limit(4 - data.length);

        if (!moreError && moreProducts) {
          setProducts([...data, ...moreProducts]);
        } else {
          setProducts(data || []);
        }
      } else {
        setProducts(data || []);
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product: Product) => {
    if (product.photo_url) return product.photo_url;
    return categoryImages[product.category || "Other"] || categoryImages["Other"];
  };

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="font-display text-2xl font-bold text-foreground mb-8">Related Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 bg-muted rounded-xl mb-3" />
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="font-display text-2xl font-bold text-foreground mb-8">Related Products</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="group card-glass rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-36 md:h-44 overflow-hidden">
              <img
                src={getProductImage(product)}
                alt={product.product_name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              {/* Verification Badge */}
              <div className="absolute top-2 right-2">
                {product.verified ? (
                  <Badge className="bg-green-500/90 text-white border-0 flex items-center gap-1 text-xs px-2 py-0.5">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/90 text-black border-0 flex items-center gap-1 text-xs px-2 py-0.5"
                  >
                    <AlertTriangle className="w-3 h-3" />
                    Unverified
                  </Badge>
                )}
              </div>

              {/* Category */}
              <Badge className="absolute top-2 left-2 bg-primary/80 text-xs">
                {product.category || "Other"}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-3 md:p-4">
              <h3 className="font-semibold text-foreground text-sm md:text-base line-clamp-1 mb-1">
                {product.product_name}
              </h3>
              
              <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                <MapPin className="w-3 h-3" />
                <span className="line-clamp-1">{product.location}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-primary text-sm md:text-base">
                  ${product.price_per_unit.toFixed(2)}
                </span>
                <Link to={`/product/${product.id}`}>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-primary/10 hover:text-primary">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
