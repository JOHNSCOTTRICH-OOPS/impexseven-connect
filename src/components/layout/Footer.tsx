import { Link } from "react-router-dom";
import { Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  const productLinks = [
    { label: "Spices", href: "#products" },
    { label: "Seafood", href: "#products" },
    { label: "Fruits", href: "#products" },
    { label: "Vegetables", href: "#products" },
  ];

  const companyLinks = [
    { label: "About Us", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Supplier Program", href: "#suppliers" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-flex items-center gap-3 mb-6">
              <img src={logo} alt="ImpexSeven Logo" className="h-12 w-auto rounded" />
              <span className="font-display text-xl font-bold led-text">
                IMPEX<span className="text-gradient-gold">SEVEN</span>
              </span>
            </a>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Connecting global buyers with India's finest agricultural products. 
              Your trusted partner in international trade.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="p-2 rounded-lg bg-muted hover:bg-primary/20 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Products
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-foreground mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <a
                  href="mailto:impexsevenindia@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  impexsevenindia@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <a
                  href="tel:+919963530777"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +91 9963530777
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span className="text-muted-foreground">
                  Vijayawada, Andhra Pradesh, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2025 ImpexSeven. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Vijayawada, Andhra Pradesh, India
          </p>
        </div>
      </div>

      {/* LED Line */}
      <div className="led-line" />
    </footer>
  );
};

export default Footer;
