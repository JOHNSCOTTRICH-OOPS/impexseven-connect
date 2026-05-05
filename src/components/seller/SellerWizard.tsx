import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ChevronLeft, ChevronRight, Package, Image, DollarSign, Send, AlertTriangle } from "lucide-react";
import StepProductInfo from "./steps/StepProductInfo";
import StepProductDetails from "./steps/StepProductDetails";
import StepPricing from "./steps/StepPricing";
import StepReview from "./steps/StepReview";
import { getUserFriendlyError } from "@/lib/errorHandler";
import AuthModal from "@/components/auth/AuthModal";

export interface SellerFormData {
  productName: string;
  location: string;
  photoFile: File | null;
  photoPreview: string;
  minProduction: number;
  maxProduction: number;
  minPrice: number;
  maxPrice: number;
  expiryDays: number | null;
  expiryDate: string;
}

const STEPS = [
  { id: 1, title: "Product Info", icon: Package },
  { id: 2, title: "Details", icon: Image },
  { id: 3, title: "Pricing", icon: DollarSign },
  { id: 4, title: "Submit", icon: Send },
];

export default function SellerWizard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [formData, setFormData] = useState<SellerFormData>({
    productName: "",
    location: "",
    photoFile: null,
    photoPreview: "",
    minProduction: 100,
    maxProduction: 1000,
    minPrice: 0,
    maxPrice: 0,
    expiryDays: 30,
    expiryDate: "",
  });

  const updateFormData = (updates: Partial<SellerFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.productName.trim() !== "" && formData.location.trim() !== "";
      case 2:
        return formData.minProduction > 0 && formData.maxProduction >= formData.minProduction;
      case 3:
        return formData.minPrice > 0 && formData.maxPrice >= formData.minPrice && (formData.expiryDays !== null || formData.expiryDate !== "");
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setIsSubmitting(true);

    try {
      let photoUrl = null;

      // Upload photo if exists
      if (formData.photoFile) {
        const fileExt = formData.photoFile.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("product-photos")
          .upload(fileName, formData.photoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("product-photos")
          .getPublicUrl(fileName);

        photoUrl = urlData.publicUrl;
      }

      // Insert product
      const { error: insertError } = await supabase.from("seller_products").insert({
        user_id: user.id,
        product_name: formData.productName,
        location: formData.location,
        photo_url: photoUrl,
        min_production: formData.minProduction,
        max_production: formData.maxProduction,
        price_per_unit: formData.pricePerUnit,
        expiry_days: formData.expiryDays,
        expiry_date: formData.expiryDate || null,
      });

      if (insertError) throw insertError;

      toast({
        title: "Product Submitted!",
        description: "Your product has been successfully listed.",
      });

      // Reset form
      setFormData({
        productName: "",
        location: "",
        photoFile: null,
        photoPreview: "",
        minProduction: 100,
        maxProduction: 1000,
        pricePerUnit: 0,
        expiryDays: 30,
        expiryDate: "",
      });
      setCurrentStep(1);
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary led-glow"
                        : isActive
                        ? "bg-primary/20 border-2 border-primary led-border"
                        : "bg-muted border border-border"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-primary-foreground" />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-primary led-text" : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isActive || isCompleted ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div className="flex-1 mx-4">
                    <div
                      className={`h-0.5 transition-all duration-300 ${
                        isCompleted ? "bg-primary led-glow" : "bg-border"
                      }`}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <Card className="card-glass p-6 md:p-8">
        <div className="min-h-[300px]">
          {currentStep === 1 && (
            <StepProductInfo formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 2 && (
            <StepProductDetails formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 3 && (
            <StepPricing formData={formData} updateFormData={updateFormData} />
          )}
          {currentStep === 4 && <StepReview formData={formData} />}
          
          {/* Login reminder on review step */}
          {currentStep === 4 && !user && (
            <p className="text-warning text-sm mt-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              To submit your product, you need to login first
            </p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="btn-led-outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 4 ? (
            <Button onClick={handleNext} className="btn-led">
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn-gold"
            >
              {isSubmitting ? "Submitting..." : user ? "Submit Product" : "Login to Submit"}
              <Send className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>
      
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
