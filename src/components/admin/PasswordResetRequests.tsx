import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Key, CheckCircle, Clock, Copy, RefreshCw } from "lucide-react";

interface ResetRequest {
  id: string;
  email: string;
  status: string;
  new_password: string | null;
  created_at: string;
}

export default function PasswordResetRequests() {
  const [requests, setRequests] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [passwords, setPasswords] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("password_reset_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setRequests(data as ResetRequest[]);
    }
    setLoading(false);
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    let pwd = "";
    for (let i = 0; i < 12; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const handleResetPassword = async (request: ResetRequest) => {
    setGeneratingFor(request.id);
    const newPwd = passwords[request.id] || generatePassword();

    try {
      const { data, error } = await supabase.functions.invoke("admin-reset-password", {
        body: {
          email: request.email,
          new_password: newPwd,
          request_id: request.id,
        },
      });

      if (error) throw error;

      setPasswords((prev) => ({ ...prev, [request.id]: newPwd }));
      setRequests((prev) =>
        prev.map((r) =>
          r.id === request.id ? { ...r, status: "completed", new_password: newPwd } : r
        )
      );
      toast.success(`Password reset for ${request.email}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setGeneratingFor(null);
    }
  };

  const copyPassword = (pwd: string) => {
    navigator.clipboard.writeText(pwd);
    toast.success("Password copied to clipboard");
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="card-glass p-4 rounded-xl animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="card-glass p-8 rounded-xl text-center">
        <Key className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No password reset requests</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-xl font-bold flex items-center gap-2">
          <Key className="w-5 h-5 text-primary" />
          Password Reset Requests
        </h3>
        <Button variant="ledOutline" size="sm" onClick={fetchRequests}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Refresh
        </Button>
      </div>

      {requests.map((req) => (
        <div key={req.id} className="card-glass p-4 rounded-xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{req.email}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(req.created_at).toLocaleString()}
              </p>
            </div>
            <Badge
              className={
                req.status === "completed"
                  ? "bg-green-500/20 text-green-500 border-green-500/30"
                  : "bg-amber-500/20 text-amber-500 border-amber-500/30"
              }
            >
              {req.status === "completed" ? (
                <CheckCircle className="w-3 h-3 mr-1" />
              ) : (
                <Clock className="w-3 h-3 mr-1" />
              )}
              {req.status}
            </Badge>
          </div>

          {req.status === "pending" && (
            <div className="mt-3 flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  placeholder="Auto-generated password"
                  value={passwords[req.id] || ""}
                  onChange={(e) =>
                    setPasswords((p) => ({ ...p, [req.id]: e.target.value }))
                  }
                  className="bg-background border-border text-sm"
                />
              </div>
              <Button
                variant="led"
                size="sm"
                onClick={() => handleResetPassword(req)}
                disabled={generatingFor === req.id}
              >
                {generatingFor === req.id ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          )}

          {req.status === "completed" && req.new_password && (
            <div className="mt-3 flex items-center gap-2 bg-muted/30 p-3 rounded-lg">
              <code className="text-sm flex-1 text-primary">{req.new_password}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyPassword(req.new_password!)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
