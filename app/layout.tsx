import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { TerminalBoot } from "@/components/animation/TerminalBoot";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Leo Rossetti — Full-stack Developer",
    template: "%s · Leo Rossetti",
  },
  description:
    "Full-stack developer. Ships products, not prototypes. TypeScript, React, Next.js, React Native, Node.js, Python, C#.",
  applicationName: "Leo Rossetti Portfolio",
  authors: [{ name: "Leo Rossetti" }],
  creator: "Leo Rossetti",
  keywords: [
    "Leo Rossetti",
    "full-stack developer",
    "TypeScript",
    "React",
    "Next.js",
    "React Native",
    "Node.js",
    "Convex",
    "Clerk",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Leo Rossetti — Full-stack Developer",
    description:
      "Full-stack developer. Ships products, not prototypes.",
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Leo Rossetti",
  },
  twitter: {
    card: "summary_large_image",
    title: "Leo Rossetti — Full-stack Developer",
    description:
      "Full-stack developer. Ships products, not prototypes.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <SmoothScrollProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </TooltipProvider>
        </SmoothScrollProvider>
        <TerminalBoot />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
