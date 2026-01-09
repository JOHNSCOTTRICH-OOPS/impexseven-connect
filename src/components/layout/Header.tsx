import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";
import logo from "@/assets/logo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#products", label: "Products" },
    { href: "#suppliers", label: "Suppliers" },
    { href: "#services", label: "Services" },
    { href: "#contact", label: "Contact" },
  ];

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3">
              <img src={logo} alt="ImpexSeven Logo" className="h-12 w-auto rounded" />
              <span className="font-display text-xl font-bold led-text hidden sm:block">
                IMPEX<span className="text-gradient-gold">SEVEN</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Auth & CTA */}
            <div className="hidden md:flex items-center gap-4">
              {loading ? (
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <UserMenu />
              ) : (
                <Button variant="ledOutline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              )}
              <Button variant="led" size="sm" onClick={scrollToContact}>
                Get Quote
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/50">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <div className="flex items-center gap-4 mt-2">
                  {loading ? null : user ? (
                    <UserMenu />
                  ) : (
                    <Button variant="ledOutline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  )}
                  <Button variant="led" size="sm" onClick={() => { scrollToContact(); setIsMenuOpen(false); }}>
                    Get Quote
                  </Button>
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
