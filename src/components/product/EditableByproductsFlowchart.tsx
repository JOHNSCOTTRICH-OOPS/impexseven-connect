import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowDown, Leaf, Package, Layers, Edit2, Save, X, Plus, Trash2, Image, Link2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProductVariant {
  id: string;
  variant_name: string;
  photo_url: string | null;
  linked_product_id: string | null;
  sort_order: number;
}

interface EditableByproductsFlowchartProps {
  productName: string;
  category: string | null;
  productId: string;
  onProductEdit?: () => void;
}

const categoryProductVariants: Record<string, string[]> = {
  "Fresh Produce": ["Whole", "Sliced", "Diced", "Frozen"],
  "Spices": ["Whole", "Ground Powder", "Flakes", "Oil Extract"],
  "Seafood": ["Fresh Whole", "Filleted", "Frozen", "Dried"],
  "Fruits": ["Fresh Whole", "Sliced", "Dried", "Juice/Pulp"],
  "Vegetables": ["Fresh Whole", "Chopped", "Frozen", "Dehydrated"],
  "Grains": ["Whole Grain", "Flour", "Flakes", "Bran"],
  "Dairy": ["Fresh", "Processed", "Powdered", "Cultured"],
  "Meat": ["Fresh Cuts", "Minced", "Frozen", "Cured"],
  "Other": ["Standard", "Processed", "Custom", "Bulk"],
};

