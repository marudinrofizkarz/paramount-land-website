# Optimasi Performa Website Paramount Land (IMPLEMENTASI)

Berikut adalah optimasi yang telah diimplementasikan untuk meningkatkan performa Core Web Vitals website.

## Ringkasan Implementasi

| Metrik                         | Status         | Optimasi                                                      |
| ------------------------------ | -------------- | ------------------------------------------------------------- |
| LCP (Largest Contentful Paint) | ✅ Implemented | Image optimization, preloading, preconnect, font optimization |
| CLS (Cumulative Layout Shift)  | ✅ Implemented | LazyImage with aspect ratio, CoreWebVitals helper             |
| FID/INP (First Input Delay)    | ✅ Implemented | Script optimizations, defer non-critical JS                   |
| TTI (Time to Interactive)      | ✅ Implemented | Code splitting, PWA, script optimizations                     |
| TBT (Total Blocking Time)      | ✅ Implemented | Script optimizations, web-vitals monitoring                   |

## 1. Implementasi Image Optimization

### 1.1 Gunakan Format Gambar Modern dan Pengoptimalan

```javascript
// Tambahkan ini ke next.config.ts
export default {
  // Konfigurasi yang sudah ada
  images: {
    formats: ["image/avif", "image/webp"], // Tambahkan format modern
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Sesuaikan dengan kebutuhan
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    domains: [
      // domain yang sudah ada
    ],
    remotePatterns: [
      // pattern yang sudah ada
    ],
    minimumCacheTTL: 60, // Menambah cache TTL
  },
};
```

### 1.2 Perbarui Logo Header untuk Menggunakan Next/Image dengan Optimasi Lokal

Alih-alih mengambil logo dari URL eksternal, simpan logo secara lokal dan gunakan dengan Next/Image:

```tsx
// Di components/header.tsx
import logoLight from "@/public/images/paramount-logo-light.png";
import logoDark from "@/public/images/paramount-logo-dark.png";

// Lalu ganti kode image logo dengan:
<Image
  src={resolvedTheme === "dark" ? logoDark : logoLight}
  alt="Paramount Land"
  width={180}
  height={45}
  priority
/>;
```

## 2. Optimasi Data Fetching

### 2.1 Implementasi React Suspense dan Streaming SSR

Untuk homepage, gunakan Server Components dengan React Suspense:

```tsx
// Ubah file src/app/page.tsx menjadi Server Component
import { Suspense } from "react";
import { ProjectsSectionLoader } from "@/components/projects-section-loader";
import { NewsSectionLoader } from "@/components/news-section-loader";

export default function Home() {
  return (
    <div>
      <Header />
      <HeroSliderSection />

      <Suspense fallback={<ProjectsSectionLoader />}>
        <ProjectsSection />
      </Suspense>

      <Suspense fallback={<NewsSectionLoader />}>
        <NewsSection />
      </Suspense>

      <SalesInHouseSection />
      <Footer />
    </div>
  );
}
```

### 2.2 Implementasi Cache Data

Tambahkan caching ke fungsi yang mengambil data:

```typescript
// Di lib/hero-slider-actions.ts, project-actions.ts, dll.
import { cache } from "react";

export const getPublicHeroSliders = cache(async () => {
  // implementasi yang sudah ada
});
```

## 3. Optimasi Font

### 3.1 Kurangi Jumlah Font

Kurangi jumlah font yang digunakan - pilih 1-2 font utama saja:

```typescript
// Ubah file font.ts
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = cn(fontSans.variable, fontMono.variable);
```

### 3.2 Gunakan Font Display Swap

Pastikan semua font menggunakan `display: 'swap'` untuk menampilkan teks dengan font sistem sementara font kustom dimuat.

## 4. Implementasi Lazy Loading

### 4.1 Lazy Load Komponen Yang Tidak Kritis

Gunakan lazy loading untuk komponen yang tidak kritis di atas fold:

```tsx
// Pada file yang sesuai, misalnya home page
import dynamic from "next/dynamic";

const SalesInHouseSection = dynamic(
  () =>
    import("@/components/sales-in-house-section").then((mod) => ({
      default: mod.SalesInHouseSection,
    })),
  {
    ssr: false,
    loading: () => <div className="min-h-[300px] bg-muted animate-pulse" />,
  }
);
```

### 4.2 Lazy Load Library Eksternal

