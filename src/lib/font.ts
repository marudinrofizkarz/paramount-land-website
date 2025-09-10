import { Instrument_Sans, Geist_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

// Further optimize font loading for performance
const fontSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  // Optimize with fallback for better performance
  fallback: ["system-ui", "arial", "sans-serif"],
  // Only load necessary weights to reduce bundle size
  weight: ["400", "500", "600", "700"],
  adjustFontFallback: true,
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
  // Only load necessary weights
  weight: ["400", "500"],
  adjustFontFallback: true,
});

export const fontVariables = cn(fontSans.variable, fontMono.variable);