const EditableByproductsFlowchart = ({
  productName,
  category,
  productId,
  onProductEdit,
}: EditableByproductsFlowchartProps) => {
  const navigate = useNavigate();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(true);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhotoUrl, setEditPhotoUrl] = useState("");
  const [editLinkedProductId, setEditLinkedProductId] = useState("");
  const [linkedProducts, setLinkedProducts] = useState<{ id: string; product_name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const defaultVariants = useMemo(() => {
    return categoryProductVariants[category || "Other"] || categoryProductVariants["Other"];
  }, [category]);

  // Fetch variants from DB
  useEffect(() => {
    fetchVariants();
  }, [productId]);

  const fetchVariants = async () => {
    try {
      const { data, error } = await supabase
        .from("product_variants")
        .select("*")
        .eq("parent_product_id", productId)
        .order("sort_order");

      if (error) throw error;

      if (data && data.length > 0) {
        setVariants(data);
      } else {
        // Use defaults if no DB variants exist
        setVariants(
          defaultVariants.map((name, i) => ({
            id: `default-${i}`,
            variant_name: name,
            photo_url: null,
            linked_product_id: null,
            sort_order: i,
          }))
        );
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
      setVariants(
        defaultVariants.map((name, i) => ({
          id: `default-${i}`,
          variant_name: name,
          photo_url: null,
          linked_product_id: null,
          sort_order: i,
        }))
      );
    } finally {
      setLoadingVariants(false);
    }
  };

  const fetchLinkedProducts = async () => {
    const { data } = await supabase
      .from("seller_products")
      .select("id, product_name")
      .eq("status", "active")
      .neq("id", productId)
      .limit(50);
    if (data) setLinkedProducts(data);
  };

  const handleVariantClick = (variant: ProductVariant) => {
    if (variant.linked_product_id) {
      navigate(`/product/${variant.linked_product_id}`);
    }
  };

  const handleEditStart = (variant: ProductVariant) => {
    if (!isAdmin) return;
    setEditingVariant(variant);
    setEditName(variant.variant_name);
    setEditPhotoUrl(variant.photo_url || "");
    setEditLinkedProductId(variant.linked_product_id || "");
    setIsAddMode(false);
    setIsEditModalOpen(true);
    fetchLinkedProducts();
  };

  const handleAddNew = () => {
    setEditingVariant(null);
    setEditName("");
    setEditPhotoUrl("");
    setEditLinkedProductId("");
    setIsAddMode(true);
    setIsEditModalOpen(true);
    fetchLinkedProducts();
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `variants/${productId}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage.from("product-photos").getPublicUrl(path);
      setEditPhotoUrl(urlData.publicUrl);
      toast({ title: "Photo uploaded" });
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      const variantData = {
        parent_product_id: productId,
        variant_name: editName.trim(),
        photo_url: editPhotoUrl || null,
        linked_product_id: editLinkedProductId || null,
        sort_order: isAddMode ? variants.length : (editingVariant?.sort_order ?? 0),
      };

      if (isAddMode || editingVariant?.id.startsWith("default-")) {
        // Insert new
        const { error } = await supabase.from("product_variants").insert(variantData);
        if (error) throw error;
      } else if (editingVariant) {
        // Update existing
        const { error } = await supabase
          .from("product_variants")
          .update(variantData)
          .eq("id", editingVariant.id);
        if (error) throw error;
      }

      // If saving a default variant, also save all other defaults
      if (editingVariant?.id.startsWith("default-")) {
        const otherDefaults = variants.filter(
          (v) => v.id.startsWith("default-") && v.id !== editingVariant.id
        );
        if (otherDefaults.length > 0) {
          const inserts = otherDefaults.map((v) => ({
            parent_product_id: productId,
            variant_name: v.variant_name,
            photo_url: v.photo_url,
            linked_product_id: v.linked_product_id,
            sort_order: v.sort_order,
          }));
          await supabase.from("product_variants").insert(inserts);
        }
      }

      toast({ title: "Saved" });
      setIsEditModalOpen(false);
      fetchVariants();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!editingVariant || editingVariant.id.startsWith("default-")) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", editingVariant.id);
      if (error) throw error;
      toast({ title: "Variant deleted" });
      setIsEditModalOpen(false);
      fetchVariants();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleProductClick = () => {
    if (isAdmin && onProductEdit) {
      onProductEdit();
    }
  };

  return (
    <div className="card-glass p-6 rounded-2xl">
      <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Layers className="w-5 h-5 text-primary" />
        Available Product Forms
        {isAdmin && (
          <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded-full ml-auto">
            Admin Mode
          </span>
        )}
      </h3>

      <div className="flex flex-col items-center">
        {/* Main Product Node */}
        <div
          className={`relative group ${isAdmin ? "cursor-pointer" : ""}`}
          onClick={handleProductClick}
        >
          <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse" />
          <div
            className={`relative bg-primary/20 border-2 border-primary rounded-xl px-6 py-4 text-center min-w-[160px] shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105 group-hover:border-primary group-hover:shadow-xl group-hover:shadow-primary/40 ${isAdmin ? "ring-2 ring-primary/30 ring-offset-2 ring-offset-background" : ""}`}
          >
            <Package className="w-6 h-6 mx-auto mb-2 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="font-semibold text-foreground text-sm leading-tight block">
              {productName}
            </span>
            {isAdmin && (
              <span className="text-[10px] text-primary mt-1 block">Click to edit product</span>
            )}
          </div>
        </div>

        <div className="my-3">
          <ArrowDown className="w-6 h-6 text-primary animate-bounce" />
        </div>

        {/* Processing Node */}
        <div className="group relative">
          <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 rounded-lg px-4 py-2 text-center transition-all duration-300 group-hover:border-primary/60 group-hover:scale-105">
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
              Available Forms
            </span>
          </div>
        </div>

        <div className="my-3">
          <ArrowDown className="w-6 h-6 text-primary animate-bounce" style={{ animationDelay: "0.1s" }} />
        </div>

        {/* Product Variants Grid */}
        <div className="grid grid-cols-2 gap-3 w-full">
          {variants.map((variant, index) => (
            <div
              key={variant.id}
              className="relative group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="absolute -top-3 left-1/2 w-px h-3 bg-primary/30 group-hover:bg-primary transition-colors duration-300" />
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div
                className={`relative bg-muted/50 border border-border rounded-lg px-3 py-3 text-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 group-hover:shadow-lg group-hover:shadow-primary/20 group-hover:scale-105 group-hover:-translate-y-1 ${
                  variant.linked_product_id ? "cursor-pointer ring-1 ring-primary/30" : ""
                } ${isAdmin ? "cursor-pointer" : ""}`}
                onClick={() => {
                  if (isAdmin) {
                    handleEditStart(variant);
                  } else if (variant.linked_product_id) {
                    handleVariantClick(variant);
                  }
                }}
              >
                {variant.photo_url ? (
                  <img
                    src={variant.photo_url}
                    alt={variant.variant_name}
                    className="w-10 h-10 rounded-full object-cover mx-auto mb-1.5 border-2 border-primary/30"
                  />
                ) : (
                  <Leaf className="w-4 h-4 mx-auto mb-1.5 text-primary/70 transition-all duration-300 group-hover:text-primary group-hover:scale-110 group-hover:animate-pulse" />
                )}
                <span className="text-xs font-medium text-foreground block leading-tight transition-colors duration-300 group-hover:text-primary">
                  {variant.variant_name}
                </span>
                {variant.linked_product_id && !isAdmin && (
                  <Link2 className="w-3 h-3 mx-auto mt-1 text-primary/60" />
                )}
                {isAdmin && (
                  <Edit2 className="w-3 h-3 absolute top-1 right-1 text-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-dashed border-primary/40 text-primary hover:bg-primary/10"
            onClick={handleAddNew}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Variant
          </Button>
        )}

        {/* Edit Variant Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-primary" />
                {isAddMode ? "Add Product Form" : "Edit Product Form"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label className="text-sm font-medium">Form Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="mt-1"
                  placeholder="e.g., Ground Powder, Flakes..."
                  autoFocus
                />
              </div>

              {/* Photo */}
              <div>
                <Label className="text-sm font-medium">Photo</Label>
                <div className="flex items-center gap-3 mt-1">
                  {editPhotoUrl && (
                    <img src={editPhotoUrl} alt="variant" className="w-12 h-12 rounded-lg object-cover border border-border" />
                  )}
                  <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground">
                    <Image className="w-4 h-4" />
                    {uploadingPhoto ? "Uploading..." : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                  </label>
                  {editPhotoUrl && (
                    <Button variant="ghost" size="sm" onClick={() => setEditPhotoUrl("")}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Link to Product */}
              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Link2 className="w-3 h-3" />
                  Link to Product
                </Label>
                <select
                  value={editLinkedProductId}
                  onChange={(e) => setEditLinkedProductId(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">None (no link)</option>
                  {linkedProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.product_name}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  When linked, clicking this variant will navigate to the linked product.
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-between">
              <div>
                {!isAddMode && editingVariant && !editingVariant.id.startsWith("default-") && (
                  <Button variant="destructive" onClick={handleDelete} size="sm" disabled={saving}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)} size="sm">
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button variant="led" onClick={handleSave} size="sm" disabled={saving}>
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <p className="text-xs text-muted-foreground text-center mt-4 px-2">
          {isAdmin
            ? "Click any form to edit. Link variants to other products."
            : `Select your preferred form of ${productName.toLowerCase()} when ordering`}
        </p>
      </div>
    </div>
  );
};

export default EditableByproductsFlowchart;
