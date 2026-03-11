import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, ArrowRight, ShoppingCart, Users } from "lucide-react";

const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "info@impexseven.com",
      href: "mailto:info@impexseven.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 9963530777",
      href: "tel:+919963530777",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Vijayawada, Andhra Pradesh, India",
    },
  ];

  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
            <span className="led-dot" />
            <span className="text-primary text-sm font-medium uppercase tracking-wider">
              Get In Touch
            </span>
          </div>

          <h2 className="section-title text-3xl md:text-4xl lg:text-5xl mb-6">
            <span className="text-foreground">Start Your </span>
            <span className="text-gradient-led">Trade Journey</span>
          </h2>

          <p className="text-muted-foreground text-lg">
            Whether you're looking to source products from India or expand your 
            market reach, we're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h3 className="font-display text-2xl font-semibold text-foreground mb-8">
              Contact Information
            </h3>

            <div className="space-y-6 mb-10">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-foreground font-medium">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Business Name Card */}
            <div className="p-6 rounded-xl led-border bg-card/50">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">
                Business Name
              </p>
              <p className="font-display text-2xl font-bold led-text">
                IMPEXSEVEN
              </p>
            </div>
          </div>

          {/* CTA Cards */}
          <div className="space-y-6">
            {/* Buyer CTA */}
            <div className="card-glass p-8 rounded-2xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  For Buyers
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Explore our marketplace of premium Indian products. Browse verified suppliers 
                and request quotes for bulk orders.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="led" className="flex-1" asChild>
                  <Link to="/products">
                    Browse Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="ledOutline" className="flex-1" asChild>
                  <Link to="/support">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </div>

            {/* Supplier CTA */}
            <div className="card-glass p-8 rounded-2xl border-secondary/30">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground">
                  For Suppliers
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Join our network of verified suppliers. List your products and connect 
                with international buyers looking for quality Indian exports.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="gold" className="flex-1" asChild>
                  <Link to="/sell">
                    List Your Products
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link to="/support">
                    Get Help
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
