import { Package, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SellerFormData } from "../SellerWizard";

interface Props {
  formData: SellerFormData;
  updateFormData: (updates: Partial<SellerFormData>) => void;
}

export default function StepProductInfo({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold led-text mb-2">
          What product do you want to sell?
        </h2>
        <p className="text-muted-foreground">
          Tell us about your product and where it's available
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="productName" className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Product Name
          </Label>
          <Input
            id="productName"
            type="text"
            placeholder="e.g., Fresh Organic Tomatoes"
            value={formData.productName}
            onChange={(e) => updateFormData({ productName: e.target.value })}
            className="bg-input border-border focus:border-primary focus:ring-primary/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Location
          </Label>
          <Input
            id="location"
            type="text"
            placeholder="e.g., Mumbai, Maharashtra, India"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            className="bg-input border-border focus:border-primary focus:ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
}
