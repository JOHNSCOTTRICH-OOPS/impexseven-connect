import { useState, useMemo, useEffect } from "react";
import { ArrowDown, Leaf, Package, Recycle, Edit2, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface EditableByproductsFlowchartProps {
  productName: string;
  category: string | null;
  productId: string;
  onProductEdit?: () => void;
}

// Define byproducts based on category
const categoryByproducts: Record<string, string[]> = {
  "Fresh Produce": ["Compost", "Animal Feed", "Bio-Fuel", "Fertilizer"],
  "Spices": ["Essential Oils", "Natural Dyes", "Herbal Tea", "Aromatherapy"],
  "Seafood": ["Fish Meal", "Fish Oil", "Bone Meal", "Pet Food"],
  "Fruits": ["Juice Extract", "Fruit Pulp", "Pectin", "Bio-Ethanol"],
  "Vegetables": ["Vegetable Oil", "Fiber Extract", "Compost", "Animal Feed"],
  "Grains": ["Bran", "Straw", "Bio-Fuel", "Animal Feed"],
  "Dairy": ["Whey Protein", "Lactose", "Casein", "Bio-Gas"],
  "Meat": ["Bone Meal", "Gelatin", "Tallow", "Pet Food"],
  "Other": ["Organic Waste", "Compost", "Bio-Energy", "Recycled Materials"],
};

const ADMIN_EMAIL = "njohnscottrich@gmail.com";

const EditableByproductsFlowchart = ({ 
  productName, 
  category, 
  productId,
  onProductEdit 
}: EditableByproductsFlowchartProps) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [customByproducts, setCustomByproducts] = useState<string[]>([]);
  const [editValue, setEditValue] = useState("");

  const defaultByproducts = useMemo(() => {
    return categoryByproducts[category || "Other"] || categoryByproducts["Other"];
  }, [category]);

  useEffect(() => {
    const checkAdminByEmail = async () => {
      if (!user?.email) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(user.email === ADMIN_EMAIL);
    };
    checkAdminByEmail();
  }, [user]);

  useEffect(() => {
    setCustomByproducts(defaultByproducts);
  }, [defaultByproducts]);

  const handleEditStart = (index: number) => {
    if (!isAdmin) return;
    setEditingIndex(index);
    setEditValue(customByproducts[index]);
  };

  const handleEditSave = (index: number) => {
    if (editValue.trim()) {
      const newByproducts = [...customByproducts];
      newByproducts[index] = editValue.trim();
      setCustomByproducts(newByproducts);
    }
    setEditingIndex(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingIndex(null);
    setEditValue("");
  };

  const handleProductClick = () => {
    if (isAdmin && onProductEdit) {
      onProductEdit();
    }
  };

  return (
    <div className="card-glass p-6 rounded-2xl">
      <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Recycle className="w-5 h-5 text-primary" />
        Byproducts Flowchart
        {isAdmin && (
          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full ml-auto">
            Admin Mode
          </span>
        )}
      </h3>

      <div className="flex flex-col items-center">
        {/* Main Product Node - Clickable for admin */}
        <div 
          className={`relative group ${isAdmin ? 'cursor-pointer' : ''}`}
          onClick={handleProductClick}
        >
          <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div className={`relative bg-primary/20 border-2 border-primary rounded-xl px-6 py-4 text-center min-w-[160px] shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/40 ${isAdmin ? 'ring-2 ring-primary/30 ring-offset-2 ring-offset-background' : ''}`}>
            <Package className="w-6 h-6 mx-auto mb-2 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-foreground text-sm leading-tight block">
              {productName}
            </span>
            {isAdmin && (
              <span className="text-[10px] text-primary mt-1 block">
                Click to edit product
              </span>
            )}
          </div>
        </div>

        {/* Arrow Down */}
        <div className="my-3">
          <ArrowDown className="w-6 h-6 text-primary animate-bounce" />
        </div>

        {/* Processing Node */}
        <div className="group relative">
          <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg px-4 py-2 text-center transition-all duration-300 group-hover:border-primary/60 group-hover:scale-105">
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">Processing & Extraction</span>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="my-3">
          <ArrowDown className="w-6 h-6 text-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
        </div>

        {/* Byproducts Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {customByproducts.map((byproduct, index) => (
            <div
              key={index}
              className="relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connection line */}
              <div className="absolute -top-3 left-1/2 w-px h-3 bg-primary/30 group-hover:bg-primary transition-colors duration-300" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Byproduct Node */}
              {editingIndex === index ? (
                <div className="relative bg-muted/50 border-2 border-primary rounded-lg px-2 py-2">
                  <Input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="text-xs h-7 mb-2"
                    autoFocus
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleEditSave(index)}
                    >
                      <Check className="w-3 h-3 text-primary" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={handleEditCancel}
                    >
                      <X className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className={`relative bg-muted/50 border border-border rounded-lg px-3 py-3 text-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-105 group-hover:-translate-y-1 ${isAdmin ? 'cursor-pointer' : ''}`}
                  onClick={() => handleEditStart(index)}
                >
                  <Leaf className="w-4 h-4 mx-auto mb-1.5 text-primary/70 transition-all duration-300 group-hover:text-primary group-hover:scale-110 group-hover:animate-pulse" />
                  <span className="text-xs font-medium text-foreground block leading-tight transition-colors duration-300 group-hover:text-primary">
                    {byproduct}
                  </span>
                  {isAdmin && (
                    <Edit2 className="w-3 h-3 absolute top-1 right-1 text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Info text */}
        <p className="text-xs text-muted-foreground text-center mt-4 px-2">
          Sustainable byproducts derived from {productName.toLowerCase()} processing
        </p>
      </div>
    </div>
  );
};

export default EditableByproductsFlowchart;
