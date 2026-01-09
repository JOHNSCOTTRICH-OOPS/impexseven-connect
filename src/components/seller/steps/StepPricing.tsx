import { DollarSign, Calendar, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { SellerFormData } from "../SellerWizard";

interface Props {
  formData: SellerFormData;
  updateFormData: (updates: Partial<SellerFormData>) => void;
}

export default function StepPricing({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-display font-bold led-text mb-2">
          Pricing & Expiry
        </h2>
        <p className="text-muted-foreground">
          Set your price and product lifespan
        </p>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <Label htmlFor="price" className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-primary" />
          Price per Unit
        </Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <Input
            id="price"
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            value={formData.pricePerUnit || ""}
            onChange={(e) =>
              updateFormData({ pricePerUnit: parseFloat(e.target.value) || 0 })
            }
            className="pl-7 bg-input border-border focus:border-primary"
          />
        </div>
      </div>

      {/* Expiry Options */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          Product Lifespan / Expiry
        </Label>

        <Tabs defaultValue="days" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted">
            <TabsTrigger
              value="days"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Clock className="w-4 h-4 mr-2" />
              Days from now
            </TabsTrigger>
            <TabsTrigger
              value="date"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Specific date
            </TabsTrigger>
          </TabsList>

          <TabsContent value="days" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDays" className="text-sm text-muted-foreground">
                Number of days until expiry
              </Label>
              <Input
                id="expiryDays"
                type="number"
                min={1}
                placeholder="e.g., 30"
                value={formData.expiryDays ?? ""}
                onChange={(e) => {
                  const value = e.target.value ? parseInt(e.target.value) : null;
                  updateFormData({ expiryDays: value, expiryDate: "" });
                }}
                className="bg-input border-border focus:border-primary"
              />
            </div>
          </TabsContent>

          <TabsContent value="date" className="mt-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-sm text-muted-foreground">
                Select expiry date
              </Label>
              <Input
                id="expiryDate"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.expiryDate}
                onChange={(e) =>
                  updateFormData({ expiryDate: e.target.value, expiryDays: null })
                }
                className="bg-input border-border focus:border-primary"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
