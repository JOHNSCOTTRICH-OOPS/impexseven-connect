import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, Clock, Globe, Headphones, Shield, Truck, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Network",
    stat: "50+",
    label: "Countries",
  },
  {
    icon: Shield,
    title: "Quality Certified",
    stat: "100%",
    label: "Verified Products",
  },
  {
    icon: Clock,
    title: "Fast Processing",
    stat: "48hrs",
    label: "Quote Response",
  },
  {
    icon: Truck,
    title: "Reliable Delivery",
    stat: "99%",
    label: "On-Time Rate",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    stat: "Always",
    label: "Available",
  },
  {
    icon: Award,
    title: "Industry Leaders",
    stat: "Top 10",
    label: "Exporter Rating",
  },
];

const WhyChooseSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="led-dot" />
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Why ImpexSeven
            </span>
          </div>

          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="text-foreground">Trusted by </span>
            <span className="text-gradient-led">Global Partners</span>
          </h2>

          <p className="text-muted-foreground text-lg">
            Our commitment to quality, reliability, and customer satisfaction 
            sets us apart in the import-export industry.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-2xl border border-border bg-card/50 hover:border-primary/50 hover:bg-card transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:animate-glow-pulse">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>

              {/* Stat */}
              <div className="font-display text-2xl font-bold led-text mb-1">
                {feature.stat}
              </div>
              <div className="text-muted-foreground text-xs uppercase tracking-wider mb-2">
                {feature.label}
              </div>

              {/* Title */}
              <div className="text-foreground text-sm font-medium">
                {feature.title}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="led" size="lg" asChild>
            <Link to="/about">
              Learn More About Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
    </section>
  );
};

export default WhyChooseSection;
