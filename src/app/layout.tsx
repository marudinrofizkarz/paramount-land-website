import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { fontVariables } from "@/lib/font";
import { WhatsAppLayout } from "@/components/whatsapp-layout";
import { constructMetadata } from "./metadata";
import { OrganizationSchemaScript } from "@/components/schema-script";

export const metadata: Metadata = constructMetadata({
  title: "Paramount Land - Building Homes and People with Heart",
  description:
    "Property development and management with a focus on creating meaningful living spaces and communities",
  icons:
    "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          // Menyembunyikan opsi sign up di semua halaman
          footerActionLink: "hidden",
          // Menyembunyikan tombol social login (Google, dsb)
          socialButtonsIconButton: "hidden",
          // Menyembunyikan divider "OR" antara social login dan email
          dividerRow: "hidden",
        },
      }}
    >
      <html lang="id" suppressHydrationWarning>
        <head>
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-NGP2NRJL');`,
            }}
          />
          {/* End Google Tag Manager */}

          {/* Google Analytics 4 (GA4) */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-E0LM9C8Y6G"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-E0LM9C8Y6G');
              `,
            }}
          />
          {/* End Google Analytics 4 */}

          {/* SEO Meta Tags */}
          <meta name="format-detection" content="telephone=no" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="language" content="id-ID" />
          <meta name="revisit-after" content="7 days" />
          <meta name="distribution" content="global" />
          <meta name="rating" content="general" />
          <meta name="geo.region" content="ID" />
          <meta name="geo.placename" content="Indonesia" />
          <link
            rel="alternate"
            hrefLang="id"
            href="https://www.rizalparamountland.com"
          />
          <link
            rel="alternate"
            hrefLang="x-default"
            href="https://www.rizalparamountland.com"
          />

          {/* Preconnect and preload for performance */}
          <link rel="preconnect" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
          <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        </head>
        <body className={fontVariables} suppressHydrationWarning>
          {/* Google Tag Manager (noscript) */}
          <noscript
            dangerouslySetInnerHTML={{
              __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-NGP2NRJL"
            height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
            }}
          />
          {/* End Google Tag Manager (noscript) */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <WhatsAppLayout>{children}</WhatsAppLayout>
            <OrganizationSchemaScript />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
