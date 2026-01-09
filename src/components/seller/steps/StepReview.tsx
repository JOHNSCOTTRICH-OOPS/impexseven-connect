import { Package, MapPin, Image, TrendingUp, DollarSign, Calendar } from "lucide-react";
import type { SellerFormData } from "../SellerWizard";

interface Props {
  formData: SellerFormData;
}

export default function StepReview({ formData }: Props) {
  const formatExpiry = () => {
    if (formData.expiryDate) {
      return new Date(formData.expiryDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
    if (formData.expiryDays) {
      return `${formData.expiryDays} days from submission`;
    }
    return "Not specified";
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold led-text mb-2">
          Review Your Listing
        </h2>
        <p className="text-muted-foreground">
          Please confirm all details before submitting
        </p>
      </div>

      <div className="space-y-4">
        {/* Product Photo */}
        {formData.photoPreview && (
          <div className="flex justify-center mb-6">
            <img
              src={formData.photoPreview}
              alt="Product"
              className="w-32 h-32 object-cover rounded-lg border-2 border-primary/30"
            />
          </div>
        )}

        {/* Summary Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Package className="w-4 h-4" />
              <span className="text-sm font-medium">Product Name</span>
            </div>
            <p className="text-foreground font-semibold">{formData.productName || "—"}</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-primary mb-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Location</span>
            </div>
            <p className="text-foreground font-semibold">{formData.location || "—"}</p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Image className="w-4 h-4" />
              <span className="text-sm font-medium">Photo</span>
            </div>
            <p className="text-foreground font-semibold">
              {formData.photoFile ? formData.photoFile.name : "No photo uploaded"}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-primary mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Production Capacity</span>
            </div>
            <p className="text-foreground font-semibold">
              {formData.minProduction.toLocaleString()} - {formData.maxProduction.toLocaleString()} units
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-primary mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Price per Unit</span>
            </div>
            <p className="text-foreground font-semibold text-lg">
              ${formData.pricePerUnit.toFixed(2)}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2 text-primary mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium">Expiry</span>
            </div>
            <p className="text-foreground font-semibold">{formatExpiry()}</p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg border border-secondary/30 bg-secondary/5">
          <p className="text-sm text-muted-foreground text-center">
            By submitting, you agree to our terms of service. Your listing will be reviewed
            and published shortly.
          </p>
        </div>
      </div>
    </div>
  );
}
