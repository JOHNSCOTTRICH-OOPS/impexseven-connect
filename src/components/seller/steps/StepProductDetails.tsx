import { useCallback } from "react";
import { Upload, X, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import type { SellerFormData } from "../SellerWizard";

interface Props {
  formData: SellerFormData;
  updateFormData: (updates: Partial<SellerFormData>) => void;
}

export default function StepProductDetails({ formData, updateFormData }: Props) {
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          updateFormData({
            photoFile: file,
            photoPreview: reader.result as string,
          });
        };
        reader.readAsDataURL(file);
      }
    },
    [updateFormData]
  );

  const removePhoto = () => {
    updateFormData({
      photoFile: null,
      photoPreview: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold led-text mb-2">
          Product Details
        </h2>
        <p className="text-muted-foreground">
          Add a photo and specify your production capacity
        </p>
      </div>

      {/* Photo Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          Product Photo
        </Label>

        {formData.photoPreview ? (
          <div className="relative w-full max-w-xs mx-auto">
            <img
              src={formData.photoPreview}
              alt="Product preview"
              className="w-full h-48 object-cover rounded-lg border border-border"
            />
            <button
              onClick={removePhoto}
              className="absolute top-2 right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors bg-input/50">
            <Upload className="w-10 h-10 text-muted-foreground mb-3" />
            <span className="text-muted-foreground text-sm">
              Click to upload product photo
            </span>
            <span className="text-muted-foreground text-xs mt-1">
              PNG, JPG up to 5MB
            </span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>

      {/* Production Range */}
      <div className="space-y-4">
        <Label className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Production Capacity (units)
        </Label>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minProduction" className="text-sm text-muted-foreground">
              Minimum
            </Label>
            <Input
              id="minProduction"
              type="number"
              min={1}
              value={formData.minProduction}
              onChange={(e) =>
                updateFormData({ minProduction: parseInt(e.target.value) || 0 })
              }
              className="bg-input border-border focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxProduction" className="text-sm text-muted-foreground">
              Maximum
            </Label>
            <Input
              id="maxProduction"
              type="number"
              min={formData.minProduction}
              value={formData.maxProduction}
              onChange={(e) =>
                updateFormData({ maxProduction: parseInt(e.target.value) || 0 })
              }
              className="bg-input border-border focus:border-primary"
            />
          </div>
        </div>

        <div className="pt-2">
          <Slider
            value={[formData.minProduction, formData.maxProduction]}
            onValueChange={(values) =>
              updateFormData({
                minProduction: values[0],
                maxProduction: values[1],
              })
            }
            max={10000}
            min={1}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>1</span>
            <span className="text-primary font-medium">
              {formData.minProduction.toLocaleString()} - {formData.maxProduction.toLocaleString()} units
            </span>
            <span>10,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
