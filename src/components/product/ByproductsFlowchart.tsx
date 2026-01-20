import { useMemo } from "react";
import { ArrowDown, Leaf, Package, Recycle } from "lucide-react";

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

const ByproductsFlowchart = ({ productName, category }: ByproductsFlowchartProps) => {
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
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div className="relative bg-primary/20 border-2 border-primary rounded-xl px-6 py-4 text-center min-w-[160px] shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/40">
            <Package className="w-6 h-6 mx-auto mb-2 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-foreground text-sm leading-tight block">
              {productName}
            </span>
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
          {byproducts.map((byproduct, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Connection line */}
              <div className="absolute -top-3 left-1/2 w-px h-3 bg-primary/30 group-hover:bg-primary transition-colors duration-300" />
              
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
              
              {/* Byproduct Node */}
              <div className="relative bg-muted/50 border border-border rounded-lg px-3 py-3 text-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-105 group-hover:-translate-y-1">
                <Leaf className="w-4 h-4 mx-auto mb-1.5 text-primary/70 transition-all duration-300 group-hover:text-primary group-hover:scale-110 group-hover:animate-pulse" />
                <span className="text-xs font-medium text-foreground block leading-tight transition-colors duration-300 group-hover:text-primary">
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
};

export default ByproductsFlowchart;
