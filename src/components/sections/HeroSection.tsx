import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-spices.jpg";
import { ArrowRight, Globe, Users } from "lucide-react";
import SearchWithRecommendations from "@/components/search/SearchWithRecommendations";
import { supabase } from "@/integrations/supabase/client";

const HeroSection = () => {
  const [heroSearch, setHeroSearch] = useState("");
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const { count } = await supabase
        .from("seller_products")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");
      if (count !== null) {
        // Round down to nearest 10
        setProductCount(Math.floor(count / 10) * 10);
      }
    };
    fetchCount();
  }, []);

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Premium Indian Spices"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>

      {/* LED Grid Effect */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.1) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8 animate-glow-pulse">
            <span className="led-dot" />
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              India's Premium Export Partner
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="section-title text-4xl md:text-6xl lg:text-7xl mb-6">
            <span className="text-foreground">Connecting </span>
            <span className="text-gradient-led">Global Buyers</span>
            <br />
            <span className="text-foreground">& </span>
            <span className="text-gradient-gold">Indian Suppliers</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Premium spices, fresh seafood, exotic fruits & vegetables — sourced from 
            India's finest producers for discerning international markets.
          </p>

          {/* Search Bar */}
          <SearchWithRecommendations
            value={heroSearch}
            onChange={setHeroSearch}
            placeholder="Search for spices, seafood, fruits..."
            className="max-w-lg mx-auto mb-8"
            navigateOnSelect
            variant="hero"
          />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="led" size="xl" className="group" onClick={scrollToProducts}>
              <Globe className="mr-2 h-5 w-5" />
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="gold" size="xl" className="group" asChild>
              <Link to="/sell">
                <Users className="mr-2 h-5 w-5" />
                Become a Supplier
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            {[
              { value: "50+", label: "Country's Ready to Serve" },
              { value: `${productCount}+`, label: "Products Listed" },
              { value: "100%", label: "Quality Assured" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display font-bold text-3xl md:text-4xl text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom LED Line */}
      <div className="absolute bottom-0 left-0 right-0 led-line" />
    </section>
  );
};

export default HeroSection;
