import { Calendar, Globe2, Shield, TrendingUp } from "lucide-react";

const AboutSection = () => {
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

  return (
    <section id="about" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="led-dot" />
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                About ImpexSeven
              </span>
            </div>

            <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mb-6">
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
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-y-1/2" />
    </section>
  );
};

export default AboutSection;
