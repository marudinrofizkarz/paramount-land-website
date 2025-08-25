import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { fontVariables } from "@/lib/font";
import { WhatsAppLayout } from "@/components/whatsapp-layout";
import { constructMetadata } from "./metadata";

export const metadata: Metadata = constructMetadata({
  title: "Paramount Land - Building Homes and People with Heart",
  description:
    "Property development and management with a focus on creating meaningful living spaces and communities",
  icons: {
    icon: "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
    shortcut:
      "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
    apple:
      "https://res.cloudinary.com/dx7xttb8a/image/upload/v1754146325/logo_xhylzg.jpg",
  },
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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={fontVariables} suppressHydrationWarning>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <WhatsAppLayout>{children}</WhatsAppLayout>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
