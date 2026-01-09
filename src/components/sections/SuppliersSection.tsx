import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ClipboardList, CheckCircle2, Handshake, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Submit Details",
    description: "Share your product information and business credentials with our team",
  },
  {
    icon: CheckCircle2,
    step: "02",
    title: "Quality Assessment",
    description: "Our experts evaluate your products against international standards",
  },
  {
    icon: Handshake,
    step: "03",
    title: "Partner Onboarding",
    description: "Complete verification and join our network of trusted suppliers",
  },
];

const SuppliersSection = () => {
  return (
    <section id="suppliers" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, hsl(var(--secondary)) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, hsl(var(--primary)) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/5 mb-6">
            <span className="w-2 h-2 rounded-full bg-secondary" style={{ boxShadow: "0 0 8px hsl(var(--secondary))" }} />
            <span className="text-secondary text-sm font-medium uppercase tracking-wider">
              For Suppliers
            </span>
          </div>

          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="text-foreground">Become a </span>
            <span className="text-gradient-gold">Verified Supplier</span>
          </h2>

          <p className="text-muted-foreground text-lg">
            Join India's fastest-growing import-export network. Connect with 
            international buyers and expand your market reach through ImpexSeven.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((item, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-secondary/50 transition-all duration-300 group"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-8 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-display font-bold gold-glow">
                Step {item.step}
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                <item.icon className="w-8 h-8 text-secondary" />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {item.title}
              </h3>
              <p className="text-muted-foreground">
                {item.description}
              </p>

              {/* Connector Line (hidden on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-secondary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="gold" size="xl" className="group" asChild>
            <Link to="/sell">
              Start Your Application
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuppliersSection;
