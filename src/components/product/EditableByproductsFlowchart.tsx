import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Save, X, Plus, Trash2, Image, Link2, Layers, Leaf } from "lucide-react";
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
  compact?: boolean;
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
  compact = false,
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
        const { error } = await supabase.from("product_variants").insert(variantData);
        if (error) throw error;
      } else if (editingVariant) {
        const { error } = await supabase
          .from("product_variants")
          .update(variantData)
          .eq("id", editingVariant.id);
        if (error) throw error;
      }

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

  // Compact mode: render as button pills (like Incoterms)
  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            Available Forms
          </h3>
          {isAdmin && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-primary hover:bg-primary/10"
              onClick={handleAddNew}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => (
            <button
              key={variant.id}
              onClick={() => {
                if (isAdmin) {
                  handleEditStart(variant);
                } else if (variant.linked_product_id) {
                  handleVariantClick(variant);
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200
                ${variant.linked_product_id
                  ? "border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer"
                  : "border-border bg-muted/50 text-foreground hover:border-primary/40 hover:bg-primary/5"
                }
                ${isAdmin ? "cursor-pointer ring-1 ring-primary/20 hover:ring-primary/40" : ""}
              `}
            >
              {variant.photo_url ? (
                <img src={variant.photo_url} alt="" className="w-4 h-4 rounded-full object-cover" />
              ) : (
                <Leaf className="w-3 h-3 text-primary/60" />
              )}
              {variant.variant_name}
              {variant.linked_product_id && !isAdmin && (
                <Link2 className="w-3 h-3 text-primary/60" />
              )}
              {isAdmin && (
                <Edit2 className="w-3 h-3 text-primary/40" />
              )}
            </button>
          ))}
        </div>

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
      </div>
    );
  }

  // Full mode (original flowchart) - kept for backwards compatibility
  return (
    <div className="card-glass p-6 rounded-2xl">
      <h3 className="font-display text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Layers className="w-5 h-5 text-primary" />
        Available Product Forms
      </h3>
      <div className="grid grid-cols-2 gap-3 w-full">
        {variants.map((variant) => (
          <div
            key={variant.id}
            className="relative group"
            onClick={() => {
              if (isAdmin) handleEditStart(variant);
              else if (variant.linked_product_id) handleVariantClick(variant);
            }}
          >
            <div
              className={`bg-muted/50 border border-border rounded-lg px-3 py-3 text-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 ${
                variant.linked_product_id || isAdmin ? "cursor-pointer" : ""
              }`}
            >
              {variant.photo_url ? (
                <img src={variant.photo_url} alt={variant.variant_name} className="w-10 h-10 rounded-full object-cover mx-auto mb-1.5 border-2 border-primary/30" />
              ) : (
                <Leaf className="w-4 h-4 mx-auto mb-1.5 text-primary/70" />
              )}
              <span className="text-xs font-medium text-foreground block leading-tight">
                {variant.variant_name}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isAdmin && (
        <Button
          variant="outline"
          size="sm"
          className="mt-4 border-dashed border-primary/40 text-primary hover:bg-primary/10 w-full"
          onClick={handleAddNew}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Variant
        </Button>
      )}

      <Dialog open={isEditModalOpen} onOpenChange={(open) => !open && setIsEditModalOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isAddMode ? "Add Product Form" : "Edit Product Form"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label>Form Name</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1" autoFocus />
            </div>
            <div>
              <Label>Photo</Label>
              <div className="flex items-center gap-3 mt-1">
                {editPhotoUrl && <img src={editPhotoUrl} alt="" className="w-12 h-12 rounded-lg object-cover border border-border" />}
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-border cursor-pointer hover:border-primary/50 text-sm text-muted-foreground">
                  <Image className="w-4 h-4" />
                  {uploadingPhoto ? "Uploading..." : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} disabled={uploadingPhoto} />
                </label>
              </div>
            </div>
            <div>
              <Label>Link to Product</Label>
              <select value={editLinkedProductId} onChange={(e) => setEditLinkedProductId(e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="">None</option>
                {linkedProducts.map((p) => <option key={p.id} value={p.id}>{p.product_name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-3 justify-between">
            <div>
              {!isAddMode && editingVariant && !editingVariant.id.startsWith("default-") && (
                <Button variant="destructive" onClick={handleDelete} size="sm" disabled={saving}><Trash2 className="w-4 h-4 mr-1" />Delete</Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setIsEditModalOpen(false)} size="sm">Cancel</Button>
              <Button variant="led" onClick={handleSave} size="sm" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditableByproductsFlowchart;
