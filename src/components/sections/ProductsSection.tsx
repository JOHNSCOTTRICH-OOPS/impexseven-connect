import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, MessageSquare } from "lucide-react";
import spicesImg from "@/assets/spices.jpg";
import seafoodImg from "@/assets/seafood.jpg";
import fruitsImg from "@/assets/fruits.jpg";
import vegetablesImg from "@/assets/vegetables.jpg";

const categories = ["All", "Spices", "Seafood", "Fruits", "Vegetables"];

const products = [
  {
    id: 1,
    name: "Premium Turmeric",
    category: "Spices",
    description: "High curcumin content turmeric from Kerala's finest farms",
    image: spicesImg,
  },
  {
    id: 2,
    name: "Fresh Tiger Prawns",
    category: "Seafood",
    description: "Farm-raised premium prawns, IQF processed for freshness",
    image: seafoodImg,
  },
  {
    id: 3,
    name: "Alphonso Mangoes",
    category: "Fruits",
    description: "The king of mangoes from Ratnagiri, naturally ripened",
    image: fruitsImg,
  },
  {
    id: 4,
    name: "Farm Fresh Vegetables",
    category: "Vegetables",
    description: "Organically grown vegetables, freshly harvested",
    image: vegetablesImg,
  },
  {
    id: 5,
    name: "Red Chilli Powder",
    category: "Spices",
    description: "Premium quality Guntur chillies with perfect heat level",
    image: spicesImg,
  },
  {
    id: 6,
    name: "Indian Pomfret",
    category: "Seafood",
    description: "Wild-caught silver pomfret from Arabian Sea",
    image: seafoodImg,
  },
];

const ProductsSection = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="products" className="py-24 relative">
      <div className="container mx-auto px-4">
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group card-glass rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-medium uppercase tracking-wider">
                  {product.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">
                  {product.description}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button variant="ledOutline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Catalogue
                  </Button>
                  <Button variant="led" size="sm" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Quote
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
};

export default ProductsSection;