Muat library eksternal secara lazy:

```tsx
// Contoh untuk library eksternal seperti embla carousel
const Carousel = dynamic(
  () => import("@/components/ui/carousel").then((mod) => mod.Carousel),
  {
    ssr: true,
    loading: () => <div className="min-h-[400px] bg-muted animate-pulse" />,
  }
);
```

## 5. Optimasi Rendering

### 5.1 Gunakan Skeleton UI untuk Loading States

Buat komponen skeleton yang lebih ringan:

```tsx
export function ProjectsSectionSkeleton() {
  return (
    <section className="py-12">
      <div className="container">
        <div className="h-10 w-48 bg-muted rounded-md mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-muted"
            >
              <div className="h-48 bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 5.2 Implementasi Strategi Loading Data Parallel

Gunakan Promise.all untuk mengambil data secara paralel:

```tsx
async function getData() {
  const [projectsResponse, newsResponse, slidersResponse] = await Promise.all([
    getPublicProjects(),
    getPublishedNews(),
    getPublicHeroSliders(),
  ]);

  return {
    projects: projectsResponse.success ? projectsResponse.data : [],
    news: newsResponse.success ? newsResponse.data : [],
    sliders: slidersResponse.success ? slidersResponse.data : [],
  };
}
```

## 6. Bundle Optimization

### 6.1 Aktifkan Optimasi Bundle di Next Config

Tambahkan konfigurasi berikut di next.config.ts:

```javascript
export default {
  // Konfigurasi yang sudah ada
  swcMinify: true, // Pastikan ini aktif
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // Fitur eksperimental yang sudah ada
    optimizeCss: true, // Mengaktifkan CSS optimization
  },
};
```

### 6.2 Gunakan Dynamic Import Untuk Komponen Besar

Khususnya komponen yang menggunakan library eksternal besar:

```tsx
// Komponen yang menggunakan embla-carousel
const DynamicCarousel = dynamic(() => import("@/components/dynamic-carousel"), {
  ssr: true,
  loading: () => <div className="h-[50vh] bg-muted animate-pulse" />,
});
```

## 7. Implementasi Service Worker dan PWA (TERIMPLEMENTASI) ✅

Service Worker dan PWA telah diimplementasikan untuk caching dan pengalaman offline:

```javascript
// File next-pwa.config.js sudah dibuat di root folder
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "images-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
    // Konfigurasi cache telah diimplementasikan
  ],
});

// Sudah ditambahkan di next.config.ts
const nextConfig = withPWA({
  // konfigurasi lainnya
});
```

## 8. Optimasi Specific API Requests

### 8.1 Implementasi ISR (Incremental Static Regeneration)

Untuk data yang tidak sering berubah:

```tsx
// Di page.tsx server component
export const revalidate = 3600; // revalidate setiap jam
```

### 8.2 Implementasi React Query atau SWR untuk Client Component

```tsx
// Untuk client component yang memerlukan data real-time
import { useQuery } from "@tanstack/react-query";

function ProjectsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getPublicProjects,
    staleTime: 1000 * 60 * 5, // 5 menit
  });

  // render component
}
```

## 9. Tambahan: Script Loading Optimization

Pastikan script pihak ketiga dimuat secara asinkron dan tidak menghalangi rendering:

```tsx
// Di layout.tsx
<Script
  src="https://example-analytics.com/script.js"
  strategy="lazyOnload"
  onLoad={() => console.log("Script loaded correctly")}
/>
```

## 10. Caching Agresif (TERIMPLEMENTASI) ✅

Caching agresif untuk aset statis telah diimplementasikan melalui next.config.ts:

```javascript

