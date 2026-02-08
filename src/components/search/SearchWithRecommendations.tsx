import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp, Tag, MapPin, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

const popularSearches = [
  "Turmeric",
  "Black Pepper",
  "Cardamom",
  "Basmati Rice",
  "King Fish",
  "Alphonso Mango",
];

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
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (term: string) => {
    onChange(term);
    setIsFocused(false);
    if (navigateOnSelect) {
      navigate(`/products?search=${encodeURIComponent(term)}`);
    }
  };

  const showDropdown = isFocused && !value.trim();

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

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Trending Searches */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              Trending Searches
            </div>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((term) => (
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
