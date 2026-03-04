import { useState, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Check, ImageIcon, Crop } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactCrop, { type Crop as CropType, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface PhotoPreviewDialogProps {
  open: boolean;
  onClose: () => void;
  type: "company" | "founder";
  currentImageUrl: string | null;
  onUploaded: () => void;
}

function getCroppedBlob(image: HTMLImageElement, crop: PixelCrop): Promise<Blob> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Failed to crop image"));
    }, "image/jpeg", 0.92);
  });
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 80 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight
  );
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
  const [croppedPreviewUrl, setCroppedPreviewUrl] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [uploading, setUploading] = useState(false);
  const [crop, setCrop] = useState<CropType>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isCropping, setIsCropping] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const aspect = type === "founder" ? 1 : 16 / 9;

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
    setCroppedPreviewUrl(null);
    setCroppedBlob(null);
    setCompletedCrop(undefined);
    setIsCropping(true);
  };

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    },
    [aspect]
  );

  const handleApplyCrop = async () => {
    if (!imgRef.current || !completedCrop) return;
    try {
      const blob = await getCroppedBlob(imgRef.current, completedCrop);
      if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
      const url = URL.createObjectURL(blob);
      setCroppedBlob(blob);
      setCroppedPreviewUrl(url);
      setIsCropping(false);
      toast.success("Crop applied! Check the preview below.");
    } catch {
      toast.error("Failed to crop image");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile && !croppedBlob) return;
    setUploading(true);

    try {
      const fileToUpload: Blob | File = croppedBlob ?? selectedFile!;
      const contentType = fileToUpload.type || "image/jpeg";

      const fileName = `${type}-photo.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("about-images")
        .upload(fileName, fileToUpload, { upsert: true, contentType });

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
    if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedPreviewUrl(null);
    setCroppedBlob(null);
    setCompletedCrop(undefined);
    setIsCropping(false);
    onClose();
  };

  const removeSelected = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (croppedPreviewUrl) URL.revokeObjectURL(croppedPreviewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setCroppedPreviewUrl(null);
    setCompletedCrop(undefined);
    setIsCropping(false);
  };

  const label = type === "company" ? "Company" : "Founder";
  const finalPreview = croppedPreviewUrl || previewUrl;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            Update {label} Photo
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Cropping Area */}
          {previewUrl && isCropping && (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground flex items-center gap-2">
                <Crop className="w-4 h-4 text-primary" />
                Drag to crop your photo
              </p>
              <div className="rounded-xl border border-border bg-muted/20 p-2 flex justify-center">
                <ReactCrop
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => setCompletedCrop(c)}
                  aspect={aspect}
                  className="max-h-[300px]"
                >
                  <img
                    ref={imgRef}
                    src={previewUrl}
                    alt="Crop"
                    onLoad={onImageLoad}
                    className="max-h-[300px] object-contain"
                  />
                </ReactCrop>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsCropping(false)}>
                  Skip Crop
                </Button>
                <Button size="sm" onClick={handleApplyCrop} disabled={!completedCrop} className="btn-led">
                  <Check className="w-4 h-4 mr-1" />
                  Apply Crop
                </Button>
              </div>
            </div>
          )}

          {/* Side by side: Current vs New */}
          {previewUrl && !isCropping && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground text-center">Current</p>
                <div className={`aspect-square rounded-xl border-2 border-border overflow-hidden flex items-center justify-center bg-muted/30 ${
                  type === "founder" ? "rounded-full mx-auto w-32 h-32" : ""
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

              <div className="space-y-2">
                <p className="text-sm font-medium text-primary text-center">
                  New {croppedPreviewUrl ? "(Cropped)" : ""}
                </p>
                <div className={`aspect-square rounded-xl border-2 border-primary overflow-hidden flex items-center justify-center bg-primary/5 relative group ${
                  type === "founder" ? "rounded-full mx-auto w-32 h-32" : ""
                }`}>
                  <img src={finalPreview!} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={removeSelected}
                    className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex gap-1 justify-center">
                  <Button variant="ghost" size="sm" onClick={() => setIsCropping(true)} className="text-xs">
                    <Crop className="w-3 h-3 mr-1" />
                    Re-crop
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Preview on page mockup */}
          {finalPreview && !isCropping && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Preview on About page:</p>
              <div className="rounded-xl border border-border bg-card/50 p-4">
                {type === "founder" ? (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-secondary/50 flex-shrink-0">
                      <img src={finalPreview} alt="Founder preview" className="w-full h-full object-cover" />
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
                      <img src={finalPreview} alt="Company preview" className="w-full h-full object-cover" />
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
          <Button onClick={handleUpload} disabled={!selectedFile || uploading || isCropping} className="btn-led">
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
