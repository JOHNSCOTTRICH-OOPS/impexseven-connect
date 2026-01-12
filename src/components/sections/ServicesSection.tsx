import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ship, Package, Search, Shield, Truck, Users, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Ship,
    title: "Export Solutions",
    description: "Seamless export of Indian spices, seafood, fruits & vegetables to international markets",
  },
  {
    icon: Search,
    title: "Supplier Sourcing",
    description: "Find verified, quality-assured suppliers across India for your product needs",
  },
  {
    icon: Users,
    title: "Client Handling",
    description: "Dedicated account management for international buyers with 24/7 support",
  },
  {
    icon: Shield,
    title: "Quality Assurance",
    description: "Rigorous testing and certification ensuring products meet global standards",
  },
  {
    icon: Truck,
    title: "Logistics Support",
    description: "End-to-end logistics management with cold chain facilities for perishables",
  },
  {
    icon: Package,
    title: "Custom Packaging",
    description: "Tailored packaging solutions meeting international shipping requirements",
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 bg-card/30 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="led-dot" />
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Our Services
            </span>
          </div>

          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="text-foreground">Comprehensive </span>
            <span className="text-gradient-led">Trade Services</span>
          </h2>

          <p className="text-muted-foreground text-lg">
            From sourcing to delivery, we provide end-to-end solutions for 
            both international buyers and Indian suppliers.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border border-border bg-background/50 hover:border-primary/50 hover:led-border transition-all duration-300 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <service.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="led" size="lg" asChild>
            <Link to="/support">
              Learn More About Our Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Decorative LED Lines */}
      <div className="absolute top-0 left-0 right-0 led-line" />
      <div className="absolute bottom-0 left-0 right-0 led-line" />
    </section>
  );
};

export default ServicesSection;
