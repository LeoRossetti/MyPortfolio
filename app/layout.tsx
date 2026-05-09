import { headers } from "next/headers";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SmoothScrollProvider } from "@/components/animation/SmoothScrollProvider";
import { TerminalBoot } from "@/components/animation/TerminalBoot";
import { SiteBackdrop } from "@/components/layout/SiteBackdrop";
import ClickSpark from "@/components/reactbits/ClickSpark";
import { LocaleTransition } from "@/components/animation/LocaleTransition";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const spaceGrotesk = Space_Grotesk({ variable: "--font-space-grotesk", subsets: ["latin"], display: "swap" });

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // proxy.ts sets x-locale on every request (Task 9). If absent (e.g. during
  // static-asset build), fall back to defaultLocale.
  const hdrs = await headers();
  const headerLocale = hdrs.get("x-locale");
  const locale = headerLocale && isLocale(headerLocale) ? headerLocale : defaultLocale;
  const htmlLang = locale === "pt" ? "pt-BR" : "en";

  return (
    <html
      lang={htmlLang}
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <SiteBackdrop />
        <SmoothScrollProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
          </TooltipProvider>
        </SmoothScrollProvider>
        <TerminalBoot />
        <ClickSpark />
        <LocaleTransition />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
