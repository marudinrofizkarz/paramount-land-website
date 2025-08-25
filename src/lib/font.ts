import { Geist, Geist_Mono } from "next/font/google";

import { cn } from "@/lib/utils";

// Kurangi jumlah font untuk meningkatkan performa loading
const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
  // Tambahkan font fallback untuk meningkatkan performa
  fallback: ["system-ui", "arial", "sans-serif"],
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  fallback: ["monospace"],
});

export const fontVariables = cn(fontSans.variable, fontMono.variable);
