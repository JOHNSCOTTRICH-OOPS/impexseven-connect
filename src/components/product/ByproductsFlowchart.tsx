import { useMemo } from "react";
import { ArrowRight, ArrowDown, Leaf, Package, Recycle } from "lucide-react";

interface ByproductsFlowchartProps {
  productName: string;
  category: string | null;
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

export default function ByproductsFlowchart({ productName, category }: ByproductsFlowchartProps) {
  const byproducts = useMemo(() => {
    return categoryByproducts[category || "Other"] || categoryByproducts["Other"];
  }, [category]);

  return (
    <div className="card-glass p-6 rounded-2xl">
      <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Recycle className="w-5 h-5 text-primary" />
        Byproducts Flowchart
      </h3>

      <div className="flex flex-col items-center">
        {/* Main Product Node */}
        <div className="relative">
          <div className="bg-primary/20 border-2 border-primary rounded-xl px-6 py-4 text-center min-w-[160px] shadow-lg shadow-primary/20">
            <Package className="w-6 h-6 mx-auto mb-2 text-primary" />
            <span className="font-semibold text-foreground text-sm leading-tight block">
              {productName}
            </span>
          </div>
        </div>

        {/* Arrow Down */}
        <div className="my-3">
          <ArrowDown className="w-6 h-6 text-primary animate-pulse" />
        </div>

        {/* Processing Node */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg px-4 py-2 text-center">
          <span className="text-sm text-muted-foreground">Processing & Extraction</span>
        </div>

        {/* Arrow Down */}
        <div className="my-3">
          <ArrowDown className="w-6 h-6 text-primary animate-pulse" />
        </div>

        {/* Byproducts Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {byproducts.map((byproduct, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connection line */}
              <div className="absolute -top-3 left-1/2 w-px h-3 bg-primary/30" />
              
              {/* Byproduct Node */}
              <div className="bg-muted/50 border border-border hover:border-primary/50 rounded-lg px-3 py-3 text-center transition-all duration-300 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/10">
                <Leaf className="w-4 h-4 mx-auto mb-1.5 text-primary/70 group-hover:text-primary transition-colors" />
                <span className="text-xs font-medium text-foreground block leading-tight">
                  {byproduct}
                </span>
              </div>
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
}
