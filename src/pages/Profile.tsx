import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getUserFriendlyError } from "@/lib/errorHandler";
import AuthModal from "@/components/auth/AuthModal";
import PasswordResetRequests from "@/components/admin/PasswordResetRequests";
import {
  User,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Mail,
  RefreshCw
} from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  items: any[];
  total_amount: number;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchOrders();
      checkAdminStatus();
    } else {
      setLoading(false);
    }
  }, [user]);

  const checkAdminStatus = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase.rpc('is_admin');
      if (error) throw error;
      setIsAdmin(data === true);
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      // Cast the data properly since items is stored as JSONB
      setOrders((data || []).map(order => ({
        ...order,
        items: Array.isArray(order.items) ? order.items : []
      })));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    setUpdatingOrder(orderId);
    try {
      const { error } = await supabase.rpc('update_order_status', {
        _order_id: orderId,
        _status: newStatus
      });

      if (error) throw error;

      setOrders(prev =>
        prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
      );

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: getUserFriendlyError(error),
        variant: "destructive",
      });
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: "bg-amber-500/20 text-amber-500 border-amber-500/30",
      confirmed: "bg-green-500/20 text-green-500 border-green-500/30",
      shipped: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      delivered: "bg-green-600/20 text-green-600 border-green-600/30",
      cancelled: "bg-red-500/20 text-red-500 border-red-500/30",
    };
    return variants[status] || variants.pending;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-display font-bold mb-4">Sign in to view your profile</h1>
            <Button variant="led" onClick={() => setShowAuthModal(true)}>
              Sign In
            </Button>
          </div>
        </main>
        <Footer />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="led-dot" />
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                My Profile
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="text-foreground">Welcome, </span>
              <span className="text-gradient-led">{user.email?.split('@')[0]}</span>
            </h1>

            <p className="text-muted-foreground text-lg">
              View and manage your orders
            </p>
          </div>

          {/* Orders Section */}
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold flex items-center gap-2">
                <Package className="w-6 h-6 text-primary" />
                {isAdmin ? "All Orders" : "My Orders"}
              </h2>
              <Button variant="ledOutline" size="sm" onClick={fetchOrders}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="card-glass p-6 rounded-xl animate-pulse h-40" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="card-glass p-12 rounded-xl text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground">
                  Your orders will appear here once you submit a quote request
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="card-glass p-6 rounded-xl">
                    {/* Order Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">
                          Order #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge className={`${getStatusBadge(order.status)} flex items-center gap-1`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    {/* Customer Info (for admin) */}
                    {isAdmin && (
                      <div className="bg-muted/30 p-4 rounded-lg mb-4">
                        <h4 className="text-sm font-semibold mb-2 text-primary">Customer Details</h4>
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <span>{order.customer_name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{order.customer_email}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Items */}
                    <div className="space-y-2 mb-4">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm bg-muted/20 p-3 rounded-lg">
                          <div>
                            <span className="font-medium">{item.product_name}</span>
                            <span className="text-muted-foreground ml-2">
                              × {item.quantity} {item.quantity_unit || 'Tons'}
                            </span>
                          </div>
                          <span className="font-semibold">
                            ${((item.price_per_unit || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center border-t border-border pt-4">
                      <span className="font-semibold">Total Amount:</span>
                      <span className="text-xl font-bold text-gradient-led">
                        ${order.total_amount.toFixed(2)}
                      </span>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && order.status === 'pending' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                        <Button
                          variant="led"
                          size="sm"
                          className="flex-1"
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          disabled={updatingOrder === order.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm Order
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          disabled={updatingOrder === order.id}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}

                    {isAdmin && order.status === 'confirmed' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                        <Button
                          variant="led"
                          size="sm"
                          className="flex-1"
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          disabled={updatingOrder === order.id}
                        >
                          <Truck className="w-4 h-4 mr-2" />
                          Mark as Shipped
                        </Button>
                      </div>
                    )}

                    {isAdmin && order.status === 'shipped' && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                        <Button
                          variant="led"
                          size="sm"
                          className="flex-1"
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          disabled={updatingOrder === order.id}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Mark as Delivered
                        </Button>
                      </div>
                    )}

                    {/* Status Notification */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className={`p-3 rounded-lg ${
                        order.status === 'pending' 
                          ? 'bg-amber-500/10 border border-amber-500/30' 
                          : order.status === 'confirmed'
                          ? 'bg-green-500/10 border border-green-500/30'
                          : order.status === 'shipped'
                          ? 'bg-blue-500/10 border border-blue-500/30'
                          : order.status === 'delivered'
                          ? 'bg-green-600/10 border border-green-600/30'
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}>
                        <p className="text-sm flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span>
                            {order.status === 'pending' && "Your order is pending confirmation from admin"}
                            {order.status === 'confirmed' && "Your order has been confirmed!"}
                            {order.status === 'shipped' && "Your order has been shipped"}
                            {order.status === 'delivered' && "Your order has been delivered"}
                            {order.status === 'cancelled' && "This order was cancelled"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Admin: Password Reset Requests */}
          {isAdmin && (
            <div className="max-w-4xl mx-auto mt-12">
              <PasswordResetRequests />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}