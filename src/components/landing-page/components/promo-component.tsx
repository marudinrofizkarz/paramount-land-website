"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  IconSettings,
  IconGift,
  IconCalendar,
  IconPercentage,
  IconTag,
  IconClock,
  IconMail,
  IconPhone,
} from "@tabler/icons-react";

interface PromoComponentConfig {
  title: string;
  subtitle: string;
  description: string;
  promoType: "discount" | "cashback" | "bonus" | "early-bird" | "limited-time";
  discountValue: string;
  originalPrice: string;
  discountedPrice: string;
  validUntil: string;
  terms: string[];
  ctaText: string;
  ctaLink: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
  showTimer: boolean;
  contactInfo: {
    phone: string;
    email: string;
    whatsapp: string;
  };
}

interface PromoComponentProps {
  id: string;
  config: PromoComponentConfig;
  onUpdate?: (config: PromoComponentConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

const defaultConfig: PromoComponentConfig = {
  title: "Promo Spesial Hari Ini!",
  subtitle: "Jangan Lewatkan Kesempatan Emas",
  description:
    "Dapatkan diskon fantastis untuk investasi properti impian Anda. Promo terbatas, buruan daftar sekarang!",
  promoType: "discount",
  discountValue: "30%",
  originalPrice: "Rp 500.000.000",
  discountedPrice: "Rp 350.000.000",
  validUntil: "2024-12-31",
  terms: [
    "Berlaku untuk pembelian unit tertentu",
    "Tidak dapat digabung dengan promo lain",
    "Syarat dan ketentuan berlaku",
  ],
  ctaText: "Klaim Promo Sekarang",
  ctaLink: "#contact",
  backgroundColor: "#ff6b35",
  textColor: "#ffffff",
  accentColor: "#ffd700",
  showTimer: true,
  contactInfo: {
    phone: "+62 812-3456-7890",
    email: "promo@property.com",
    whatsapp: "+62 812-3456-7890",
  },
};

export function PromoComponent({
  id,
  config = defaultConfig,
  onUpdate,
  previewMode,
  editable = true,
}: PromoComponentProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Ensure contactInfo always exists with proper defaults
  const safeConfig = {
    ...defaultConfig,
    ...config,
    contactInfo: {
      ...(config.contactInfo || defaultConfig.contactInfo),
    },
  };

  const [tempConfig, setTempConfig] = useState(safeConfig);
  const [timeLeft, setTimeLeft] = useState({
    days: 30,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  // Simulate countdown timer
  React.useEffect(() => {
    if (!safeConfig.showTimer) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return {
            ...prev,
            days: prev.days - 1,
            hours: 23,
            minutes: 59,
            seconds: 59,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [safeConfig.showTimer]);

  const handleSave = () => {
    onUpdate?.(tempConfig);
    setIsEditing(false);
  };

  const updateTempConfig = (key: string, value: any) => {
    setTempConfig((prev) => ({ ...prev, [key]: value }));
  };

  const updateContactInfo = (key: string, value: string) => {
    setTempConfig((prev) => ({
      ...prev,
      contactInfo: {
        ...(prev.contactInfo || { phone: "", email: "", whatsapp: "" }),
        [key]: value,
      },
    }));
  };

  const addTerm = () => {
    setTempConfig((prev) => ({
      ...prev,
      terms: [...prev.terms, "Syarat baru"],
    }));
  };

  const updateTerm = (index: number, value: string) => {
    setTempConfig((prev) => ({
      ...prev,
      terms: prev.terms.map((term, i) => (i === index ? value : term)),
    }));
  };

  const removeTerm = (index: number) => {
    setTempConfig((prev) => ({
      ...prev,
      terms: prev.terms.filter((_, i) => i !== index),
    }));
  };

  const promoTypeLabels = {
    discount: "Diskon",
    cashback: "Cashback",
    bonus: "Bonus",
    "early-bird": "Early Bird",
    "limited-time": "Waktu Terbatas",
  };

  const promoTypeIcons = {
    discount: IconPercentage,
    cashback: IconGift,
    bonus: IconTag,
    "early-bird": IconCalendar,
    "limited-time": IconClock,
  };

  const PromoTypeIcon = promoTypeIcons[safeConfig.promoType];

  const containerClass =
    previewMode === "mobile"
      ? "px-4 py-8"
      : previewMode === "tablet"
      ? "px-8 py-12"
      : "px-16 py-16";

  return (
    <div className={`relative ${containerClass}`}>
      {/* Edit Button */}
      {editable && (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white"
            >
              <IconSettings className="w-4 h-4" />
              Edit Promo
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Promo Component</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Konten</TabsTrigger>
                <TabsTrigger value="pricing">Harga</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
                <TabsTrigger value="contact">Kontak</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Judul Promo</Label>
                    <Input
                      value={tempConfig.title}
                      onChange={(e) =>
                        updateTempConfig("title", e.target.value)
                      }
                      placeholder="Promo Spesial Hari Ini!"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={tempConfig.subtitle}
                      onChange={(e) =>
                        updateTempConfig("subtitle", e.target.value)
                      }
                      placeholder="Jangan Lewatkan Kesempatan Emas"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Deskripsi</Label>
                  <Textarea
                    value={tempConfig.description}
                    onChange={(e) =>
                      updateTempConfig("description", e.target.value)
                    }
                    rows={3}
                    placeholder="Deskripsi promo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipe Promo</Label>
                    <Select
                      value={tempConfig.promoType}
                      onValueChange={(value) =>
                        updateTempConfig("promoType", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(promoTypeLabels).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Nilai Diskon</Label>
                    <Input
                      value={tempConfig.discountValue}
                      onChange={(e) =>
                        updateTempConfig("discountValue", e.target.value)
                      }
                      placeholder="30%"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>CTA Text</Label>
                    <Input
                      value={tempConfig.ctaText}
                      onChange={(e) =>
                        updateTempConfig("ctaText", e.target.value)
                      }
                      placeholder="Klaim Promo Sekarang"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>CTA Link</Label>
                    <Input
                      value={tempConfig.ctaLink}
                      onChange={(e) =>
                        updateTempConfig("ctaLink", e.target.value)
                      }
                      placeholder="#contact"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Syarat & Ketentuan</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTerm}
                    >
                      Tambah Syarat
                    </Button>
                  </div>

                  {tempConfig.terms.map((term, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={term}
                        onChange={(e) => updateTerm(index, e.target.value)}
                        placeholder="Syarat & ketentuan"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTerm(index)}
                      >
                        Hapus
                      </Button>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Harga Asli</Label>
                    <Input
                      value={tempConfig.originalPrice}
                      onChange={(e) =>
                        updateTempConfig("originalPrice", e.target.value)
                      }
                      placeholder="Rp 500.000.000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Harga Promo</Label>
                    <Input
                      value={tempConfig.discountedPrice}
                      onChange={(e) =>
                        updateTempConfig("discountedPrice", e.target.value)
                      }
                      placeholder="Rp 350.000.000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Berlaku Hingga</Label>
                  <Input
                    type="date"
                    value={tempConfig.validUntil}
                    onChange={(e) =>
                      updateTempConfig("validUntil", e.target.value)
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="showTimer"
                    checked={tempConfig.showTimer}
                    onChange={(e) =>
                      updateTempConfig("showTimer", e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="showTimer">Tampilkan Timer Countdown</Label>
                </div>
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <Input
                      type="color"
                      value={tempConfig.backgroundColor}
                      onChange={(e) =>
                        updateTempConfig("backgroundColor", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <Input
                      type="color"
                      value={tempConfig.textColor}
                      onChange={(e) =>
                        updateTempConfig("textColor", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Accent Color</Label>
                    <Input
                      type="color"
                      value={tempConfig.accentColor}
                      onChange={(e) =>
                        updateTempConfig("accentColor", e.target.value)
                      }
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="contact" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nomor Telepon</Label>
                    <Input
                      value={tempConfig.contactInfo?.phone || ""}
                      onChange={(e) =>
                        updateContactInfo("phone", e.target.value)
                      }
                      placeholder="+62 812-3456-7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      value={tempConfig.contactInfo?.email || ""}
                      onChange={(e) =>
                        updateContactInfo("email", e.target.value)
                      }
                      placeholder="promo@property.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>WhatsApp</Label>
                  <Input
                    value={tempConfig.contactInfo?.whatsapp || ""}
                    onChange={(e) =>
                      updateContactInfo("whatsapp", e.target.value)
                    }
                    placeholder="+62 812-3456-7890"
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Batal
              </Button>
              <Button onClick={handleSave}>Simpan</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Promo Content */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ backgroundColor: safeConfig.backgroundColor }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24 opacity-20"></div>
        </div>

        <div className={`relative z-10 ${containerClass}`}>
          <div className="max-w-4xl mx-auto text-center">
            {/* Promo Type Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <PromoTypeIcon
                className="w-5 h-5"
                style={{ color: safeConfig.accentColor }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: safeConfig.textColor }}
              >
                {promoTypeLabels[safeConfig.promoType]}
              </span>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h2
                  className={`font-bold ${
                    previewMode === "mobile" ? "text-3xl" : "text-5xl"
                  }`}
                  style={{ color: safeConfig.textColor }}
                >
                  {safeConfig.title}
                </h2>
                <h3
                  className={`font-medium ${
                    previewMode === "mobile" ? "text-lg" : "text-2xl"
                  }`}
                  style={{ color: safeConfig.accentColor }}
                >
                  {safeConfig.subtitle}
                </h3>
              </div>

              <p
                className={`${
                  previewMode === "mobile" ? "text-base" : "text-lg"
                } opacity-90`}
                style={{ color: safeConfig.textColor }}
              >
                {safeConfig.description}
              </p>

              {/* Discount Display */}
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <div
                    className={`font-bold ${
                      previewMode === "mobile" ? "text-4xl" : "text-6xl"
                    }`}
                    style={{ color: safeConfig.accentColor }}
                  >
                    {safeConfig.discountValue}
                  </div>
                  <div
                    className="text-sm opacity-75"
                    style={{ color: safeConfig.textColor }}
                  >
                    DISKON
                  </div>
                </div>

                <div className="flex items-center gap-4 text-center">
                  <div>
                    <div
                      className="text-sm opacity-75"
                      style={{ color: safeConfig.textColor }}
                    >
                      Harga Normal
                    </div>
                    <div
                      className="line-through"
                      style={{ color: safeConfig.textColor }}
                    >
                      {safeConfig.originalPrice}
                    </div>
                  </div>
                  <div
                    className="text-2xl"
                    style={{ color: safeConfig.accentColor }}
                  >
                    →
                  </div>
                  <div>
                    <div
                      className="text-sm opacity-75"
                      style={{ color: safeConfig.textColor }}
                    >
                      Harga Promo
                    </div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: safeConfig.accentColor }}
                    >
                      {safeConfig.discountedPrice}
                    </div>
                  </div>
                </div>
              </div>

              {/* Countdown Timer */}
              {safeConfig.showTimer && (
                <div className="py-6">
                  <div
                    className="text-sm font-medium mb-3"
                    style={{ color: safeConfig.textColor }}
                  >
                    Promo Berakhir Dalam:
                  </div>
                  <div className={`grid grid-cols-4 gap-2 max-w-sm mx-auto`}>
                    {Object.entries(timeLeft).map(([unit, value]) => (
                      <div key={unit} className="text-center">
                        <div
                          className="bg-white/20 backdrop-blur-sm rounded-lg p-3 font-bold text-xl"
                          style={{ color: safeConfig.textColor }}
                        >
                          {value.toString().padStart(2, "0")}
                        </div>
                        <div
                          className="text-xs mt-1 opacity-75"
                          style={{ color: safeConfig.textColor }}
                        >
                          {unit === "days"
                            ? "Hari"
                            : unit === "hours"
                            ? "Jam"
                            : unit === "minutes"
                            ? "Menit"
                            : "Detik"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Button */}
              <div className="pt-4">
                <Button
                  className={`${
                    previewMode === "mobile"
                      ? "px-8 py-3 text-base"
                      : "px-12 py-4 text-lg"
                  } font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300`}
                  style={{
                    backgroundColor: safeConfig.accentColor,
                    color: safeConfig.backgroundColor,
                    border: "none",
                  }}
                >
                  <IconGift className="w-5 h-5 mr-2" />
                  {safeConfig.ctaText}
                </Button>
              </div>

              {/* Contact Info */}
              <div
                className={`grid ${
                  previewMode === "mobile" ? "grid-cols-1" : "grid-cols-3"
                } gap-4 pt-6`}
              >
                <div className="flex items-center justify-center gap-2">
                  <IconPhone
                    className="w-4 h-4"
                    style={{ color: safeConfig.accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: safeConfig.textColor }}
                  >
                    {safeConfig.contactInfo?.phone || "+62 812-3456-7890"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <IconMail
                    className="w-4 h-4"
                    style={{ color: safeConfig.accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: safeConfig.textColor }}
                  >
                    {safeConfig.contactInfo?.email || "promo@property.com"}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <IconPhone
                    className="w-4 h-4"
                    style={{ color: safeConfig.accentColor }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: safeConfig.textColor }}
                  >
                    WhatsApp:{" "}
                    {safeConfig.contactInfo?.whatsapp || "+62 812-3456-7890"}
                  </span>
                </div>
              </div>

              {/* Terms */}
              {safeConfig.terms.length > 0 && (
                <div className="pt-6">
                  <div
                    className="text-xs opacity-60"
                    style={{ color: safeConfig.textColor }}
                  >
                    <div className="font-medium mb-2">Syarat & Ketentuan:</div>
                    <ul className="list-disc list-inside space-y-1 max-w-2xl mx-auto text-left">
                      {safeConfig.terms.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
