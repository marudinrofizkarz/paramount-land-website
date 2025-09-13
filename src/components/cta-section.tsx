"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, PhoneCall, Send, ArrowRight } from "lucide-react";

export interface CTASectionProps {
  title?: string;
  subtitle?: string;
  bgImageUrl?: string;
  buttonText?: string;
  buttonLink?: string;
  whatsappNumber?: string;
}

export function CTASection({
  title = "Jadikan Impian Hunian Menjadi Kenyataan",
  subtitle = "Konsultasikan kebutuhan properti Anda dengan sales in-house kami dan dapatkan penawaran terbaik untuk investasi masa depan Anda.",
  bgImageUrl = "https://res.cloudinary.com/dx7xttb8a/image/upload/v1756095196/units/tu8ys33ehfb99uymnu5i.webp",
  buttonText = "Konsultasi Sekarang",
  buttonLink = "#",
  whatsappNumber = "6281387118533",
}: CTASectionProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log("Submitted:", { name, email });
    setSubmitted(true);

    // Reset form after showing success message
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
    }, 3000);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImageUrl}
          alt="Background"
          fill
          className="object-cover"
          quality={85}
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="text-white space-y-6 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
            <p className="text-white/80 text-lg">{subtitle}</p>

            {/* Benefits List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Lokasi strategis dengan aksesibilitas terbaik</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Desain modern dengan kualitas material premium</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <span>Nilai investasi yang terus meningkat</span>
              </div>
            </div>

            {/* CTA Button - Desktop */}
            <div className="hidden md:flex items-center gap-4 pt-2">
              <Button asChild size="lg" className="group">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Halo,%20saya%20tertarik%20dengan%20properti%20ini.%20Bisa%20tolong%20berikan%20informasi%20lebih%20lanjut?`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  {buttonText}
                  <ArrowRight className="h-4 w-0 overflow-hidden opacity-0 group-hover:w-4 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300" />
                </a>
              </Button>
              <Button
                variant="outline"
                asChild
                className="text-white border-white hover:bg-white/10"
              >
                <a href="tel:+6281387118533">
                  <PhoneCall className="h-4 w-4 mr-2" />
                  081387118533
                </a>
              </Button>
            </div>

            {/* CTA Button - Mobile (Only WhatsApp) */}
            <div className="md:hidden pt-2">
              <Button asChild size="lg" className="group w-full">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Halo,%20saya%20tertarik%20dengan%20properti%20ini.%20Bisa%20tolong%20berikan%20informasi%20lebih%20lanjut?`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <PhoneCall className="h-4 w-4 mr-2" />
                  {buttonText}
                  <ArrowRight className="h-4 w-0 overflow-hidden opacity-0 group-hover:w-4 group-hover:ml-2 group-hover:opacity-100 transition-all duration-300" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm p-6 md:p-8 rounded-lg border border-white/20">
            <h3 className="text-white text-xl font-semibold mb-4">
              Hubungi Kami
            </h3>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="text-white/90 text-sm block mb-2"
                  >
                    Nama Lengkap
                  </label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Masukkan nama Anda"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="text-white/90 text-sm block mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Send className="h-4 w-4 mr-2" />
                  Kirim Pesan
                </Button>
                <p className="text-white/60 text-xs text-center pt-2">
                  Kami akan menghubungi Anda dalam waktu 24 jam
                </p>
              </form>
            ) : (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h4 className="text-white text-xl font-semibold mb-2">
                  Pesan Terkirim!
                </h4>
                <p className="text-white/80">
                  Terima kasih telah menghubungi kami. Tim kami akan segera
                  menghubungi Anda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-black/40 to-transparent z-0" />
      <div className="absolute top-10 left-10 w-24 h-24 rounded-full bg-primary/20 blur-xl z-0" />
      <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/20 blur-xl z-0" />
    </section>
  );
}
