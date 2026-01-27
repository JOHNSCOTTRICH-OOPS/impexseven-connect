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
      <FolderOpen className="w-4 h-4 text-muted-foreground" />
      <Select
        value={currentCategory || "Other"}
        onValueChange={handleCategoryChange}
        disabled={updating}
      >
        <SelectTrigger className="h-8 text-xs flex-1">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat} className="text-sm">
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategorySelector;
