import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import AuthModal from "@/components/auth/AuthModal";
import UserMenu from "@/components/auth/UserMenu";
import logo from "@/assets/logo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, loading } = useAuth();
  const { itemCount } = useCart();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  const navLinks = isHomePage
    ? [
        { href: "#home", label: "Home", isAnchor: true },
        { href: "/about", label: "About", isAnchor: false },
        { href: "/products", label: "Products", isAnchor: false },
        { href: "#suppliers", label: "Suppliers", isAnchor: true },
        { href: "#services", label: "Services", isAnchor: true },
        { href: "/support", label: "Support", isAnchor: false },
      ]
    : [
        { href: "/", label: "Home", isAnchor: false },
        { href: "/about", label: "About", isAnchor: false },
        { href: "/products", label: "Products", isAnchor: false },
        { href: "/sell", label: "Sell", isAnchor: false },
        { href: "/support", label: "Support", isAnchor: false },
      ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="ImpexSeven Logo" className="h-12 w-auto rounded" />
              <span className="font-display text-xl font-bold led-text hidden sm:block">
                IMPEX<span className="text-gradient-gold">SEVEN</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) =>
                link.isAnchor ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-sm font-medium uppercase tracking-wider transition-colors duration-300 ${
                      location.pathname === link.href
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Auth & Cart */}
            <div className="hidden md:flex items-center gap-4">
              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

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
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 md:hidden">
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <button className="text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden py-4 border-t border-border/50">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) =>
                  link.isAnchor ? (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium uppercase tracking-wider"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="flex items-center gap-4 mt-2">
                  {loading ? null : user ? (
                    <UserMenu />
                  ) : (
                    <Button variant="ledOutline" size="sm" onClick={() => setIsAuthModalOpen(true)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  )}
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
