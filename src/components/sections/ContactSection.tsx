import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send } from "lucide-react";

const ContactSection = () => {
  const [activeTab, setActiveTab] = useState<"buyer" | "supplier">("buyer");

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "impexsevenindia@gmail.com",
      href: "mailto:impexsevenindia@gmail.com",
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

          {/* Contact Form */}
          <div className="card-glass p-8 rounded-2xl">
            {/* Tab Switcher */}
            <div className="flex mb-8 p-1 rounded-lg bg-muted/50">
              <button
                onClick={() => setActiveTab("buyer")}
                className={`flex-1 py-3 rounded-md font-medium text-sm uppercase tracking-wider transition-all ${
                  activeTab === "buyer"
                    ? "bg-primary text-primary-foreground led-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Buyer Inquiry
              </button>
              <button
                onClick={() => setActiveTab("supplier")}
                className={`flex-1 py-3 rounded-md font-medium text-sm uppercase tracking-wider transition-all ${
                  activeTab === "supplier"
                    ? "bg-secondary text-secondary-foreground gold-glow"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Supplier Form
              </button>
            </div>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground"
                    placeholder="Company Ltd."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground"
                  placeholder="john@company.com"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  {activeTab === "buyer"
                    ? "Products Interested In"
                    : "Products You Offer"}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground"
                  placeholder={
                    activeTab === "buyer"
                      ? "e.g., Turmeric, Mangoes, Seafood"
                      : "e.g., Rice, Vegetables, Spices"
                  }
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-muted/50 border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-foreground resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>

              <Button
                type="submit"
                variant={activeTab === "buyer" ? "led" : "gold"}
                size="lg"
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit {activeTab === "buyer" ? "Inquiry" : "Application"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
