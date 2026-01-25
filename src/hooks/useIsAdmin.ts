import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export function useIsAdmin(): { isAdmin: boolean; loading: boolean } {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check if user email is the admin email
      if (user.email === "njohnscottrich@gmail.com") {
        setIsAdmin(true);
        setLoading(false);
        return;
      }

      // Also check the user_roles table
      try {
        const { data, error } = await supabase.rpc("is_admin");
        if (!error && data) {
          setIsAdmin(true);
        }
      } catch {
        // Ignore errors, fall back to email check
      }

      setLoading(false);
    };

    checkAdmin();
  }, [user]);

  return { isAdmin, loading };
}
