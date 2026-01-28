import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import { FolderOpen } from "lucide-react";

const categories = ["Spices", "Seafood", "Fruits", "Vegetables", "Fresh Produce", "Grains", "Dairy", "Meat", "Other"];

interface CategorySelectorProps {
  productId: string;
  currentCategory: string | null;
  onCategoryChanged: (newCategory: string) => void;
}

const CategorySelector = ({ productId, currentCategory, onCategoryChanged }: CategorySelectorProps) => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);

  const handleCategoryChange = async (newCategory: string) => {
    if (newCategory === currentCategory) return;
    
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("seller_products")
        .update({ category: newCategory })
        .eq("id", productId);

      if (error) throw error;

      onCategoryChanged(newCategory);
      toast({
        title: "Category updated",
        description: `Product moved to ${newCategory}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <FolderOpen className="w-4 h-4 text-cyan-400" />
      <Select
        value={currentCategory || "Other"}
        onValueChange={handleCategoryChange}
        disabled={updating}
      >
        <SelectTrigger className="h-8 text-xs flex-1 bg-slate-900 border-cyan-500/50 text-cyan-300 font-medium">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent className="bg-slate-900 border-cyan-500/50">
          {categories.map((cat) => (
            <SelectItem 
              key={cat} 
              value={cat} 
              className={`text-sm ${cat === "Other" ? "text-amber-400 font-bold" : "text-cyan-200 hover:text-cyan-100"}`}
            >
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
