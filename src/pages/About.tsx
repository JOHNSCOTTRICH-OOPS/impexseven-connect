import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calendar, Globe2, Shield, TrendingUp, User, Building2 } from "lucide-react";

const highlights = [
  {
    icon: Globe2,
    title: "Global Reach",
    description: "Connecting buyers from 50+ countries with India's finest produce",
  },
  {
    icon: Shield,
    title: "Quality Assured",
    description: "Rigorous quality checks at every stage of the supply chain",
  },
  {
    icon: TrendingUp,
    title: "Growth Partner",
    description: "Helping businesses scale with reliable import-export solutions",
  },
];

export default function About() {
  const [activeView, setActiveView] = useState<"company" | "founder">("company");
  const [isFlipping, setIsFlipping] = useState(false);

  const handleFlip = (view: "company" | "founder") => {
    if (view === activeView || isFlipping) return;
    setIsFlipping(true);
    setTimeout(() => {
      setActiveView(view);
      setIsFlipping(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="led-dot" />
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                About Us
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-foreground">Get to Know </span>
              <span className="text-gradient-led">ImpexSeven</span>
            </h1>
          </div>

          {/* Toggle Buttons */}
          <div className="flex justify-center gap-4 mb-12">
            <button
              onClick={() => handleFlip("company")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wider transition-all duration-300 ${
                activeView === "company"
                  ? "bg-primary text-primary-foreground led-glow"
                  : "bg-card border border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
            >
              <Building2 className="w-4 h-4" />
              About Company
            </button>
            <button
              onClick={() => handleFlip("founder")}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm uppercase tracking-wider transition-all duration-300 ${
                activeView === "founder"
                  ? "bg-secondary text-secondary-foreground gold-glow"
                  : "bg-card border border-border text-muted-foreground hover:border-secondary/50 hover:text-secondary"
              }`}
            >
              <User className="w-4 h-4" />
              About Me
            </button>
          </div>

          {/* Flip Card Container */}
          <div className="max-w-6xl mx-auto perspective-1000">
            <div
              className={`relative transition-all duration-500 transform-style-preserve-3d ${
                isFlipping ? "opacity-0 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {activeView === "company" ? (
                /* Company View */
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                  {/* Company Content */}
                  <div>
                    <h2 className="section-title text-3xl md:text-4xl mb-6">
                      <span className="text-foreground">Your Trusted </span>
                      <span className="text-gradient-led">Import-Export</span>
                      <br />
                      <span className="text-gradient-gold">Partner</span>
                    </h2>

                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      ImpexSeven connects international buyers with premium Indian products 
                      and helps suppliers bring their products to India's market. We specialize 
                      in spices, seafood, fruits, and vegetables, ensuring quality, trust, and 
                      reliable service.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Our mission is to bridge the gap between India's rich agricultural heritage 
                      and global markets, delivering excellence in every shipment. With a network 
                      of verified suppliers and stringent quality protocols, we ensure that every 
                      product meets international standards.
                    </p>

                    {/* Founding Date */}
                    <div className="flex items-center gap-4 p-4 rounded-lg led-border bg-card/50">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground uppercase tracking-wider">
                          Established
                        </p>
                        <p className="font-display text-lg font-semibold text-foreground">
                          7 August 2025
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="space-y-6">
                    {highlights.map((item, index) => (
                      <div
                        key={index}
                        className="card-glass p-6 rounded-xl hover:border-primary/50 transition-all duration-300 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <item.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                              {item.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Founder View */
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                  {/* Founder Image/Avatar */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center led-border">
                        <User className="w-32 h-32 text-primary/50" />
                      </div>
                      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                        <div className="px-6 py-2 rounded-full bg-secondary text-secondary-foreground font-medium text-sm gold-glow">
                          Founder & CEO
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Founder Content */}
                  <div>
                    <h2 className="section-title text-3xl md:text-4xl mb-2">
                      <span className="text-gradient-gold">Meet the Founder</span>
                    </h2>
                    
                    <p className="text-2xl font-display font-semibold text-foreground mb-6">
                      Driving Global Trade Excellence
                    </p>

                    <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                      With a passion for connecting India's finest products to the world, 
                      I founded ImpexSeven to bridge the gap between quality Indian suppliers 
                      and global buyers seeking authentic, premium products.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-6">
                      My vision is to make international trade accessible, transparent, and 
                      beneficial for all parties involved. Through ImpexSeven, we're not just 
                      facilitating trade – we're building lasting partnerships that drive 
                      mutual growth and success.
                    </p>

                    <p className="text-muted-foreground leading-relaxed mb-8">
                      Every product that passes through ImpexSeven represents our commitment 
                      to quality, integrity, and customer satisfaction. We believe in the 
                      power of Indian agriculture and the potential of global markets.
                    </p>

                    {/* Contact */}
                    <div className="card-glass p-4 rounded-xl">
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                        Connect with me
                      </p>
                      <p className="font-medium text-foreground">
                        impexsevenindia@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
