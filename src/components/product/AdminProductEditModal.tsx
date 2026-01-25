import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import { Save, X } from "lucide-react";

interface Product {
  id: string;
  product_name: string;
  price_per_unit: number;
  location: string;
  category: string | null;
  min_production: number;
  max_production: number;
  expiry_days: number | null;
}

interface AdminProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onProductUpdated: () => void;
}

const categories = ["Spices", "Seafood", "Fruits", "Vegetables", "Fresh Produce", "Grains", "Dairy", "Meat", "Other"];

const AdminProductEditModal = ({
  isOpen,
  onClose,
  product,
  onProductUpdated,
}: AdminProductEditModalProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    price_per_unit: 0,
    location: "",
    category: "Other",
    min_production: 0,
    max_production: 0,
    expiry_days: 0,
  });

  useEffect(() => {
    if (product) {
      setFormData({
        product_name: product.product_name,
        price_per_unit: product.price_per_unit,
        location: product.location,
        category: product.category || "Other",
        min_production: product.min_production,
        max_production: product.max_production,
        expiry_days: product.expiry_days || 0,
      });
    }
  }, [product]);

  const handleSave = async () => {
    if (!product) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from("seller_products")
        .update({
          product_name: formData.product_name,
          price_per_unit: formData.price_per_unit,
          location: formData.location,
          category: formData.category,
          min_production: formData.min_production,
          max_production: formData.max_production,
          expiry_days: formData.expiry_days || null,
        })
        .eq("id", product.id);

      if (error) throw error;

      toast({
        title: "Product updated",
        description: "Product details have been saved successfully.",
      });
      onProductUpdated();
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Product
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Product Name</Label>
            <Input
              value={formData.product_name}
              onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Price per Unit ($)</Label>
            <Input
              type="number"
              step="0.01"
              value={formData.price_per_unit}
              onChange={(e) => setFormData({ ...formData, price_per_unit: parseFloat(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Location</Label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Min Production</Label>
              <Input
                type="number"
                value={formData.min_production}
                onChange={(e) => setFormData({ ...formData, min_production: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Max Production</Label>
              <Input
                type="number"
                value={formData.max_production}
                onChange={(e) => setFormData({ ...formData, max_production: parseInt(e.target.value) || 0 })}
                className="mt-1"
              />
            </div>
          </div>

          <div>
            <Label>Shelf Life (days)</Label>
            <Input
              type="number"
              value={formData.expiry_days}
              onChange={(e) => setFormData({ ...formData, expiry_days: parseInt(e.target.value) || 0 })}
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} disabled={saving}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button variant="led" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProductEditModal;
