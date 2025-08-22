"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Building2,
  User,
  Loader2,
  CheckCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import { submitContactInquiry } from "@/lib/contact-inquiry-actions";
import { ContactCard, SocialLinkCard } from "@/components/contact-card";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  inquiryType: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: `Subject: ${formData.subject}\n\n${formData.message}`,
        inquiryType: formData.inquiryType,
        projectId: "general_contact",
        projectName: "General Contact",
      });

      if (result.success) {
        setIsSubmitted(true);
        toast({
          title: "Message Sent Successfully!",
          description:
            "Thank you for contacting us. We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          inquiryType: "general",
        });
      } else {
        toast({
          title: "Error",
          description:
            result.error || "Failed to send message. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+62 21 2555 7777", "+62 811 9999 777"],
      action: "tel:+622125557777",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@paramount-land.com", "sales@paramount-land.com"],
      action: "mailto:info@paramount-land.com",
    },
    {
      icon: MapPin,
      title: "Head Office",
      details: [
        "Paramount Land Plaza",
        "Jl. Boulevard Raya Gading Serpong",
        "Tangerang 15810, Indonesia",
      ],
      action: "https://maps.google.com/?q=Paramount+Land+Plaza+Gading+Serpong",
    },
    // {
    //   icon: Clock,
    //   title: "Business Hours",
    //   details: [
    //     "Monday - Friday: 9:00 AM - 6:00 PM",
    //     "Saturday: 9:00 AM - 4:00 PM",
    //     "Sunday: Closed",
    //   ],
    // },
  ];

  const socialLinks = [
    {
      icon: Facebook,
      href: "https://facebook.com/paramountland",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://instagram.com/paramountland",
      label: "Instagram",
    },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/paramount-land",
      label: "LinkedIn",
    },
    {
      icon: Twitter,
      href: "https://twitter.com/paramountland",
      label: "Twitter",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header projects={[]} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 overflow-hidden">
          {/* Background with gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-background" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23000000%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-dot-pattern dark:bg-dot-pattern-dark" />
          </div>

          <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">
                <MessageSquare className="w-4 h-4 mr-2" />
                Get In Touch
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Contact Us
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to find your dream property? We're here to help you every
                step of the way. Reach out to our expert team today.
              </p>

              {/* Breadcrumb */}
              <nav className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <span>/</span>
                <span className="text-foreground">Contact</span>
              </nav>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
              {/* Contact Form */}
              <div className="order-2 lg:order-1">
                <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <Send className="w-6 h-6 text-primary" />
                      Send us a Message
                    </CardTitle>
                    <CardDescription className="text-base">
                      Fill out the form below and we'll get back to you as soon
                      as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isSubmitted ? (
                      <div className="text-center py-8">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          Message Sent!
                        </h3>
                        <p className="text-muted-foreground">
                          Thank you for contacting us. We'll respond within 24
                          hours.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name and Email Row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="flex items-center gap-2"
                            >
                              <User className="w-4 h-4" />
                              Full Name *
                            </Label>
                            <Input
                              id="name"
                              type="text"
                              placeholder="Enter your full name"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              required
                              disabled={isSubmitting}
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label
                              htmlFor="email"
                              className="flex items-center gap-2"
                            >
                              <Mail className="w-4 h-4" />
                              Email Address *
                            </Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="Enter your email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              required
                              disabled={isSubmitting}
                              className="h-11"
                            />
                          </div>
                        </div>

                        {/* Phone and Inquiry Type Row */}
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="phone"
                              className="flex items-center gap-2"
                            >
                              <Phone className="w-4 h-4" />
                              Phone Number *
                            </Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="Enter your phone number"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              required
                              disabled={isSubmitting}
                              className="h-11"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inquiryType">Inquiry Type</Label>
                            <Select
                              value={formData.inquiryType}
                              onValueChange={(value) =>
                                handleInputChange("inquiryType", value)
                              }
                              disabled={isSubmitting}
                            >
                              <SelectTrigger className="h-11">
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">
                                  General Information
                                </SelectItem>
                                <SelectItem value="residential">
                                  Residential Projects
                                </SelectItem>
                                <SelectItem value="commercial">
                                  Commercial Projects
                                </SelectItem>
                                <SelectItem value="investment">
                                  Investment Opportunities
                                </SelectItem>
                                <SelectItem value="partnership">
                                  Partnership
                                </SelectItem>
                                <SelectItem value="support">
                                  Customer Support
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Subject */}
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            type="text"
                            placeholder="Enter the subject of your inquiry"
                            value={formData.subject}
                            onChange={(e) =>
                              handleInputChange("subject", e.target.value)
                            }
                            required
                            disabled={isSubmitting}
                            className="h-11"
                          />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            placeholder="Tell us more about your inquiry..."
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            required
                            disabled={isSubmitting}
                            rows={5}
                            className="resize-none"
                          />
                        </div>

                        {/* Submit Button */}
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-12 text-base font-medium"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Contact Information */}
              <div className="order-1 lg:order-2 space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
                  <p className="text-muted-foreground text-lg mb-8">
                    We're here to help you find the perfect property solution.
                    Contact us through any of the following methods.
                  </p>
                </div>

                {/* Contact Info Cards - Modern Design */}
                <div className="grid gap-6">
                  <ContactCard
                    icon={Phone}
                    title="Call Us"
                    details={["081387118533"]}
                    action="tel:+6281387118533"
                    colorClass="from-blue-500 to-cyan-400"
                  />

                  <ContactCard
                    icon={Mail}
                    title="Email Us"
                    details={["rijal.sutanto@paramount-land.com"]}
                    action="mailto:rijal.sutanto@paramount-land.com"
                    colorClass="from-violet-500 to-fuchsia-500"
                  />

                  {/* <ContactCard
                    icon={MapPin}
                    title="Visit Our Office"
                    details={[
                      "Paramount Land Plaza",
                      "Jl. Boulevard Raya Gading Serpong",
                      "Tangerang 15810, Indonesia",
                    ]}
                    action="https://maps.google.com/?q=Paramount+Land+Plaza+Gading+Serpong"
                    colorClass="from-emerald-500 to-teal-400"
                  /> */}

                  {/* <ContactCard
                    icon={Clock}
                    title="Business Hours"
                    details={[
                      "Monday - Friday: 9:00 AM - 6:00 PM",
                      "Saturday: 9:00 AM - 4:00 PM",
                      "Sunday: Closed",
                    ]}
                    colorClass="from-amber-500 to-orange-400"
                  /> */}
                </div>

                {/* Social Media - Modern Design */}
                <div className="pt-6">
                  <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
                  <div className="grid grid-cols-4 gap-3">
                    <SocialLinkCard
                      href="https://facebook.com/paramountland"
                      colorClass="from-blue-600 to-blue-500"
                    >
                      <Facebook size={24} />
                    </SocialLinkCard>

                    <SocialLinkCard
                      href="https://instagram.com/paramountland"
                      colorClass="from-pink-500 to-orange-400"
                    >
                      <Instagram size={24} />
                    </SocialLinkCard>

                    <SocialLinkCard
                      href="https://linkedin.com/company/paramount-land"
                      colorClass="from-blue-600 to-blue-500"
                    >
                      <Linkedin size={24} />
                    </SocialLinkCard>

                    <SocialLinkCard
                      href="https://twitter.com/paramountland"
                      colorClass="from-cyan-500 to-blue-400"
                    >
                      <Twitter size={24} />
                    </SocialLinkCard>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4">
                  <Button asChild variant="outline" className="h-12">
                    <a href="tel:+6281387118533">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  <Button asChild variant="outline" className="h-12">
                    <a
                      href="https://wa.me/6281387118533"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      WhatsApp
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 md:px-8 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Find Our Office</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Visit us at our head office in Gading Serpong, Tangerang. We're
                easily accessible and ready to welcome you.
              </p>
            </div>

            <Card className="overflow-hidden shadow-lg">
              <div className="aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2234567890123!2d106.6234567890123!3d-6.234567890123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sParamount%20Land%20Plaza!5e0!3m2!1sen!2sid!4v1234567890123!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="dark:hue-rotate-180 dark:invert"
                  title="Paramount Land Office Location"
                />
              </div>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
