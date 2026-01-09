import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SellerWizard from "@/components/seller/SellerWizard";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";

export default function Sell() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="led-text">List Your</span>{" "}
              <span className="text-gradient-gold">Product</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Join our network of trusted suppliers and reach buyers worldwide
            </p>
          </div>

          {user ? (
            <SellerWizard />
          ) : (
            <div className="max-w-md mx-auto text-center card-glass p-8 rounded-lg">
              <h2 className="text-xl font-display font-semibold mb-4 text-foreground">
                Sign in to continue
              </h2>
              <p className="text-muted-foreground mb-6">
                You need to be signed in to list your products for sale.
              </p>
              <Button onClick={() => setShowAuthModal(true)} className="btn-led">
                Sign In / Sign Up
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