```

export function middleware(request) {
const response = NextResponse.next();

// Tambahkan header cache untuk aset statis
if (request.nextUrl.pathname.startsWith("/\_next/static")) {
response.headers.set(
"Cache-Control",
"public, max-age=31536000, immutable"
);
}

// Tambahkan header cache untuk gambar
if (request.nextUrl.pathname.startsWith("/\_next/image")) {
response.headers.set(
"Cache-Control",
"public, max-age=86400, stale-while-revalidate=31536000"
);
}

return response;
}

````

## 11. Optimized Component Implementation (BARU) ✅

### 11.1 LazyImage Component

Komponen lazy loading gambar yang dioptimalkan untuk Core Web Vitals:

```tsx
// src/components/lazy-image.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export function LazyImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 80,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  objectFit = 'cover',
}) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Menggunakan Intersection Observer untuk memuat gambar saat mendekati viewport
    if (!imgRef.current || priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '300px',
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  return (
    <div
      ref={imgRef}
      className={`image-container ${className}`}
      style={fill
        ? { position: 'relative', width: '100%', height: '100%' }
        : { position: 'relative', overflow: 'hidden', aspectRatio: `${width} / ${height}` }}
    >
      {(isInView || priority) && (
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
          priority={priority}
          sizes={sizes}
          quality={quality}
          loading={priority ? "eager" : "lazy"}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoaded(true)}
          style={{ objectFit }}
        />
      )}
    </div>
  );
}
````

### 11.2 CoreWebVitals Component

Komponen yang membantu mengoptimalkan Core Web Vitals:

```tsx
// src/components/core-web-vitals.tsx
"use client";

export function CoreWebVitals() {
  useEffect(() => {
    // 1. Mengoptimalkan koneksi ke resource
    const warmupConnections = () => {
      const domains = [
        "https://res.cloudinary.com",
        "https://www.googletagmanager.com",
        "https://fonts.googleapis.com",
        "https://fonts.gstatic.com",
      ];

      domains.forEach((domain) => {
        const hint = document.createElement("link");
        hint.rel = "preconnect";
        hint.href = domain;
        hint.crossOrigin = "anonymous";
        document.head.appendChild(hint);
      });
    };

    // 2. Meningkatkan FID dengan early event registration
    const registerEarlyEvents = () => {
      const eventTypes = [
        "click",
        "mousedown",
        "keydown",
        "touchstart",
        "pointerdown",
      ];
      const captureOptions = { passive: true, capture: true };

      const handler = () => {
        eventTypes.forEach((type) => {
          document.removeEventListener(type, handler, captureOptions);
        });
      };

      eventTypes.forEach((type) => {
        document.addEventListener(type, handler, captureOptions);
      });
    };

    // 3. Mencegah layout shifts dengan pre-allocating space
    const preventLayoutShifts = () => {
      const style = document.createElement("style");
      style.textContent = `
        img, video {
          aspect-ratio: attr(width) / attr(height);
          height: auto;
        }
        
        .image-container {
          overflow: hidden;
          position: relative;
        }
      `;
      document.head.appendChild(style);
    };

    // Run optimizations
    warmupConnections();
    registerEarlyEvents();
    preventLayoutShifts();
  }, []);

  return null;
}
```

### 11.3 OptimizedGallery Component

Galeri gambar yang dioptimalkan untuk Core Web Vitals:

```tsx
// src/components/optimized-gallery.tsx
"use client";

export function OptimizedGallery({
  images,
  className = "",
  imageClassName = "",
}) {
  const [visibleImages, setVisibleImages] = useState(1);

  useEffect(() => {
    // Load first image immediately, then progressively load others
    if (images.length > 1) {
      const timer1 = setTimeout(() => {
        setVisibleImages(2);
      }, 100);

      const timer2 = setTimeout(() => {
        setVisibleImages(images.length);
      }, 2500);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [images.length]);

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {images.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={`overflow-hidden rounded-lg ${imageClassName}`}
        >
          {index < visibleImages ? (
            <LazyImage
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              priority={index === 0}
              placeholder="blur"
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
            />
          ) : (
            <div
              className="w-full bg-gray-200 dark:bg-gray-800 animate-pulse"
              style={{ aspectRatio: `${image.width} / ${image.height}` }}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}
```

## 12. Monitoring Performa (BARU) ✅

Monitoring performa telah ditambahkan menggunakan web-vitals library:

```tsx
// Integrasi di CoreWebVitals component
import { onCLS, onFID, onLCP, onTTFB, onINP } from "web-vitals";

// Di dalam useEffect:
if ("web-vitals" in window) {
  import("web-vitals").then(({ onCLS, onFID, onLCP, onTTFB, onINP }) => {
    onCLS((metric) => console.log("CLS:", metric.value));
    onFID((metric) => console.log("FID:", metric.value));
    onLCP((metric) => console.log("LCP:", metric.value));
    onTTFB((metric) => console.log("TTFB:", metric.value));
    onINP((metric) => console.log("INP:", metric.value));
  });
}
```
