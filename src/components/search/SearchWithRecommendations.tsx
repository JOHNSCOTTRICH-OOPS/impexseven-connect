import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Tag, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.jpeg";

interface ProductSuggestion {
  id: string;
  product_name: string;
  category: string | null;
  location: string;
}

const categoryRecommendations = [
  { label: "Spices", icon: Tag },
  { label: "Seafood", icon: Tag },
  { label: "Fruits", icon: Tag },
  { label: "Vegetables", icon: Tag },
  { label: "Grains", icon: Tag },
];

const locationRecommendations = [
  "Kerala",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Maharashtra",
];

interface SearchWithRecommendationsProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  navigateOnSelect?: boolean;
  variant?: "default" | "hero";
}

const SearchWithRecommendations = ({
  value,
  onChange,
  placeholder = "Search products by name, location, or category...",
  className,
  navigateOnSelect = false,
  variant = "default",
}: SearchWithRecommendationsProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [allProducts, setAllProducts] = useState<ProductSuggestion[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fetch all active products once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("seller_products")
        .select("id, product_name, category, location")
        .eq("status", "active")
        .order("created_at", { ascending: false });
      if (data) setAllProducts(data);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Trending = unique product names from actual products (up to 6)
  const trendingNames = useMemo(() => {
    const seen = new Set<string>();
    return allProducts
      .filter((p) => {
        if (seen.has(p.product_name)) return false;
        seen.add(p.product_name);
        return true;
      })
      .slice(0, 6)
      .map((p) => p.product_name);
  }, [allProducts]);

  // Autocomplete: filter products matching typed query
  const autocompleteSuggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    const seen = new Set<string>();
    return allProducts
      .filter((p) => {
        const name = p.product_name.toLowerCase();
        if (!name.includes(q)) return false;
        if (seen.has(name)) return false;
        seen.add(name);
        return true;
      })
      .slice(0, 8);
  }, [value, allProducts]);

  const handleSelect = (term: string) => {
    onChange(term);
    setIsFocused(false);
    if (navigateOnSelect) {
      navigate(`/products?search=${encodeURIComponent(term)}`);
    }
  };

  const showEmptyDropdown = isFocused && !value.trim();
  const showAutocomplete = isFocused && value.trim().length > 0 && autocompleteSuggestions.length > 0;

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span className="font-bold text-primary">{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        className={cn(
          "pl-12 pr-4 py-3 h-12 bg-card border-border rounded-full text-foreground placeholder:text-muted-foreground focus:border-primary/50",
          variant === "hero" && "h-14 text-base bg-background/80 backdrop-blur-sm border-primary/20 shadow-lg"
        )}
      />

      {/* Autocomplete suggestions while typing */}
      {showAutocomplete && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          <div className="p-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              <Search className="w-3.5 h-3.5" />
              Suggestions
            </div>
            {autocompleteSuggestions.map((product) => (
              <button
                key={product.id}
                onClick={() => handleSelect(product.product_name)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted transition-colors text-left"
              >
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground truncate">
                    {highlightMatch(product.product_name, value.trim())}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {product.category && (
                      <span className="text-primary">{product.category}</span>
                    )}
                    {product.category && product.location && <span>·</span>}
                    <span>{product.location}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Empty state dropdown with trending, categories, locations */}
      {showEmptyDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Logo */}
          <div className="p-4 border-b border-border flex justify-center">
            <img src={logo} alt="ImpexSeven Logo" className="h-12 object-contain" />
          </div>
          {/* Trending Searches from real products */}
          {trendingNames.length > 0 && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending Products
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingNames.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelect(term)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <Tag className="w-3.5 h-3.5" />
              Browse by Category
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categoryRecommendations.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => handleSelect(cat.label)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-muted text-sm text-foreground transition-colors text-left"
                >
                  <cat.icon className="w-3.5 h-3.5 text-primary" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Popular Locations */}
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <MapPin className="w-3.5 h-3.5" />
              Popular Origins
            </div>
            <div className="flex flex-wrap gap-2">
              {locationRecommendations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleSelect(loc)}
                  className="px-3 py-1.5 rounded-full border border-border text-muted-foreground text-sm hover:border-primary/50 hover:text-primary transition-colors"
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchWithRecommendations;
