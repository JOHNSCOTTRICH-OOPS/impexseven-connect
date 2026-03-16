import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { getAuthError } from "@/lib/errorHandler";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<"buyer" | "supplier" | "both">("buyer");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (mode === "login") {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(getAuthError(error));
      } else {
        toast.success("Welcome back!");
        onClose();
        resetForm();
      }
    } else if (mode === "signup") {
      const { error } = await signUp(email, password, fullName, userType);
      if (error) {
        toast.error(getAuthError(error));
      } else {
        toast.success("Account created successfully!");
        onClose();
        resetForm();
      }
    } else if (mode === "forgot") {
      // Submit forgot password request to DB
      const { error } = await supabase
        .from("password_reset_requests")
        .insert({ email });
      if (error) {
        toast.error("Failed to submit request. Please try again.");
      } else {
        toast.success("Password reset request submitted! Admin will generate a new password for you.");
        setMode("login");
        setEmail("");
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setUserType("buyer");
    setMode("login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display led-text text-center">
            {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Forgot Password"}
          </DialogTitle>
        </DialogHeader>

        {mode === "forgot" && (
          <button
            type="button"
            onClick={() => setMode("login")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Sign In
          </button>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="bg-background border-border"
                />
              </div>

              <div className="space-y-2">
                <Label>I am a</Label>
                <div className="flex gap-2">
                  {(["buyer", "supplier", "both"] as const).map((type) => (
                    <Button
                      key={type}
                      type="button"
                      variant={userType === type ? "led" : "outline"}
                      size="sm"
                      onClick={() => setUserType(type)}
                      className="flex-1 capitalize"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-background border-border"
            />
          </div>

          {mode === "forgot" && (
            <p className="text-sm text-muted-foreground">
              Enter your email and our admin will generate a new password for you. You'll receive the new password to log in.
            </p>
          )}

          {mode !== "forgot" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="bg-background border-border"
              />
            </div>
          )}

          <Button type="submit" variant="led" className="w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign In"
              : mode === "signup"
              ? "Create Account"
              : "Submit Reset Request"}
          </Button>
        </form>

        <div className="text-center mt-4 space-y-2">
          {mode === "login" && (
            <>
              <button
                type="button"
                onClick={() => setMode("forgot")}
                className="text-sm text-primary hover:text-primary/80 transition-colors block mx-auto"
              >
                Forgot Password?
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors block mx-auto"
              >
                Don't have an account? Sign up
              </button>
            </>
          )}
          {mode === "signup" && (
            <button
              type="button"
              onClick={() => setMode("login")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
