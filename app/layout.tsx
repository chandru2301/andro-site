import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers/providers";
import { getSiteUrl, site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const title = "Andro — The intelligence layer for AI engineering agents";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: title,
    template: "%s — Andro",
  },
  description: site.description,
  keywords: [
    "Andro",
    "code intelligence",
    "context engine",
    "code knowledge graph",
    "AI coding agents",
    "MCP",
    "Claude Code",
    "Codex",
    "Gemini CLI",
    "hybrid search",
    "symbol graph",
  ],
  openGraph: {
    title,
    description: site.description,
    siteName: "Andro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#040405",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="min-h-dvh bg-ink text-fg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
