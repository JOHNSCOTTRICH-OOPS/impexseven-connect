import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calendar, Globe2, Shield, TrendingUp, User, Building2, ArrowLeft, ArrowRight } from "lucide-react";

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
  const [activeView, setActiveView] = useState<"company" | "founder" | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const handleBoxClick = (view: "company" | "founder") => {
    if (isFlipping) return;
    
    if (activeView === view) {
      // Click same section again - flip back to normal
      setIsFlipping(true);
      setTimeout(() => {
        setActiveView(null);
        setIsFlipping(false);
      }, 600);
    } else {
      // Click a section - flip the OTHER box and show this section's content
      setIsFlipping(true);
      setTimeout(() => {
        setActiveView(view);
        setIsFlipping(false);
      }, 600);
    }
  };

  // Determine which box should be flipped (the opposite of the clicked/active one)
  const isCompanyBoxFlipped = activeView === "founder" || (isFlipping && activeView === null);
  const isFounderBoxFlipped = activeView === "company" || (isFlipping && activeView === null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
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

            <p className="text-muted-foreground text-lg">
              Click on a section to learn more
            </p>
          </div>

          {/* Two Rectangles with Circle in Middle */}
          <div className="max-w-6xl mx-auto">
            <div className="relative flex items-stretch justify-center gap-0 min-h-[500px]">
              
              {/* Left Rectangle - About Company */}
              <div className="flex-1 perspective-1000">
                <div
                  onClick={() => handleBoxClick("company")}
                  className="relative w-full h-full min-h-[500px] cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: activeView === "founder" ? "rotateY(180deg)" : "rotateY(0deg)",
                    transition: "transform 0.6s ease-in-out"
                  }}
                >
                  {/* Front Face - Company Icon and Title */}
                  <div 
                    className={`absolute inset-0 rounded-l-2xl p-8 flex flex-col items-center justify-center text-center border-2 ${
                      activeView === "company"
                        ? "bg-primary/20 border-primary"
                        : "bg-card/80 border-border hover:border-primary/50 hover:bg-card"
                    }`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="p-6 rounded-2xl mb-6 bg-primary/10">
                      <Building2 className="w-16 h-16 text-primary/70" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-foreground">
                      About Company
                    </h2>
                    <p className="text-muted-foreground max-w-xs">
                      Learn about ImpexSeven's mission, values, and global reach
                    </p>
                    {activeView === "company" && (
                      <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/30 animate-fade-in">
                        <p className="text-sm text-primary font-medium">✓ Currently Viewing</p>
                      </div>
                    )}
                  </div>

                  {/* Back Face - Founder Content (shown when founder is clicked) */}
                  <div 
                    className="absolute inset-0 rounded-l-2xl p-6 md:p-8 border-2 border-secondary bg-card/95 overflow-y-auto"
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                  {/* Founder Photo */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-secondary/30 to-primary/20 flex items-center justify-center border-2 border-secondary/50 overflow-hidden">
                          <img 
                            src="/founder-photo.jpg" 
                            alt="Founder" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <User className="w-12 h-12 text-secondary/70 hidden" />
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                          <div className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground font-medium text-xs">
                            Founder & CEO
                          </div>
                        </div>
                      </div>
                    </div>

                    <h2 className="font-display text-xl md:text-2xl font-bold mb-2 text-center">
                      <span className="text-gradient-gold">Meet the Founder</span>
                    </h2>
                    
                    <p className="text-lg font-display font-semibold text-foreground mb-4 text-center">
                      Driving Global Trade Excellence
                    </p>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      With a passion for connecting India's finest products to the world, 
                      I founded ImpexSeven to bridge the gap between quality Indian suppliers 
                      and global buyers seeking authentic, premium products.
                    </p>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      My vision is to make international trade accessible, transparent, and 
                      beneficial for all parties involved. Through ImpexSeven, we're building 
                      lasting partnerships that drive mutual growth and success.
                    </p>

                    {/* Contact */}
                    <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                        Connect with me
                      </p>
                      <p className="font-medium text-foreground text-sm">
                        impexsevenindia@gmail.com
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Circle with Arrow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className={`w-20 h-20 md:w-28 md:h-28 rounded-full bg-background border-4 flex items-center justify-center transition-all duration-500 shadow-2xl ${
                  activeView === "company"
                    ? "border-primary led-glow" 
                    : activeView === "founder"
                    ? "border-secondary gold-glow"
                    : "border-border"
                }`}>
                  {activeView === "company" && (
                    <ArrowLeft className="w-8 h-8 md:w-12 md:h-12 text-primary animate-pulse" />
                  )}
                  {activeView === "founder" && (
                    <ArrowRight className="w-8 h-8 md:w-12 md:h-12 text-secondary animate-pulse" />
                  )}
                  {!activeView && (
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/50 animate-pulse" />
                  )}
                </div>
              </div>

              {/* Right Rectangle - About Me */}
              <div className="flex-1 perspective-1000">
                <div
                  onClick={() => handleBoxClick("founder")}
                  className="relative w-full h-full min-h-[500px] cursor-pointer"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: activeView === "company" ? "rotateY(-180deg)" : "rotateY(0deg)",
                    transition: "transform 0.6s ease-in-out"
                  }}
                >
                  {/* Front Face - Founder Icon and Title */}
                  <div 
                    className={`absolute inset-0 rounded-r-2xl p-8 flex flex-col items-center justify-center text-center border-2 ${
                      activeView === "founder"
                        ? "bg-secondary/20 border-secondary"
                        : "bg-card/80 border-border hover:border-secondary/50 hover:bg-card"
                    }`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <div className="p-6 rounded-2xl mb-6 bg-secondary/10">
                      <User className="w-16 h-16 text-secondary/70" />
                    </div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold mb-3 text-foreground">
                      About Me
                    </h2>
                    <p className="text-muted-foreground max-w-xs">
                      Meet the founder and the vision behind ImpexSeven
                    </p>
                    {activeView === "founder" && (
                      <div className="mt-6 p-4 rounded-xl bg-secondary/10 border border-secondary/30 animate-fade-in">
                        <p className="text-sm text-secondary font-medium">✓ Currently Viewing</p>
                      </div>
                    )}
                  </div>

                  {/* Back Face - Company Content (shown when company is clicked) */}
                  <div 
                    className="absolute inset-0 rounded-r-2xl p-6 md:p-8 border-2 border-primary bg-card/95 overflow-y-auto"
                    style={{ 
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)"
                    }}
                  >
                    {/* Company Photo */}
                    <div className="flex justify-center mb-4">
                      <div className="w-full h-24 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/10 flex items-center justify-center border border-primary/30 overflow-hidden">
                        <img 
                          src="/company-photo.jpg" 
                          alt="ImpexSeven Company" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <Building2 className="w-10 h-10 text-primary/50 hidden" />
                      </div>
                    </div>
                    
                    <h2 className="font-display text-xl md:text-2xl font-bold mb-4">
                      <span className="text-foreground">Your Trusted </span>
                      <span className="text-gradient-led">Partner</span>
                    </h2>

                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed mb-4">
                      ImpexSeven connects international buyers with premium Indian products 
                      and helps suppliers bring their products to India's market. We specialize 
                      in spices, seafood, fruits, and vegetables.
                    </p>

                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      Our mission is to bridge the gap between India's rich agricultural heritage 
                      and global markets, delivering excellence in every shipment.
                    </p>

                    {/* Highlights */}
                    <div className="space-y-3">
                      {highlights.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                          <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-foreground text-sm">{item.title}</h3>
                            <p className="text-muted-foreground text-xs">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Founding Date */}
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/30 mt-4">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">Established</p>
                        <p className="font-display text-sm font-semibold text-foreground">7 August 2025</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <p className="text-center text-muted-foreground text-sm mt-8">
              {activeView ? "Click the highlighted section again to go back" : "Click on either section to explore"}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
