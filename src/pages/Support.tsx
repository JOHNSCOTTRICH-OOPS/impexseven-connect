import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, Phone, Send, MessageSquare, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const commonTopics = [
  {
    icon: HelpCircle,
    question: "How do I place an order?",
    answer:
      "To place an order, browse our products, select the items you need, choose your preferred Incoterm, set the quantity, and click 'Add to Cart' or 'Buy Now'. Once you proceed to checkout, your order will be placed and our team will confirm it with an official invoice.",
  },
  {
    icon: MessageSquare,
    question: "Shipping & Delivery",
    answer:
      "We offer shipping via Land, Air, and Ocean freight depending on the destination and product type. Our logistics team coordinates the best route and carrier for your order to ensure timely and safe delivery worldwide.",
  },
  {
    icon: HelpCircle,
    question: "Product Quality Assurance",
    answer:
      "All our products go through rigorous quality control processes. We ensure freshness, purity, and compliance with international food safety standards before every shipment leaves our facility.",
  },
];

export default function Support() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    company_name: "",
    email: "",
    subject: "",
    message: "",
  });

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "support@impexseven.com",
      href: "mailto:support@impexseven.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+91 9963530777",
      href: "tel:+919963530777",
    },
    {
      icon: MapPin,
      label: "Address",
      value: "Vijayawada, Andhra Pradesh, India",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a support request",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("support_requests").insert({
        user_id: user.id,
        name: formData.name,
        company_name: formData.company_name || null,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        request_type: "general",
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });

      setFormData({ name: "", company_name: "", email: "", subject: "", message: "" });
    } catch (error: any) {
      console.error("Error submitting support request:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-6">
              <span className="led-dot" />
              <span className="text-primary text-sm font-medium uppercase tracking-wider">
                Support
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
              <span className="text-foreground">How Can We </span>
              <span className="text-gradient-led">Help?</span>
            </h1>

            <p className="text-muted-foreground text-lg">
              Have questions or need assistance? Our support team is here to help you.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
                Contact Information
              </h2>

              <div className="space-y-6 mb-10">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-foreground hover:text-primary transition-colors font-medium"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* FAQ Cards with toggle answers */}
              <div className="space-y-3">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Common Topics
                </h3>

                {commonTopics.map((topic, index) => (
                  <div
                    key={index}
                    className="card-glass rounded-xl overflow-hidden transition-colors hover:border-primary/50"
                  >
                    <button
                      className="w-full flex items-center justify-between gap-3 p-4 text-left"
                      onClick={() => setExpandedTopic(expandedTopic === index ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <topic.icon className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-foreground font-medium">{topic.question}</span>
                      </div>
                      {expandedTopic === index ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                    {expandedTopic === index && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-sm text-muted-foreground leading-relaxed pl-8">
                          {topic.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Support Form */}
            <div className="card-glass p-8 rounded-2xl">
              <h2 className="font-display text-xl font-semibold text-foreground mb-6">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Your Name *</Label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-muted/50 border-border"
                      required
                    />
                  </div>
                  <div>
                    <Label className="text-sm text-muted-foreground mb-2 block">Company Name</Label>
                    <Input
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      placeholder="Company Ltd."
                      className="bg-muted/50 border-border"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Email Address *</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@company.com"
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Subject *</Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="How can we help?"
                    className="bg-muted/50 border-border"
                    required
                  />
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">Message *</Label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your inquiry..."
                    className="bg-muted/50 border-border min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" variant="led" size="lg" className="w-full" disabled={submitting}>
                  {submitting ? "Sending..." : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
