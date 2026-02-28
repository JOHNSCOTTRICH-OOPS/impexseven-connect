import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Check, ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhotoPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  type: "company" | "founder";
  currentImageUrl: string | null;
  onUploaded: () => void;
}

export default function PhotoPreviewDialog({
  open,
  onClose,
  type,
  currentImageUrl,
  onUploaded,
}: PhotoPreviewDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${type}-photo.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("about-images")
        .upload(fileName, selectedFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("about-images")
        .getPublicUrl(fileName);

      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("about_settings")
        .update({
          setting_value: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("setting_key", `${type}_photo_url`);

      if (updateError) throw updateError;

      toast.success(`${type === "company" ? "Company" : "Founder"} photo updated!`);
      onUploaded();
      handleClose();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    onClose();
  };

  const removeSelected = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const label = type === "company" ? "Company" : "Founder";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Update {label} Photo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current vs New comparison */}
          <div className="grid grid-cols-2 gap-4">
            {/* Current Photo */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground text-center">Current Photo</p>
              <div className={`aspect-square rounded-xl border-2 border-border overflow-hidden flex items-center justify-center bg-muted/30 ${
                type === "founder" ? "rounded-full mx-auto w-36 h-36" : ""
              }`}>
                {currentImageUrl ? (
                  <img src={currentImageUrl} alt={`Current ${label}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8 mb-1" />
                    <span className="text-xs">No photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* New Photo Preview */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-primary text-center">New Photo</p>
              <div className={`aspect-square rounded-xl border-2 overflow-hidden flex items-center justify-center ${
                previewUrl ? "border-primary bg-primary/5" : "border-dashed border-border bg-muted/10"
              } ${type === "founder" ? "rounded-full mx-auto w-36 h-36" : ""}`}>
                {previewUrl ? (
                  <div className="relative w-full h-full group">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={removeSelected}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer text-muted-foreground hover:text-primary transition-colors p-4">
                    <Upload className="w-8 h-8 mb-1" />
                    <span className="text-xs text-center">Click to select</span>
                    <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Preview on page mockup */}
          {previewUrl && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Preview on About page:</p>
              <div className="rounded-xl border border-border bg-card/50 p-4">
                {type === "founder" ? (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/50 flex-shrink-0">
                      <img src={previewUrl} alt="Founder preview" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-foreground">Meet the Founder</p>
                      <p className="text-sm text-muted-foreground">Driving Global Trade Excellence</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">Founder</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-full h-24 rounded-lg overflow-hidden border border-primary/30 mb-3">
                      <img src={previewUrl} alt="Company preview" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-display font-bold text-foreground">Your Trusted <span className="text-primary">Partner</span></p>
                    <p className="text-xs text-muted-foreground mt-1">ImpexSeven connects international buyers with premium Indian products...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Select button if no file chosen yet */}
          {!previewUrl && (
            <label className="block">
              <Button variant="outline" className="w-full" asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Select Photo from Device
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </span>
              </Button>
            </label>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose} disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || uploading} className="btn-led">
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Confirm & Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
