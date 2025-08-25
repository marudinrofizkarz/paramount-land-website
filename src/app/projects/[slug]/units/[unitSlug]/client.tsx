"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  Car,
  Ruler,
  ArrowLeft,
  Phone,
  Mail,
  ChevronRight,
  MapPin,
  Check,
  Building,
  Shield,
  Home,
  DollarSign,
  FileText,
  Calendar,
  Info,
  X,
  ChevronLeft,
  ZoomIn,
  Download,
  MessageCircle,
} from "lucide-react";

// Impor Header dan Footer
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { UnitSidebarCards } from "@/components/unit-sidebar-cards";
import { UnitPromoCard } from "@/components/unit-promo-card";

export default function UnitDetailClient({
  unitResponse,
  projectsResponse,
  params,
}: {
  unitResponse: any;
  projectsResponse: any;
  params: { slug: string; unitSlug: string };
}) {
  const { slug, unitSlug } = params;
  const [activeImage, setActiveImage] = useState("");
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [unit, setUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    // Process the data from server
    if (unitResponse.success && unitResponse.unit) {
      setUnit(unitResponse.unit);
      // Set gambar utama sebagai gambar aktif
      if (unitResponse.unit.main_image) {
        setActiveImage(unitResponse.unit.main_image);
      }
      setError(null);
    } else {
      setError(unitResponse.error || "Failed to load unit data");
    }

    if (projectsResponse.success) {
      setProjects(projectsResponse.data || []);
    }
    
    setLoading(false);
  }, [unitResponse, projectsResponse]);

  // Format currency
  const formatCurrency = (value: string) => {
    if (!value) return "";
    const number = parseInt(value);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header projects={projects} />
        <main className="flex-1 flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="h-5 w-5 animate-spin rounded-full border-t-2 border-primary"></div>
            <p>Loading unit details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header projects={projects} />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Error</h2>
            <p className="text-red-500">{error}</p>
            <Button asChild className="mt-6">
              <Link href={`/projects/${slug}`}>Back to Project</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header projects={projects} />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Unit Not Found</h2>
            <p>
              The unit you are looking for does not exist or has been removed.
            </p>
            <Button asChild className="mt-6">
              <Link href={`/projects/${slug}`}>Back to Project</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Ekstrak data unit untuk kemudahan penggunaan
  const {
    name,
    description,
    type,
    sale_price,
    dimensions,
    land_area,
    building_area,
    bedrooms,
    bathrooms,
    carports,
    floors,
    certification,
    facilities,
    main_image,
    gallery_images,
    youtube_url,
    brochure_url,
    status,
    address,
    project_name,
    location,
    project_status,
    project_id,
    promo,
  } = unit;

  // Konversi facilities dari string ke array jika perlu
  const facilitiesList = Array.isArray(facilities)
    ? facilities
    : typeof facilities === "string"
    ? facilities.split(",").map((f) => f.trim())
    : [];

  // Konversi gallery_images dari string ke array jika perlu
  const galleryImagesList = Array.isArray(gallery_images)
    ? gallery_images
    : typeof gallery_images === "string"
    ? gallery_images.split(",").map((img) => img.trim())
    : [];

  // Gabungkan semua gambar untuk carousel
  const allImages = [main_image, ...galleryImagesList].filter(Boolean);

  // Function untuk membuka modal dengan gambar tertentu
  const openImageModal = (imageIndex: number) => {
    setModalImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  // Function untuk navigasi gambar di modal
  const navigateImage = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setModalImageIndex((prev) =>
        prev === 0 ? allImages.length - 1 : prev - 1
      );
    } else {
      setModalImageIndex((prev) =>
        prev === allImages.length - 1 ? 0 : prev + 1
      );
    }
  };

  // Function untuk download gambar
  const downloadImage = (imageUrl: string, imageName: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${imageName}-${modalImageIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header projects={projects} />
      <main className="flex-1 bg-background">
        {/* Hero Section dengan Breadcrumb */}
        <div className="bg-muted py-6">
          <div className="container mx-auto px-4">
            <Link
              href={`/projects/${slug}`}
              className="flex items-center text-sm text-muted-foreground hover:text-primary mb-4"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to {project_name}
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">{name}</h1>
            <div className="flex items-center mt-2 text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Kolom Kiri - Galeri dan Detail */}
            <div className="lg:col-span-2 space-y-8">
              {/* Galeri Gambar dengan Modal */}
              <Card>
                <CardContent className="p-0 overflow-hidden rounded-lg">
                  {allImages.length > 0 ? (
                    <div className="space-y-4">
                      {/* Gambar Utama - Clickable */}
                      <div
                        className="relative aspect-video w-full overflow-hidden rounded-t-lg cursor-pointer group"
                        onClick={() =>
                          openImageModal(
                            allImages.findIndex(
                              (img) => img === (activeImage || allImages[0])
                            )
                          )
                        }
                      >
                        <Image
                          src={activeImage || allImages[0]}
                          alt={name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {/* Overlay dengan ikon zoom */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
                            <ZoomIn className="h-6 w-6 text-gray-800" />
                          </div>
                        </div>
                        {/* Badge jumlah foto */}
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          {allImages.findIndex(
                            (img) => img === (activeImage || allImages[0])
                          ) + 1}{" "}
                          / {allImages.length}
                        </div>
                      </div>

                      {/* Thumbnail Carousel - Clickable */}
                      {allImages.length > 1 && (
                        <Carousel className="px-4 pb-4">
                          <CarouselContent>
                            {allImages.map((image, index) => (
                              <CarouselItem
                                key={index}
                                className="basis-1/4 md:basis-1/5 lg:basis-1/6"
                              >
                                <div
                                  className={`relative aspect-square rounded-md overflow-hidden cursor-pointer border-2 transition-all duration-200 hover:scale-105 ${
                                    activeImage === image
                                      ? "border-primary shadow-lg"
                                      : "border-transparent hover:border-primary/50"
                                  }`}
                                  onClick={() => {
                                    setActiveImage(image);
                                    openImageModal(index);
                                  }}
                                >
                                  <Image
                                    src={image}
                                    alt={`${name} - image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                  {/* Overlay untuk thumbnail */}
                                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="-left-2" />
                          <CarouselNext className="-right-2" />
                        </Carousel>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video w-full flex items-center justify-center bg-muted">
                      <p className="text-muted-foreground">
                        No images available
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Modal Image Viewer */}
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-7xl w-full h-[90vh] p-0 bg-black/95 border-none">
                  <VisuallyHidden.Root>
                    <DialogTitle>Image Viewer</DialogTitle>
                  </VisuallyHidden.Root>
                  <div className="relative w-full h-full flex items-center justify-center">
                    {/* Download Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-4 right-16 z-50 bg-white/10 hover:bg-white/20 text-white"
                      onClick={() =>
                        downloadImage(allImages[modalImageIndex], name)
                      }
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    {/* Navigation Buttons */}
                    {allImages.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="absolute left-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                          onClick={() => navigateImage("prev")}
                        >
                          <ChevronLeft className="h-8 w-8" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="absolute right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3"
                          onClick={() => navigateImage("next")}
                        >
                          <ChevronRight className="h-8 w-8" />
                        </Button>
                      </>
                    )}

                    {/* Main Image */}
                    <div className="relative w-full h-full max-w-6xl max-h-[80vh] mx-4">
                      <Image
                        src={allImages[modalImageIndex]}
                        alt={`${name} - image ${modalImageIndex + 1}`}
                        fill
                        className="object-contain"
                        quality={100}
                      />
                    </div>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm">
                      {modalImageIndex + 1} / {allImages.length}
                    </div>

                    {/* Thumbnail Navigation */}
                    {allImages.length > 1 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex justify-center">
                          <div className="flex gap-2 bg-white/10 p-2 rounded-lg max-w-md overflow-x-auto">
                            {allImages.map((image, index) => (
                              <div
                                key={index}
                                className={`relative w-12 h-12 rounded cursor-pointer border-2 transition-all ${
                                  index === modalImageIndex
                                    ? "border-white"
                                    : "border-transparent hover:border-white/50"
                                }`}
                                onClick={() => setModalImageIndex(index)}
                              >
                                <Image
                                  src={image}
                                  alt={`Thumbnail ${index + 1}`}
                                  fill
                                  className="object-cover rounded"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {/* Tabs untuk Detail, Fitur, dan Lokasi */}
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full grid grid-cols-3 mb-6">
                  <TabsTrigger value="details">Detail Unit</TabsTrigger>
                  <TabsTrigger value="features">Fitur & Fasilitas</TabsTrigger>
                  <TabsTrigger value="location">Lokasi</TabsTrigger>
                </TabsList>

                {/* Tab Detail */}
                <TabsContent value="details" className="space-y-6">
                  {/* Deskripsi */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Deskripsi</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div 
                        className="prose prose-sm md:prose max-w-none prose-headings:text-foreground prose-p:text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: description || "" }}
                      />
                    </CardContent>
                  </Card>

                  {/* Spesifikasi Unit */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Spesifikasi Unit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Ruler className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Dimensi</h3>
                              <p className="text-muted-foreground">
                                {dimensions}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Ruler className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Luas Tanah</h3>
                              <p className="text-muted-foreground">
                                {land_area} m²
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Ruler className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Luas Bangunan</h3>
                              <p className="text-muted-foreground">
                                {building_area} m²
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Shield className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Sertifikasi</h3>
                              <p className="text-muted-foreground">
                                {certification}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Car className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Carport</h3>
                              <p className="text-muted-foreground">
                                {carports || "-"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <Building className="h-5 w-5 text-primary mt-0.5" />
                            <div>
                              <h3 className="font-medium">Jumlah Lantai</h3>
                              <p className="text-muted-foreground">
                                {floors || "1"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Alamat Lengkap */}
                  {address && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Alamat Lengkap</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground whitespace-pre-line">
                          {address}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Tab Fitur & Fasilitas */}
                <TabsContent value="features" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Fasilitas Unit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {facilitiesList && facilitiesList.length > 0 ? (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {facilitiesList.map((facility, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                              <span>{facility}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">
                          Tidak ada informasi fasilitas
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Video YouTube jika ada */}
                  {youtube_url && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Video Unit</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-video w-full overflow-hidden rounded-md">
                          <iframe
                            src={youtube_url}
                            title={`${name} Video`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full"
                          ></iframe>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Tab Lokasi */}
                <TabsContent value="location" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Lokasi Unit</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Placeholder untuk peta - bisa diintegrasikan dengan Google Maps */}
                      <div className="aspect-video w-full bg-muted rounded-md flex items-center justify-center">
                        <p className="text-muted-foreground">
                          Peta lokasi akan ditampilkan di sini
                        </p>
                      </div>

                      <div className="mt-6">
                        <h3 className="font-medium mb-3">Keunggulan Lokasi:</h3>
                        <ul className="space-y-2">
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Lokasi strategis di {location}</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>Akses mudah ke pusat kota</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>
                              Dekat dengan fasilitas pendidikan dan kesehatan
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <span>
                              Area berkembang dengan potensi investasi tinggi
                            </span>
                          </li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Kolom Kanan - Informasi Harga dan Kontak */}
            <div className="space-y-6">
              {/* Kartu Informasi Harga */}
              <Card className="sticky top-6">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">Informasi Unit</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Status Unit */}
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status</span>
                    <Badge
                      variant={
                        status === "sold"
                          ? "destructive"
                          : status === "reserved"
                          ? "outline"
                          : "default"
                      }
                    >
                      {status === "sold"
                        ? "Sold"
                        : status === "reserved"
                        ? "Reserved"
                        : "Available"}
                    </Badge>
                  </div>

                  {/* Harga */}
                  <div>
                    <span className="text-muted-foreground">Harga Jual</span>
                    <div className="text-2xl font-bold text-primary mt-1">
                      {formatCurrency(sale_price)}
                    </div>
                  </div>

                  <Separator />

                  {/* Ringkasan Properti */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Ringkasan Properti</h3>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">
                          Type Project
                        </span>
                        <p className="capitalize">
                          {project_status === "residential"
                            ? "Residential"
                            : project_status === "commercial"
                            ? "Commercial"
                            : "Residential"}
                        </p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">
                          Nama Proyek
                        </span>
                        <p>{project_name}</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">
                          Luas Tanah
                        </span>
                        <p>{land_area} m²</p>
                      </div>

                      <div>
                        <span className="text-muted-foreground">
                          Luas Bangunan
                        </span>
                        <p>{building_area} m²</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Tombol Kontak */}
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-green-500 hover:bg-green-600"
                      size="lg"
                      asChild
                    >
                      <a
                        href={`https://wa.me/6281387118533?text=Halo,%20saya%20tertarik%20dengan%20unit%20${encodeURIComponent(
                          name
                        )}%20di%20proyek%20${encodeURIComponent(
                          project_name
                        )}.%20Bisa%20tolong%20berikan%20informasi%20lebih%20lanjut?`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> Chat WhatsApp
                      </a>
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                      <a
                        href={`mailto:rijal.sutanto@paramount-land.com?subject=Informasi%20tentang%20${encodeURIComponent(
                          name
                        )}%20di%20${encodeURIComponent(project_name)}`}
                        className="flex items-center justify-center"
                      >
                        <Mail className="mr-2 h-4 w-4" /> Kirim Email
                      </a>
                    </Button>
                  </div>

                  {/* Brosur jika ada */}
                  {brochure_url && (
                    <div className="pt-2">
                      <Button variant="link" className="w-full" asChild>
                        <Link href={brochure_url} target="_blank">
                          <FileText className="mr-2 h-4 w-4" /> Unduh Brosur
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Promo Section */}
              {promo && (
                <div className="mb-6">
                  <UnitPromoCard promoText={promo} />
                </div>
              )}

              {/* Kartu Lihat Unit Lainnya */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">
                    Unit Lainnya di {project_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <UnitSidebarCards
                    projectId={project_id}
                    projectSlug={slug}
                    currentUnitSlug={unitSlug}
                    projectName={project_name}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
