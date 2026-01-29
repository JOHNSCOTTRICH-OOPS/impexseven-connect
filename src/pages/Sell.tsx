import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SellerWizard from "@/components/seller/SellerWizard";

export default function Sell() {
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

          <SellerWizard />
        </div>
      </main>

      <Footer />
    </div>
  );
}