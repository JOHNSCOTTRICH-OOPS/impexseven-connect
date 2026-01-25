import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AboutImages {
  companyPhotoUrl: string | null;
  founderPhotoUrl: string | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useAboutImages(): AboutImages {
  const [companyPhotoUrl, setCompanyPhotoUrl] = useState<string | null>(null);
  const [founderPhotoUrl, setFounderPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from("about_settings")
        .select("setting_key, setting_value")
        .in("setting_key", ["company_photo_url", "founder_photo_url"]);

      if (error) throw error;

      data?.forEach((item) => {
        if (item.setting_key === "company_photo_url") {
          setCompanyPhotoUrl(item.setting_value);
        } else if (item.setting_key === "founder_photo_url") {
          setFounderPhotoUrl(item.setting_value);
        }
      });
    } catch (error) {
      console.error("Error fetching about images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  return {
    companyPhotoUrl,
    founderPhotoUrl,
    loading,
    refetch: fetchImages,
  };
}
