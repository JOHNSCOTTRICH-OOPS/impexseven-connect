import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AboutImageUploadProps {
  type: "company" | "founder";
  currentImageUrl: string | null;
  onImageUploaded: (url: string) => void;
}

export default function AboutImageUpload({
  type,
  currentImageUrl,
  onImageUploaded,
}: AboutImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${type}-photo.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("about-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("about-images")
        .getPublicUrl(fileName);

      const publicUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`;

      // Update about_settings table
      const { error: updateError } = await supabase
        .from("about_settings")
        .update({ 
          setting_value: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq("setting_key", `${type}_photo_url`);

      if (updateError) throw updateError;

      onImageUploaded(publicUrl);
      toast.success(`${type === "company" ? "Company" : "Founder"} photo updated!`);
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative group">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
        disabled={uploading}
      />
      
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 hover:bg-background"
      >
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </>
        )}
      </Button>
    </div>
  );
}
