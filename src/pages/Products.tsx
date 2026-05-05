import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  Archive, 
  Clock, 
  CheckSquare,
  RotateCcw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SearchWithRecommendations from "@/components/search/SearchWithRecommendations";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import CategorySelector from "@/components/product/CategorySelector";

interface Product {
  id: string;
  product_name: string;
  location: string;
  photo_url: string | null;
  price_per_unit: number;
  min_price: number | null;
  max_price: number | null;
  verified: boolean;
  category: string | null;
  min_production: number;
  max_production: number;
  status: string;
}

const categories = ["All", "Spices", "Seafood", "Fruits", "Vegetables", "Other"];

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTab, setActiveTab] = useState("active");
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const q = searchParams.get("search");
    if (q) setSearchQuery(q);
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
    checkAdminStatus();
  }, [user]);

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

  const updateProductStatus = async (productId: string, newStatus: string) => {
    setActionLoading(productId);
    try {
      const { error } = await supabase.rpc('update_product_status', {
        _product_id: productId,
        _status: newStatus
      });

      if (error) throw error;

      // Update local state
      setProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, status: newStatus } : p)
      );

      toast({
        title: "Status updated",
        description: `Product has been ${newStatus === 'active' ? 'approved' : newStatus === 'archived' ? 'archived' : 'set to pending'}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Filter by status, category, and search query
  const getFilteredProducts = (status: string) => {
    let filtered = products.filter(p => p.status === status);
    if (activeCategory !== "All") {
      filtered = filtered.filter(p => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.product_name.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query) ||
        (p.category && p.category.toLowerCase().includes(query))
      );
    }
    return filtered;
  };

  const activeProducts = getFilteredProducts('active');
  const pendingProducts = getFilteredProducts('pending');
  const archivedProducts = getFilteredProducts('archived');

  const handleAddToCart = (productId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    addToCart(productId);
  };

  const handleCategoryChange = (productId: string, newCategory: string) => {
    setProducts(prev =>
      prev.map(p => p.id === productId ? { ...p, category: newCategory } : p)
    );
  };

  const renderProductCard = (product: Product, showAdminActions: boolean = false) => (
    <Link
      key={product.id}
      to={`/product/${product.id}`}
      className="group card-glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 block"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
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
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {product.status === 'pending' ? (
            <Badge variant="outline" className="bg-orange-500/90 text-white border-0 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Pending
            </Badge>
          ) : product.status === 'archived' ? (
            <Badge variant="outline" className="bg-gray-500/90 text-white border-0 flex items-center gap-1">
              <Archive className="w-3 h-3" />
              Archived
            </Badge>
          ) : product.verified ? (
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

        {/* Category Badge - Red */}
        <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
          {product.category || "Other"}
        </span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
          {product.product_name}
        </h3>
        
        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
          <MapPin className="w-4 h-4" />
          <span>{product.location}</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-2xl font-bold text-gradient-led">
            {formatPriceRange(product.min_price, product.max_price, product.price_per_unit)}
          </span>
          <span className="text-muted-foreground text-sm ml-1">/ Ton</span>
        </div>

        {/* Production Range */}
        <p className="text-muted-foreground text-xs mb-4">
          Available: {product.min_production} - {product.max_production} Tons
        </p>

        {/* Actions */}
        {showAdminActions && isAdmin ? (
          <div className="space-y-3" onClick={(e) => e.preventDefault()}>
            {/* Category Selector for Admin */}
            <CategorySelector
              productId={product.id}
              currentCategory={product.category}
              onCategoryChanged={(newCategory) => handleCategoryChange(product.id, newCategory)}
            />
            
            {product.status === 'pending' && (
              <div className="flex gap-2">
                <Button
                  variant="led"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    updateProductStatus(product.id, 'active');
                  }}
                  disabled={actionLoading === product.id}
                >
                  <CheckSquare className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.preventDefault();
                    updateProductStatus(product.id, 'archived');
                  }}
                  disabled={actionLoading === product.id}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  Archive
                </Button>
              </div>
            )}
            {product.status === 'active' && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  updateProductStatus(product.id, 'archived');
                }}
                disabled={actionLoading === product.id}
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive Product
              </Button>
            )}
            {product.status === 'archived' && (
              <Button
                variant="led"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.preventDefault();
                  updateProductStatus(product.id, 'active');
                }}
                disabled={actionLoading === product.id}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Restore Product
              </Button>
            )}
          </div>
        ) : (
          <Button
            variant="led"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(product.id);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
        )}
      </div>
    </Link>
  );

  const renderProductGrid = (productList: Product[], showAdminActions: boolean = false) => (
    productList.length === 0 ? (
      <div className="text-center py-16">
        <p className="text-muted-foreground text-lg">No products found</p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {productList.map((product) => renderProductCard(product, showAdminActions))}
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-40 left-1/4 w-80 h-80 bg-primary/3 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
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

            {/* Search Bar */}
            <SearchWithRecommendations
              value={searchQuery}
              onChange={setSearchQuery}
              className="max-w-md mx-auto mt-8"
            />
          </div>

          {/* Admin Tabs */}
          {isAdmin ? (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
                <TabsTrigger value="active" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Active ({products.filter(p => p.status === 'active').length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending ({products.filter(p => p.status === 'pending').length})
                </TabsTrigger>
                <TabsTrigger value="archived" className="flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  Archived ({products.filter(p => p.status === 'archived').length})
                </TabsTrigger>
              </TabsList>

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

              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card-glass rounded-2xl h-96 animate-pulse" />
                  ))}
                </div>
              ) : (
                <>
                  <TabsContent value="active">
                    {renderProductGrid(activeProducts, true)}
                  </TabsContent>
                  <TabsContent value="pending">
                    {renderProductGrid(pendingProducts, true)}
                  </TabsContent>
                  <TabsContent value="archived">
                    {renderProductGrid(archivedProducts, true)}
                  </TabsContent>
                </>
              )}
            </Tabs>
          ) : (
            <>
              {/* Category Filter for non-admin users */}
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

              {/* Products Grid - Only show active products to non-admin users */}
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="card-glass rounded-2xl h-96 animate-pulse" />
                  ))}
                </div>
              ) : (
                renderProductGrid(activeProducts, false)
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
