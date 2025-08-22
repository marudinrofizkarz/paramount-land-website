"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useSweetAlert } from "@/hooks/use-sweet-alert";
import { Loader2, Mail, Phone, User, MessageSquare } from "lucide-react";
// Hapus import langsung dari server action
// import { submitContactInquiry } from "@/lib/contact-inquiry-actions";
import { serializeData } from "@/lib/serialization";
import { submitContactInquiryWrapper } from "./contact-inquiry-wrapper";

interface ContactInquiryModalProps {
  projectId: string;
  projectName: string;
  projectSlug?: string;
  unitSlug?: string;
  triggerClassName?: string;
}

export function ContactInquiryModal({
  projectId,
  projectName,
  projectSlug,
  unitSlug,
  triggerClassName = "w-full",
}: ContactInquiryModalProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { showSuccess, showError } = useSweetAlert();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    inquiryType: "general",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const submissionData = {
        ...formData,
        projectId,
        projectName,
        unitSlug: unitSlug || null,
      };
  
      // Gunakan wrapper untuk memanggil server action (tanpa perlu meneruskan fungsi server action)
      const serializedResult = await submitContactInquiryWrapper(null, submissionData);
  
      if (serializedResult.success) {
        // Gunakan SweetAlert untuk notifikasi sukses
        await showSuccess("Inquiry berhasil dikirim! Terima kasih atas minat Anda. Kami akan segera menghubungi Anda.");
        
        setOpen(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          inquiryType: "general",
        });
      } else {
        // Gunakan SweetAlert untuk notifikasi error
        await showError(serializedResult.error || "Gagal mengirim inquiry. Silakan coba lagi.");
      }
    } catch (error) {
      // Gunakan SweetAlert untuk notifikasi error
      await showError("Terjadi kesalahan yang tidak terduga. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Mail className="mr-2 h-4 w-4" />
          Contact for Inquiry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact for Inquiry
          </DialogTitle>
          <DialogDescription>
            Interested in <strong>{projectName}</strong>? Send us your inquiry and we'll get back to you soon.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Inquiry Type */}
          <div className="space-y-2">
            <Label htmlFor="inquiryType">Inquiry Type</Label>
            <Select
              value={formData.inquiryType}
              onValueChange={(value) => handleInputChange("inquiryType", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select inquiry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General Information</SelectItem>
                <SelectItem value="pricing">Pricing & Payment</SelectItem>
                <SelectItem value="visit">Schedule a Visit</SelectItem>
                {unitSlug && (
                  <SelectItem value="unit_specific">About This Unit</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Message
              <span className="text-sm text-muted-foreground ml-1">(Optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your inquiry..."
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Inquiry
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}